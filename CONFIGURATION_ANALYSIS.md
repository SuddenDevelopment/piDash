# piDashboard Configuration System Analysis

## Executive Summary

The piDashboard application uses a **two-tier configuration system** where configurations are managed through an Express.js API server (port 3001) separate from the main application. The system attempts to load a custom configuration first, with a fallback to a default configuration if no custom config exists.

---

## 1. Configuration Flow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard Application                     │
│                  (Expo/React Native Web)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    (http://localhost:3001)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Configuration API Server (config-api.js)        │
│                   Running on Port 3001                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
         ┌──────────────────┴──────────────────┐
         ↓                                      ↓
    [Custom Config]                    [Default Config]
/config/dashboards/            /config/dashboards/
custom-dashboard.json          mvp-test.json
```

---

## 2. How Configuration is Saved

### Location: `app/settings.tsx`

The **Settings page** is where users configure dashboards:

1. **Configuration Loading** (lines 112-155):
   - Makes a GET request to `http://localhost:3001/api/config`
   - The API returns the current configuration and its source ('custom' or 'default')

2. **Configuration Saving** (lines 157-211):
   ```typescript
   // User saves configuration by clicking "Save Config" button
   POST http://localhost:3001/api/config
   Body: { config: parsedConfig }
   ```
   
   The saved configuration is stored at:
   - **File Path**: `config/dashboards/custom-dashboard.json`
   - **Response**: Confirms save with timestamp and path

3. **Version Bumping** (lines 193-198):
   After saving, the app automatically bumps the deployment version:
   ```typescript
   POST http://localhost:3001/api/version/bump
   ```
   This triggers automatic reload on the dashboard via polling

---

## 3. Where Saved Configuration is Stored

### Primary Location (Custom Configuration):
- **File Path**: `config/dashboards/custom-dashboard.json`
- **Created by**: User saving configuration in settings page
- **Format**: JSON
- **Structure**: Must include `version` and `pages` fields

### Fallback Location (Default Configuration):
- **File Path**: `config/dashboards/mvp-test.json`
- **Used when**: `custom-dashboard.json` doesn't exist
- **Format**: JSON
- **Contents**: Complete dashboard specification with 8 pages (Welcome, Row Layout, Column Layout, Nested Layout, Label Positions, 3 Columns, Image Overlay, Quadrants)

### CSS Theme Storage:
- **File Path**: `public/styles/dashboard-theme.css`
- **Managed separately** from JSON configuration
- **Endpoint**: `POST /api/css` to save

---

## 4. How piDashboard Loads Configuration at Runtime

### Main Application Loading: `app/index.tsx`

**Step 1: Initial State (lines 9-18)**
```typescript
const defaultConfig = require('../config/dashboards/mvp-test.json');

export default function Dashboard() {
  const [config, setConfig] = useState(defaultConfig);  // Hardcoded default
  const [configSource, setConfigSource] = useState<'default' | 'custom'>('default');
  // ...
}
```

**Step 2: Mount Effects (lines 20-33)**
```typescript
useEffect(() => {
  loadConfig();              // Try to load from API
  loadInitialVersion();      // Get deployment version for polling
}, []);

// Poll every 3 seconds for version changes (auto-reload on updates)
useEffect(() => {
  const interval = setInterval(() => {
    checkForNewVersion();
  }, 3000);
  return () => clearInterval(interval);
}, [deploymentVersion]);
```

**Step 3: Load Configuration from API (lines 35-61)**
```typescript
const loadConfig = async () => {
  try {
    const cacheBuster = Date.now();
    const response = await fetch(
      `http://localhost:3001/api/config?_=${cacheBuster}`,
      {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }
    );
    const data = await response.json();

    if (data.success) {
      setConfig(data.config);           // Use custom or default
      setConfigSource(data.source);     // Log source
      console.log(`Dashboard loaded from ${data.source} config`);
    }
    setLoading(false);
  } catch (error) {
    // Fallback to embedded default if API is not available
    console.log('API not available, using default config');
    setConfig(defaultConfig);
    setConfigSource('default');
    setLoading(false);
  }
};
```

**Step 4: Deployment Version Polling (lines 82-101)**
```typescript
const checkForNewVersion = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/version`);
    const data = await response.json();

    if (data.success && deploymentVersion !== null) {
      if (data.version !== deploymentVersion) {
        console.log('New deployment detected! Refreshing...');
        window.location.reload();  // Force full page reload
      }
    }
  } catch (error) {
    // Ignore errors during polling
  }
};
```

---

## 5. Configuration API Server Details

### Location: `server/config-api.js`

**Key Endpoints:**

| Endpoint | Method | Purpose | Returns |
|----------|--------|---------|---------|
| `/api/config` | GET | Load current config | `{ success, source, config, paths }` |
| `/api/config` | POST | Save new config | `{ success, message, path, timestamp }` |
| `/api/css` | GET | Load CSS theme | `{ success, css, path }` |
| `/api/css` | POST | Save CSS theme | `{ success, message, path, timestamp }` |
| `/api/version` | GET | Get deployment version | `{ success, version, timestamp }` |
| `/api/version/bump` | POST | Bump version (triggers reload) | `{ success, version, timestamp }` |

**Configuration Loading Logic** (lines 145-168):
```javascript
app.get('/api/config', async (req, res) => {
  try {
    const { content, source } = await readFileWithFallback(
      CONFIG_PATH,           // config/dashboards/custom-dashboard.json
      DEFAULT_CONFIG_PATH    // config/dashboards/mvp-test.json
    );
    const config = JSON.parse(content);

    res.json({
      success: true,
      source,        // 'custom' or 'default'
      config,
      paths: {
        custom: CONFIG_PATH,
        default: DEFAULT_CONFIG_PATH
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load configuration'
    });
  }
});
```

**readFileWithFallback Logic** (lines 127-143):
```javascript
async function readFileWithFallback(primaryPath, fallbackPath) {
  try {
    const content = await fs.readFile(primaryPath, 'utf-8');
    return { content, source: 'custom' };  // ← PRIMARY
  } catch (error) {
    if (error.code === 'ENOENT' && fallbackPath) {
      try {
        const content = await fs.readFile(fallbackPath, 'utf-8');
        return { content, source: 'default' };  // ← FALLBACK
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
    throw error;
  }
}
```

---

## 6. Why Default Configuration Might Load Instead of Saved Configuration

### Possible Causes:

#### 1. **API Server Not Running**
- **Problem**: The dashboard app expects the API server on `http://localhost:3001`
- **If API fails**: Falls back to embedded `mvp-test.json` (line 54-59 in index.tsx)
- **Fix**: Run `npm run api` in a separate terminal before starting the dashboard

#### 2. **Custom Config File Doesn't Exist**
- **File**: `config/dashboards/custom-dashboard.json` must exist
- **If missing**: API returns default `mvp-test.json` (expected behavior)
- **Fix**: Save a configuration through the settings page first

#### 3. **Custom Config File is Invalid JSON**
- **Problem**: JSON parsing fails in API or in settings
- **If fails**: Displays validation error to user
- **Fix**: Use "Format JSON" button in settings page to validate

#### 4. **Cached Fetch Responses**
- **Issue**: Browser cache can return stale config
- **Solution**: App uses cache-busting parameter `_=${Date.now()}`
- **Headers**: Includes `Cache-Control: no-cache` and `Pragma: no-cache`

#### 5. **Incorrect File Path in API**
- **Path**: Hardcoded as `config/dashboards/custom-dashboard.json`
- **Must be exact**: If file is in different location, won't be found
- **Check**: Verify path matches deployment environment

#### 6. **Permission Issues**
- **Problem**: API cannot write to custom-dashboard.json (file permissions)
- **Symptoms**: Save succeeds but config doesn't persist
- **Fix**: Check file permissions with `ls -la config/dashboards/`

#### 7. **Configuration Source Mismatch**
- **Storage**: Settings page shows "Custom" or "Default Template" badge
- **If shows "Default"**: Custom config doesn't exist or wasn't saved
- **Fix**: Navigate to settings, modify config, click "Save Config"

---

## 7. Configuration Loading Sequence Diagram

```
Dashboard App Startup
│
├─ [1] Initialize with embedded default config
│       └─ setConfig(defaultConfig) from mvp-test.json
│
├─ [2] Mount effect triggered
│       ├─ loadConfig()
│       └─ loadInitialVersion()
│
├─ [3] Fetch from API (GET /api/config)
│       │
│       ├─ API tries: config/dashboards/custom-dashboard.json
│       │
│       └─ If NOT found:
│           └─ API tries: config/dashboards/mvp-test.json
│
├─ [4] API response received
│       ├─ Update config state: setConfig(data.config)
│       ├─ Update source: setConfigSource(data.source)
│       └─ Log: "Dashboard loaded from [source] config"
│
├─ [5] Polling interval every 3 seconds
│       ├─ Fetch /api/version
│       ├─ Compare with current deploymentVersion
│       └─ If different: window.location.reload()
│
└─ [6] Dashboard renders with loaded config
        └─ DashboardRenderer validates and displays pages
```

---

## 8. Complete Configuration File Locations

### Source Files:
- **Custom Config**: `config/dashboards/custom-dashboard.json`
- **Default Config**: `config/dashboards/mvp-test.json`
- **CSS Theme**: `public/styles/dashboard-theme.css`
- **Deployment Version File**: `.deployment-version`

### Runtime Access:
- **Dashboard App**: `http://localhost:3000` (Expo)
- **Settings Page**: `http://localhost:3000/settings` (config builder)
- **API Server**: `http://localhost:3001` (REST endpoints)
- **API Base**: Defined in both `app/index.tsx` and `app/settings.tsx` as `http://localhost:3001`

---

## 9. Settings Context (Local-Only Settings)

**Note**: The `SettingsContext` (`contexts/SettingsContext.tsx`) manages **different** settings:
- **Scope**: Local UI settings only (e.g., `autoTransitionEnabled`)
- **Storage**: AsyncStorage (browser local storage or React Native equivalent)
- **Key**: `@pidash_settings`
- **NOT used for**: Dashboard configuration (which is file-based)

---

## 10. How to Verify Configuration Loading

### Check logs in browser console (F12):
```
✓ "Dashboard loaded from custom config"  → Custom file being used
✓ "Dashboard loaded from default config" → Default file being used
✓ "API not available, using default config" → API server down
```

### Verify API is working:
```bash
curl http://localhost:3001/api/config
```

### Check if custom config file exists:
```bash
ls -la config/dashboards/
```

Should show both:
- `custom-dashboard.json` (if saved configuration exists)
- `mvp-test.json` (always present)

### Start dashboard with API:
```bash
# Terminal 1: Start API server
npm run api

# Terminal 2: Start dashboard app
npm run web
```

---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Config Storage (Custom)** | `config/dashboards/custom-dashboard.json` |
| **Config Storage (Default)** | `config/dashboards/mvp-test.json` |
| **API Endpoint** | `http://localhost:3001/api/config` |
| **API Port** | 3001 (separate from app) |
| **App Port** | 3000 (Expo) |
| **Loading Strategy** | Try custom first, fallback to default |
| **Save Mechanism** | POST to API, API writes file |
| **Auto-Reload** | Version polling every 3 seconds |
| **Cache Busting** | Timestamp parameter + headers |
| **Validation** | Client-side + server-side |
| **UI for Config** | Settings page (`/settings` route) |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/index.tsx` | Main dashboard app - loads config and polls for updates |
| `app/settings.tsx` | Settings page - UI for editing and saving configuration |
| `server/config-api.js` | REST API server - handles config file I/O |
| `contexts/SettingsContext.tsx` | Local UI settings (NOT dashboard config) |
| `components/dashboard/DashboardRenderer.tsx` | Renders dashboard from config |
| `types/dashboard-schema.ts` | TypeScript types for configuration |
| `config/dashboards/mvp-test.json` | Default dashboard configuration |
| `config/dashboards/custom-dashboard.json` | Custom dashboard (created on save) |

---

## Troubleshooting Guide

If you're not seeing your saved configuration:

1. **Check if API is running**: `npm run api` must be running
2. **Verify custom config exists**: `ls config/dashboards/custom-dashboard.json`
3. **Check browser console**: F12 → Console tab for "Dashboard loaded from X config"
4. **Verify API response**: `curl http://localhost:3001/api/config | jq`
5. **Check file permissions**: `ls -la config/dashboards/`
6. **Validate JSON**: Use "Format JSON" button in settings page
7. **Hard refresh browser**: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
8. **Check deployment version**: App polls every 3 seconds for version changes


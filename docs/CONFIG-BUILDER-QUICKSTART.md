# Configuration Builder - Quick Start

## What Was Built

A complete configuration management system for the PiDash dashboard:

1. **API Server** (`server/config-api.js`)
   - REST API for saving/loading dashboard configs and CSS
   - Runs on port 3001
   - Handles both custom and default configurations

2. **Settings Page** (`app/settings.tsx`)
   - Web-based JSON and CSS editor
   - Available at `/settings` route
   - Tabbed interface for JSON and CSS editing
   - Validation and formatting tools

3. **Dashboard Integration** (`app/index.tsx`)
   - Automatically loads custom configs from API
   - Falls back to default config if API unavailable
   - Shows config source badge (Custom/Default)
   - Supports hot-reloading configurations

4. **Settings Modal Update** (`components/dashboard/SettingsModal.tsx`)
   - Added "Configuration Builder" button
   - Quick navigation to settings page

## Running the System

### Terminal 1: Start API Server
```bash
npm run api
```

### Terminal 2: Start Dashboard
```bash
npm start
```

## Usage Flow

### 1. Access the Configuration Builder
- Open dashboard in browser
- Click settings icon (gear)
- Click "Configuration Builder"
- Or navigate directly to `http://localhost:8081/settings`

### 2. Edit Configuration
**JSON Tab:**
- Edit the dashboard JSON structure
- Click "Format JSON" to auto-format
- Click "Save JSON" to save changes

**CSS Tab:**
- Edit CSS theme variables
- Click "Save CSS" to save changes

### 3. Apply Changes
- Click "Refresh Dashboard" button
- Navigate back to dashboard (or reload page)
- Your changes are now live!

## Configuration Behavior

### First Time Use
- Dashboard loads **default config** (`mvp-test.json`)
- Shows "Default Template" badge in settings

### After Saving Custom Config
- Dashboard loads **custom config** (`custom-dashboard.json`)
- Shows "Custom" badge in settings
- Shows "Custom Config" badge on dashboard

### Fallback System
- If API server is not running → uses default config
- If custom config doesn't exist → uses default config
- Always graceful degradation

## File Locations

```
piDash/
├── server/
│   └── config-api.js          # API server
├── app/
│   ├── index.tsx              # Dashboard (loads configs)
│   └── settings.tsx           # Configuration builder UI
├── config/dashboards/
│   ├── mvp-test.json          # Default template (read-only)
│   └── custom-dashboard.json  # Your custom config (created on first save)
└── public/styles/
    └── dashboard-theme.css    # CSS theme
```

## Features

### JSON Editor
- Syntax validation
- Auto-formatting
- Structure validation (requires version + pages)
- Real-time editing

### CSS Editor
- Direct variable editing
- Immediate save
- Full CSS customization

### Controls
- Format JSON
- Reload configs
- Save changes
- Refresh dashboard
- Navigate back to dashboard

## Development Workflow

1. **Make changes** in the configuration builder
2. **Save** your changes
3. **Refresh** the dashboard
4. **Iterate** - repeat as needed

## What's Next

Now that you have the configuration builder running, you can:

1. Create custom dashboard layouts
2. Modify theme colors and styles
3. Add new pages and panels
4. Test different configurations quickly
5. Build dashboards without touching code

## Pro Tips

- Keep the API server running during development
- Use "Format JSON" before saving to catch errors
- Test changes incrementally
- Keep the default config as a reference
- Use browser dev tools to debug

## Troubleshooting

**Problem:** Settings page shows loading forever
- **Solution:** Make sure API server is running (`npm run api`)

**Problem:** Changes don't appear
- **Solution:** Click "Refresh Dashboard" then reload the page

**Problem:** JSON won't save
- **Solution:** Click "Format JSON" to find syntax errors

**Problem:** Can't access /settings
- **Solution:** Make sure expo dev server is running (`npm start`)

## Architecture

```
┌─────────────────┐
│  Browser        │
│  Dashboard      │◄─── Loads config via HTTP
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Server     │
│  Port 3001      │◄─── Saves/loads files
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  File System    │
│  JSON + CSS     │
└─────────────────┘
```

## Success!

You now have a fully functional configuration builder! The dashboard can be easily customized without editing code files directly.

Start the servers and begin building your custom dashboard!

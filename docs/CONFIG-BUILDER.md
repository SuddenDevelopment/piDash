# Configuration Builder

The Configuration Builder allows you to easily create and edit dashboard configurations through a web-based interface.

## Overview

The Configuration Builder consists of:
- **API Server** - Backend service for saving/loading configs
- **Settings Page** - Web-based editor at `/settings`
- **Dashboard Integration** - Automatic loading of custom configs

## Getting Started

### 1. Start the API Server

The API server must be running to use the configuration builder:

```bash
npm run api
```

The server will start on port 3001 and provide the following endpoints:
- `GET /api/config` - Load dashboard configuration
- `POST /api/config` - Save dashboard configuration
- `GET /api/css` - Load CSS theme
- `POST /api/css` - Save CSS theme
- `POST /api/dashboard/refresh` - Trigger dashboard refresh
- `GET /api/status` - Health check

### 2. Start the Dashboard

In a separate terminal, start the dashboard:

```bash
npm start
```

### 3. Access the Configuration Builder

1. Open the dashboard in your browser
2. Press the settings button (gear icon) to open the settings modal
3. Click "Configuration Builder" to navigate to the settings page
4. Alternatively, navigate directly to `http://localhost:8081/settings`

## Using the Configuration Builder

### Editing Dashboard JSON

1. Switch to the "Dashboard JSON" tab
2. Edit the JSON configuration
3. Click "Format JSON" to auto-format your JSON
4. Click "Save JSON" to save your changes
5. The config is saved to `config/dashboards/custom-dashboard.json`

### Editing CSS Theme

1. Switch to the "CSS Theme" tab
2. Edit the CSS variables and styles
3. Click "Save CSS" to save your changes
4. The CSS is saved to `public/styles/dashboard-theme.css`

### Applying Changes

After saving your configuration:
1. Click "Refresh Dashboard" to send a refresh signal
2. Reload the dashboard page to see your changes
3. The dashboard will automatically load your custom configuration

## Configuration Files

### Default Config
- Location: `config/dashboards/mvp-test.json`
- Used as a template and fallback
- Never modified by the builder

### Custom Config
- Location: `config/dashboards/custom-dashboard.json`
- Created when you save from the builder
- Takes priority over default config

### CSS Theme
- Location: `public/styles/dashboard-theme.css`
- Contains all theme variables
- Directly edited by the CSS editor

## Configuration Source

The dashboard shows which configuration is currently loaded:
- **Default Template** - Orange badge, using `mvp-test.json`
- **Custom** - Green badge, using `custom-dashboard.json`

A "Custom Config" badge appears in the top-right of the dashboard when using a custom configuration.

## Features

### JSON Editor
- Syntax highlighting (monospace font)
- Auto-formatting
- Validation on save
- Real-time editing

### CSS Editor
- Direct CSS editing
- Theme variable support
- Immediate save

### Controls
- **Format JSON** - Auto-format the JSON configuration
- **Reload** - Reload configs from files (discards unsaved changes)
- **Save** - Save your changes to disk
- **Refresh Dashboard** - Send signal to reload dashboard

## Validation

The builder validates your configuration before saving:
- JSON must be valid syntax
- Must include `version` field
- Must include `pages` array
- Schema validation for structure

## Troubleshooting

### API Server Not Running
If you see "Failed to load configurations", make sure:
1. API server is running (`npm run api`)
2. API server is on port 3001
3. No firewall blocking localhost:3001

### Changes Not Appearing
If changes don't appear:
1. Check that you saved the configuration
2. Click "Refresh Dashboard"
3. Manually reload the browser page
4. Check browser console for errors

### JSON Syntax Errors
If you have JSON syntax errors:
1. Use the "Format JSON" button
2. Check for missing commas, quotes, or brackets
3. Copy your JSON to a validator like jsonlint.com

## API Endpoints

### GET /api/config
Returns the current dashboard configuration with source information.

**Response:**
```json
{
  "success": true,
  "source": "custom",
  "config": { ... },
  "paths": {
    "custom": "/path/to/custom-dashboard.json",
    "default": "/path/to/mvp-test.json"
  }
}
```

### POST /api/config
Save a new dashboard configuration.

**Request:**
```json
{
  "config": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Configuration saved successfully",
  "path": "/path/to/custom-dashboard.json",
  "timestamp": "2025-11-03T..."
}
```

### GET /api/css
Returns the current CSS theme.

**Response:**
```json
{
  "success": true,
  "css": "...",
  "path": "/path/to/dashboard-theme.css"
}
```

### POST /api/css
Save CSS theme.

**Request:**
```json
{
  "css": "..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "CSS saved successfully",
  "path": "/path/to/dashboard-theme.css",
  "timestamp": "2025-11-03T..."
}
```

## Next Steps

Once you have the configuration builder working:
1. Create your own dashboard layouts
2. Customize colors and styles
3. Add new data sources
4. Implement new panel types
5. Create multiple dashboard configurations

## Security Note

The configuration builder is currently designed for local development and trusted networks. Before deploying to production:
- Add authentication
- Validate file paths
- Implement rate limiting
- Add CORS restrictions
- Enable HTTPS

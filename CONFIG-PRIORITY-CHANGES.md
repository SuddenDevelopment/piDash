# Config Priority Changes

## Problem
The dashboard was always using the default `mvp-test.json` config instead of your custom config from the builder.

## Root Cause
The app was **hardcoded** to embed the default config at build time. Even though the API server tried to serve the custom config, if the API wasn't available or there were timing issues, it would fall back to the default.

## Solution
Changed the build system to **prioritize custom config at build time**:

### How It Works Now

```
┌─────────────────────────────────────────────────────────────┐
│  BUILD TIME (on your dev machine or Pi)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
       1. Run: npm run build:web
                            ↓
       2. prebuild:web hook runs automatically
                            ↓
       3. scripts/prepare-config.js executes
                            ↓
   ┌────────────────────────────────────────────┐
   │  Does custom-dashboard.json exist?         │
   └────────────────────────────────────────────┘
            ↓ YES                    ↓ NO
   ┌─────────────────┐      ┌─────────────────┐
   │  Use CUSTOM     │      │  Use DEFAULT    │
   │  config         │      │  config         │
   └─────────────────┘      └─────────────────┘
            ↓                        ↓
   ┌──────────────────────────────────────────┐
   │  Copy to active-dashboard.json           │
   └──────────────────────────────────────────┘
                            ↓
   ┌──────────────────────────────────────────┐
   │  Embed in build                          │
   │  (app/index.tsx imports this file)       │
   └──────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  RUNTIME (on the Pi)                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
       Dashboard starts with embedded config
       (custom if it existed at build time)
                            ↓
       Try to load from API server
                            ↓
   ┌────────────────────────────────────────────┐
   │  API available?                            │
   └────────────────────────────────────────────┘
            ↓ YES                    ↓ NO
   ┌─────────────────┐      ┌─────────────────┐
   │  Update from    │      │  Keep embedded  │
   │  API (latest)   │      │  config         │
   └─────────────────┘      └─────────────────┘
```

## Files Changed

### 1. **`scripts/prepare-config.js`** (NEW)
- Runs automatically before each build
- Checks if `custom-dashboard.json` exists
- Creates `active-dashboard.json` with the appropriate config
- Logs which config is being used

### 2. **`app/index.tsx`**
**Before:**
```typescript
const defaultConfig = require('../config/dashboards/mvp-test.json');
const [config, setConfig] = useState(defaultConfig);
```

**After:**
```typescript
const activeConfig = require('../config/dashboards/active-dashboard.json');
const [config, setConfig] = useState(activeConfig);
```

### 3. **`package.json`**
**Before:**
```json
"prebuild:web": "npm run generate:version"
```

**After:**
```json
"prepare:config": "node scripts/prepare-config.js",
"prebuild:web": "npm run prepare:config && npm run generate:version"
```

### 4. **`.gitignore`**
Added: `config/dashboards/active-dashboard.json`
(This file is auto-generated, don't commit it)

## What This Means

### ✅ Benefits

1. **Custom config is now prioritized**
   - If `custom-dashboard.json` exists, it's embedded in the build
   - No need to wait for API server to load

2. **Works even if API server is down**
   - Custom config is baked into the build
   - Dashboard shows your config immediately on load

3. **Faster initial load**
   - No API roundtrip needed
   - Config is already in the JavaScript bundle

4. **More reliable**
   - No timing issues or race conditions
   - What you build is what you get

### 🔄 Workflow

**Development (Local Machine):**
```bash
# 1. Edit config in settings page
# 2. Click "Save Config"
#    → Saves to config/dashboards/custom-dashboard.json

# 3. Build and deploy
npm run deploy:pi
# → prepare-config runs automatically
# → Sees custom-dashboard.json exists
# → Embeds custom config in build
# → Pi reboots with your custom config
```

**Production (On Pi):**
```bash
# If you edit config directly on Pi:
cd /home/pi/piDash

# Option 1: Rebuild and restart service
npm run build:web
sudo systemctl restart pidash

# Option 2: Full reboot (cleaner)
sudo reboot
```

## Verification

### Check which config is being used:

```bash
# Before build
cat config/dashboards/custom-dashboard.json | head -5

# After build
cat config/dashboards/active-dashboard.json | head -5

# Should match!
```

### Check build logs:
```bash
npm run build:web
```

Look for:
```
✅ Using CUSTOM config for build
   Source: .../custom-dashboard.json
```

OR

```
ℹ️  Using DEFAULT config for build (custom not found)
   Source: .../mvp-test.json
```

### Check browser console:

After loading dashboard, press F12 and look for:
```
Dashboard loaded from custom config    ✅ API server working
Dashboard loaded from embedded config  ✅ Using build-time config
```

## Troubleshooting

### Still seeing default config?

**1. Check if custom config exists:**
```bash
ls -la config/dashboards/custom-dashboard.json
```
If missing, go to Settings page and click "Save Config"

**2. Rebuild:**
```bash
npm run build:web
```
Check the output shows "Using CUSTOM config"

**3. Redeploy:**
```bash
npm run deploy:pi
```

**4. Verify on Pi:**
```bash
ssh pi@raspberrypi.local
cd /home/pi/piDash
cat config/dashboards/custom-dashboard.json | head -5
```

### Build fails?

**Check for JSON syntax errors:**
```bash
node -e "JSON.parse(require('fs').readFileSync('config/dashboards/custom-dashboard.json'))"
```

If error, use Settings page "Format JSON" button to fix.

## Migration Notes

### Old Behavior
- Always started with `mvp-test.json` embedded
- Tried to fetch custom config from API
- If API down → stuck with default

### New Behavior
- Checks which config to embed at build time
- Prioritizes custom if it exists
- API is used for updates, not initial load
- If API down → still has custom config from build

## Summary

The priority is now:

1. **Build Time**: Custom config (if exists) → embedded in build
2. **Runtime**: Embedded config → shown immediately
3. **API Update**: Latest config from API → updates display

This ensures your **custom config is ALWAYS used** as long as it exists when you build! 🎉

# Quick Start - Custom Config Priority

## The Fix
Your piDashboard now **prioritizes custom config at build time**. It will embed your custom configuration directly into the build, ensuring it's used even if the API server isn't available.

## Deploy Now

Just run:

```bash
npm run deploy:pi
```

That's it! Your custom config will be:
1. ✅ Detected automatically
2. ✅ Embedded in the build
3. ✅ Loaded on the Pi
4. ✅ Displayed immediately

## What Changed

### Before (❌)
- Always embedded default config
- Tried to fetch custom from API
- If API down → stuck with default

### After (✅)
- Checks for custom config at build time
- Embeds custom if it exists
- Works even if API is down

## Build Process

```bash
npm run build:web
```

You'll see:
```
🔍 Determining which config to embed...
✅ Using CUSTOM config for build
```

## Verify It Works

### 1. Deploy
```bash
npm run deploy:pi
```

### 2. Wait for Pi to reboot (~60 seconds)

### 3. Open dashboard
```
http://raspberrypi.local:3000
```

### 4. Check browser console (F12)
Look for:
```
Dashboard loaded from custom config ✅
```

OR

```
Dashboard loaded from embedded config ✅
```

Both mean your custom config is being used!

## Two Deploy Options

### Full Deploy (Recommended)
```bash
npm run deploy:pi
```
- Builds with custom config
- Syncs to Pi
- **Reboots Pi** (ensures clean start)
- Takes ~60 seconds

### Fast Deploy (Development)
```bash
npm run deploy:pi:fast
```
- Builds with custom config
- Syncs to Pi
- Just restarts service (no reboot)
- Manual browser refresh needed
- Takes ~10 seconds

## Files You Care About

| File | Description |
|------|-------------|
| `config/dashboards/custom-dashboard.json` | **Your config** - edit in Settings |
| `config/dashboards/active-dashboard.json` | Auto-generated at build (don't edit) |
| `config/dashboards/mvp-test.json` | Default fallback template |

## Troubleshooting

### Still seeing default?

**Quick fix:**
```bash
npm run deploy:pi
```

**Detailed check:**

1. Verify custom config exists:
```bash
ls -la config/dashboards/custom-dashboard.json
```

2. Rebuild and check logs:
```bash
npm run build:web | grep "config"
```

3. Should see:
```
✅ Using CUSTOM config for build
```

### Need to reset?

**Delete custom config to use default:**
```bash
rm config/dashboards/custom-dashboard.json
npm run deploy:pi
```

**Restore custom from template:**
```bash
cp config/dashboards/mvp-test.json config/dashboards/custom-dashboard.json
# Edit in Settings page
# Save Config
npm run deploy:pi
```

## Next Steps

1. Run `npm run deploy:pi`
2. Wait 60 seconds
3. Open `http://raspberrypi.local:3000`
4. See your custom config! 🎉

## Documentation

- **CONFIG-PRIORITY-CHANGES.md** - Technical details of the fix
- **PI-SETUP.md** - Full Pi setup and service management
- **CONFIGURATION_ANALYSIS.md** - Complete architecture analysis

---

**TL;DR**: Just run `npm run deploy:pi` and your custom config will work! 🚀

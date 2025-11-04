# Auto-Transition & Settings Feature

## Overview

Added two new features to the JSON dashboard system:
1. **Configurable auto-transition** - Set page rotation timing in JSON
2. **Settings modal** - Toggle auto-transition on/off with persistent settings

## 🎯 Features

### 1. Auto-Transition Configuration

Define auto-transition timing in your dashboard JSON:

```json
{
  "navigation": {
    "initialPage": "welcome",
    "events": [
      {
        "type": "onSchedule",
        "schedule": {
          "interval": 10000,
          "rotate": true
        },
        "actions": [
          {
            "type": "navigateNext"
          }
        ]
      }
    ]
  }
}
```

**Properties:**
- `interval` - Time in milliseconds between transitions (e.g., 10000 = 10 seconds)
- `rotate` - Set to `true` to enable auto-rotation
- `actions` - Typically `navigateNext` to cycle through pages

### 2. Settings Modal

**Access Settings:**
- Click the ⚙️ icon in the top-right corner
- Opens a 90% modal overlay

**Settings Available:**
- **Auto-Transition Toggle** - Enable/disable page auto-rotation
- Settings persist across sessions (using AsyncStorage)

## 📱 UI Components

### Settings Icon
- **Location**: Top-right corner of dashboard
- **Style**: Semi-transparent circle with gear emoji
- **Action**: Opens settings modal

### Settings Modal
- **Size**: 90% of screen width/height
- **Style**: Dark theme with rounded corners
- **Sections**:
  - Header with title and close button
  - Auto-Transition toggle switch
  - About information
  - Done button

## 🔧 Implementation Details

### New Components

1. **SettingsContext** (`contexts/SettingsContext.tsx`)
   - Global settings state management
   - AsyncStorage integration for persistence
   - `useSettings()` hook for accessing settings

2. **SettingsModal** (`components/dashboard/SettingsModal.tsx`)
   - 90% modal overlay
   - Auto-transition toggle
   - Shows configured interval time
   - About section

### Modified Components

1. **DashboardRenderer**
   - Added settings icon button
   - Integrated SettingsModal
   - Reads auto-transition interval from config

2. **PageNavigator**
   - Respects settings.autoTransitionEnabled
   - Only auto-transitions if both enabled AND configured
   - Uses configured interval from JSON

3. **app/index.tsx**
   - Wrapped with SettingsProvider

## 📝 JSON Configuration

### Example: 10-second Auto-Transition

```json
{
  "navigation": {
    "initialPage": "welcome",
    "events": [
      {
        "type": "onSchedule",
        "schedule": {
          "interval": 10000,
          "rotate": true
        },
        "actions": [{ "type": "navigateNext" }]
      }
    ]
  }
}
```

### Example: 30-second Auto-Transition

```json
{
  "navigation": {
    "events": [
      {
        "type": "onSchedule",
        "schedule": {
          "interval": 30000,
          "rotate": true
        },
        "actions": [{ "type": "navigateNext" }]
      }
    ]
  }
}
```

### Example: Disabled (No Auto-Transition)

Simply omit the `onSchedule` event, or set `rotate: false`:

```json
{
  "navigation": {
    "initialPage": "welcome",
    "events": [
      {
        "type": "onSwipeLeft",
        "actions": [{ "type": "navigateNext" }]
      }
    ]
  }
}
```

## 🎮 Usage

### Enable Auto-Transition

1. **In JSON**: Add `onSchedule` event with interval
2. **In Settings**: Toggle switch to ON (default)
3. **Result**: Pages auto-rotate at configured interval

### Disable Auto-Transition

**Option 1 - Settings UI:**
1. Click ⚙️ icon
2. Toggle "Auto-Transition Pages" to OFF
3. Click Done
4. Manual navigation still works

**Option 2 - JSON:**
Remove the `onSchedule` event from navigation.events

### Adjust Timing

Edit the `interval` value in JSON:
- 5000 = 5 seconds
- 10000 = 10 seconds  
- 30000 = 30 seconds
- 60000 = 1 minute

## 💾 Settings Persistence

Settings are saved to device storage:
- **Web**: LocalStorage (via AsyncStorage polyfill)
- **Mobile**: Native AsyncStorage
- **Key**: `@pidash_settings`
- **Auto-save**: Settings save automatically on change

## 🎨 Styling

### Settings Button
```typescript
{
  position: 'absolute',
  top: 12,
  right: 12,
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  zIndex: 200,
}
```

### Modal
```typescript
{
  width: SCREEN_WIDTH * 0.9,
  height: SCREEN_HEIGHT * 0.9,
  backgroundColor: '#1A1A1A',
  borderRadius: 16,
}
```

## 🔍 Testing

### Test Auto-Transition

1. Start the app: `npm start`
2. Wait 10 seconds (or configured interval)
3. Page should auto-advance
4. Open settings, toggle OFF
5. Auto-transition should stop
6. Toggle ON again
7. Auto-transition resumes

### Test Settings Persistence

1. Open settings
2. Toggle auto-transition OFF
3. Close settings
4. Refresh browser/restart app
5. Open settings again
6. Setting should still be OFF

## 📊 MVP Test Dashboard

**Current Configuration:**
- Auto-transition: **10 seconds**
- Rotation: **Enabled** (cycles through all 5 pages)
- Default state: **ON** (can be disabled in settings)

## 🐛 Troubleshooting

### Auto-transition not working

**Check:**
1. Is `onSchedule` event in navigation.events?
2. Is `interval` value set?
3. Is `rotate` set to `true`?
4. Is toggle enabled in settings?

**Solution:**
```bash
# Validate JSON configuration
npx tsx scripts/validate-dashboard.ts config/dashboards/mvp-test.json
```

### Settings not persisting

**Issue**: AsyncStorage not working
**Solution**: Clear storage and restart
```javascript
// In browser console
localStorage.clear()
```

### Modal not appearing

**Check**: Is SettingsProvider wrapping the app?
**File**: `app/index.tsx`
```typescript
<SettingsProvider>
  <DashboardRenderer ... />
</SettingsProvider>
```

## 🎯 Future Enhancements

Possible additions:
- [ ] Pause on user interaction (reset timer on swipe/click)
- [ ] Per-page custom intervals
- [ ] Transition type preference
- [ ] Night mode toggle
- [ ] Display brightness control
- [ ] More settings options

## 📚 Related Files

```
contexts/
  └── SettingsContext.tsx       # Settings state & persistence

components/dashboard/
  ├── SettingsModal.tsx          # Settings UI
  ├── DashboardRenderer.tsx      # Settings icon integration
  └── PageNavigator.tsx          # Auto-transition logic

config/dashboards/
  └── mvp-test.json              # Example with 10s auto-transition
```

## ✅ Validation

The updated configuration passes all validation:

```bash
$ npx tsx scripts/validate-dashboard.ts config/dashboards/mvp-test.json

✅ Configuration is valid!
Pages: 5
Initial Page: welcome
```

---

**Ready to use! The auto-transition and settings features are fully functional.** 🎉

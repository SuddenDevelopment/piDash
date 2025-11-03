# Display Configuration Guide

The piDash dashboard is optimized for fixed-resolution displays with no scrolling required.

## 🖥️ Default Configuration

**Resolution:** 800x480 (Raspberry Pi 5" display)
**Orientation:** Landscape
**No scrolling:** All content fits within the display bounds

## ⚙️ Changing Display Resolution

### Configuration File

Edit: `config/display.ts`

```typescript
export const DISPLAY_CONFIG = {
  // Fixed display resolution (no scrolling)
  width: 800,   // Change this to your display width
  height: 480,  // Change this to your display height

  // Orientation
  orientation: 'landscape' as const,

  // Safe area (if you need margins, adjust these)
  safeArea: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  // Device type (for reference)
  deviceType: 'raspberry-pi-5inch' as const,
};
```

### Common Display Sizes

**Raspberry Pi Displays:**
- 5" Display: `800x480` (default)
- 7" Display: `1024x600`
- 10" Display: `1280x800`

**Custom Displays:**
- 4.3" Display: `480x272`
- 3.5" Display: `320x480` (portrait)

## 🎨 How It Works

### Fixed Container
The dashboard uses a fixed-size container that matches your display resolution exactly:

```typescript
container: {
  width: DISPLAY_CONFIG.width,    // 800px
  height: DISPLAY_CONFIG.height,  // 480px
  overflow: 'hidden',             // No scrolling
  margin: 0,
  padding: 0,
}
```

### Responsive Scaling
All sizes scale proportionally using the `scale()` helper:

```typescript
import { scale } from '../config/display';

fontSize: scale(24),  // Scales based on display width
padding: scale(12),   // Maintains proportions
```

### No Scrolling
The layout is designed to fit everything within the display:
- Header: 60px (scaled)
- Content: Flexible height (480 - 60 - 30 = 390px)
- Footer: 30px (scaled)

### Viewport Meta Tag
The web app automatically sets the viewport to match your display:

```html
<meta name="viewport" content="width=800, height=480, initial-scale=1.0, user-scalable=no">
```

## 📐 Layout Structure

```
┌─────────────────────────────┐
│ Header (60px)               │ ← Logo, subtitle
├─────────────────────────────┤
│                             │
│ Content (390px)             │ ← Time, info cards,
│                             │   welcome message
│                             │
├─────────────────────────────┤
│ Footer (30px)               │ ← Version info
└─────────────────────────────┘
     800px total width
     480px total height
```

## 🔧 Customization

### Adjust Safe Area (Add Margins)

If you need margins around the content:

```typescript
safeArea: {
  top: 10,     // 10px from top
  right: 10,   // 10px from right
  bottom: 10,  // 10px from bottom
  left: 10,    // 10px from left
}
```

### Change Orientation

For portrait displays:

```typescript
width: 480,
height: 800,
orientation: 'portrait' as const,
```

### Multiple Display Profiles

Create different configs for different devices:

```typescript
// config/displays/pi5inch.ts
export const PI_5INCH = {
  width: 800,
  height: 480,
  deviceType: 'raspberry-pi-5inch',
};

// config/displays/pi7inch.ts
export const PI_7INCH = {
  width: 1024,
  height: 600,
  deviceType: 'raspberry-pi-7inch',
};

// config/display.ts
import { PI_5INCH } from './displays/pi5inch';

export const DISPLAY_CONFIG = PI_5INCH;
```

## 🚀 Deploying with New Resolution

1. **Update config:**
   ```bash
   nano config/display.ts
   ```

2. **Build:**
   ```bash
   npm run build:web
   ```

3. **Deploy:**
   ```bash
   npm run deploy:pi
   ```

4. **Verify:**
   - Check dashboard displays at new resolution
   - No scrolling should be present
   - All content should fit perfectly

## 💡 Design Guidelines

### When designing dashboards for fixed displays:

1. **Calculate available space:**
   ```typescript
   const contentHeight = DISPLAY_CONFIG.height - headerHeight - footerHeight;
   ```

2. **Use scaled units:**
   ```typescript
   fontSize: scale(16),  // Not: fontSize: 16
   ```

3. **Test at actual resolution:**
   - Set browser to exact size (800x480)
   - Use Chrome DevTools device mode
   - Test on actual Pi display

4. **Avoid flexible layouts that might overflow:**
   - Don't use `flex: 1` at root level
   - Calculate heights explicitly
   - Use `overflow: hidden` to prevent scrolling

5. **Consider text length:**
   - Long strings may wrap or truncate
   - Test with longest expected values
   - Use `numberOfLines` or `ellipsizeMode` for text

## 🧪 Testing

### Test in Browser at Exact Resolution

**Chrome DevTools:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Click "Responsive" dropdown
4. Select "Edit..."
5. Add custom device:
   - Width: 800
   - Height: 480
   - Device pixel ratio: 1

### Test on Raspberry Pi

```bash
# Deploy to Pi
npm run deploy:pi

# Check display resolution
ssh admin@192.168.1.166 'DISPLAY=:0 xdpyinfo | grep dimensions'
```

## 📊 Resolution Reference

| Display | Resolution | Aspect Ratio | DPI |
|---------|-----------|--------------|-----|
| Pi 5" Touch | 800x480 | 5:3 | ~96 |
| Pi 7" Touch | 1024x600 | 16:9.4 | ~170 |
| Pi 10" HDMI | 1280x800 | 16:10 | ~149 |
| Generic 4.3" | 480x272 | 16:9 | ~128 |

## 🐛 Troubleshooting

### Content Overflows Display

**Problem:** Content is cut off or requires scrolling

**Solutions:**
1. Reduce padding: `paddingHorizontal: scale(8)`
2. Reduce font sizes: `fontSize: scale(12)`
3. Remove elements: Comment out less important sections
4. Calculate heights more precisely

### Display Shows Scrollbars

**Problem:** Scrollbars appear on the display

**Solutions:**
1. Check `overflow: hidden` is set on container
2. Verify viewport meta tag is correct
3. Check for content exceeding bounds
4. Ensure global CSS is applied (see `app/_layout.tsx`)

### Text is Too Small/Large

**Problem:** Text doesn't scale well for your display

**Solutions:**
1. Adjust scale base: Change `baseWidth` in `config/display.ts`
2. Override specific sizes: Don't use `scale()` for critical text
3. Test with different display sizes

### Dashboard Doesn't Fit Display

**Problem:** Dashboard is larger or smaller than display

**Solutions:**
1. Verify `DISPLAY_CONFIG` matches actual display
2. Check browser zoom is at 100%
3. Verify Pi display resolution: `xrandr`
4. Check Chromium is in fullscreen kiosk mode

## 📝 Example: 1024x600 Display

```typescript
// config/display.ts
export const DISPLAY_CONFIG = {
  width: 1024,
  height: 600,
  orientation: 'landscape' as const,
  safeArea: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  deviceType: 'raspberry-pi-7inch' as const,
};
```

**Deploy:**
```bash
npm run build:web
npm run deploy:pi
```

The dashboard will automatically scale to fit the new resolution!

---

**Default configuration is optimized for Raspberry Pi 5" displays (800x480)**

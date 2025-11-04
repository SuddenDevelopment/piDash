# Dashboard Preview Feature

## Overview

The Configuration Builder now includes a **Live Dashboard Preview** that shows exactly how your dashboard will look on the Raspberry Pi's 800×480 display while you edit on a full-size screen.

## Features

### Real-time Preview
- **Exact Resolution** - Shows dashboard at Pi's native 800×480 pixels
- **Live Updates** - Preview automatically refreshes when you save changes
- **Scaled Display** - Scaled to 50% for comfortable viewing (400×240)
- **Toggle On/Off** - Show or hide preview as needed

### Visual Indicators
- **Resolution Badge** - Shows "800×480" in purple
- **Scale Badge** - Shows current scale percentage in green (50%)
- **Dimension Labels** - Width and height markers on preview
- **Border Highlight** - Cyan border around preview area

### Controls
- **👁️ Show/Hide Preview** - Toggle button in header
- **↻ Refresh** - Manual refresh button
- **✕ Close** - Close preview panel
- Position: Right side panel

## Usage

### Enabling Preview

1. Open Configuration Builder (`/settings`)
2. Preview is visible by default on the right side
3. Shows live iframe of dashboard at 800×480

### Toggling Preview

**Show Preview:**
- Click "👁️ Show Preview" button in header
- Preview panel slides in from right

**Hide Preview:**
- Click "👁️ Hide Preview" button
- Preview panel closes
- Editor uses full width

### Refreshing Preview

**Automatic Refresh:**
- Save your configuration
- Click "Refresh Dashboard" button
- Preview auto-updates when dashboard reloads

**Manual Refresh:**
- Click "↻" button in preview header
- Reloads preview iframe immediately

## Layout

### Full Screen Editor
The settings page now uses **full browser width**:
- Not constrained to 800×480
- Uses all available screen space
- Professional editing experience
- Desktop-optimized layout

### Split View
When preview is visible:
```
┌─────────────────────────────────┬──────────────┐
│                                 │   Preview    │
│   Editor Area                   │   Panel      │
│   (Visual Builder/JSON/CSS)     │   800×480    │
│                                 │   @ 50%      │
│                                 │   (400×240)  │
└─────────────────────────────────┴──────────────┘
```

When preview is hidden:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│   Editor Area (Full Width)                     │
│   (Visual Builder/JSON/CSS)                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Preview Panel Details

### Header
- **Title** - "Dashboard Preview"
- **Resolution Badge** - Shows exact Pi resolution (800×480)
- **Scale Badge** - Shows current scale percentage
- **Refresh Button** - Manual iframe refresh
- **Close Button** - Hide preview

### Content Area
- **Live iframe** - Shows actual dashboard
- **Exact sizing** - 800×480 pixels (scaled)
- **Dimension labels** - Shows width/height
- **Border** - Cyan highlight with glow effect

### Footer
- **Info text** - "Live preview - Changes reflect after saving and refreshing dashboard"

## Workflow

### Typical Development Flow

1. **Open Builder** - Navigate to `/settings`
2. **Edit Dashboard** - Make changes in Visual Builder or JSON
3. **Check Preview** - See how it looks on Pi display
4. **Save Changes** - Click "Save Config"
5. **Refresh Preview** - Click "↻" in preview or "Refresh Dashboard"
6. **Verify** - Check preview shows your changes
7. **Iterate** - Repeat as needed

### Why This Matters

**Raspberry Pi Display is Small:**
- 800×480 is much smaller than desktop
- What looks good on desktop may be cramped on Pi
- Text might be too small or too large
- Layouts need different proportions

**Preview Solves This:**
- See exact Pi display while editing
- No need to deploy to Pi to test
- Iterate faster
- Catch sizing issues early

## Best Practices

### Using the Preview

1. **Keep Preview Open** - Leave it visible while editing
2. **Check After Changes** - Verify each major change
3. **Test Different Pages** - Switch pages in dashboard
4. **Verify Text Sizes** - Ensure readability at 800×480
5. **Check Spacing** - Gaps and padding at actual size

### Common Issues

**Text Too Small:**
- Increase font sizes in styles
- Use larger tokens ($2xl, $3xl, $4xl)
- Preview shows if text is readable

**Layout Cramped:**
- Reduce gaps and padding
- Use fewer panels per page
- Preview shows actual spacing

**Elements Cut Off:**
- Check preview dimensions
- Adjust panel heights
- Reduce content per panel

### Scale Information

**Current Scale: 50%**
- Preview shows: 400×240 pixels
- Actual Pi: 800×480 pixels
- Comfortable desktop viewing size

**Why Scaled:**
- Full 800×480 is large on desktop
- 50% scale fits nicely in side panel
- Still shows accurate proportions
- Can see entire dashboard at once

## Technical Details

### Implementation
```typescript
<DashboardPreview
  config={config}
  isVisible={previewVisible}
  onToggle={() => setPreviewVisible(!previewVisible)}
  position="right"
/>
```

### Preview Sizes by Position
- **Right Panel** - 50% scale (400×240)
- **Bottom Panel** - 60% scale (480×288)
- **Floating** - 80% scale (640×384)

### iframe Details
- **Source** - Current app origin (/)
- **Size** - 800×480 (Pi resolution)
- **Transform** - CSS scale() for sizing
- **Refresh** - Controlled by key prop

### Platform Support
- **Web** - Full support with iframe
- **Mobile/Native** - Fallback message
- **Desktop** - Best experience

## Tips & Tricks

### Quick Preview Check
1. Make change in Visual Builder
2. Glance at preview
3. See if it looks good
4. Adjust immediately

### Side-by-side Comparison
1. Open dashboard in separate tab
2. Have builder with preview in another tab
3. Switch between them
4. Compare full-size vs preview

### Mobile-first Design
1. Design for Pi first (800×480)
2. Everything else is larger
3. Use preview as constraint
4. Ensures clean compact design

### Typography Testing
1. Add text panel with various sizes
2. Check preview for readability
3. Adjust until comfortable
4. Delete test panel

### Layout Validation
1. Create layout in Visual Builder
2. Check preview alignment
3. Adjust gaps/padding
4. Verify spacing ratios

## Keyboard Shortcuts

- No specific shortcuts
- Use mouse to toggle preview
- Click refresh button as needed

## Troubleshooting

### Preview Not Loading
**Problem:** Preview shows blank or loading
**Solution:**
- Check if dashboard is running
- Verify localhost:8081 is accessible
- Click refresh button
- Check browser console

### Preview Not Updating
**Problem:** Changes don't appear in preview
**Solution:**
- Click "Save Config" first
- Click "Refresh Dashboard"
- Click "↻" in preview header
- Wait a moment for reload

### Preview Shows Wrong Content
**Problem:** Preview doesn't match current config
**Solution:**
- Save your configuration
- Refresh the preview manually
- Check if dashboard reloaded
- Verify API server is running

### Preview Layout Broken
**Problem:** Preview appears distorted
**Solution:**
- Check browser zoom (should be 100%)
- Refresh browser page
- Restart development server
- Clear browser cache

## Future Enhancements

Potential improvements:
- [ ] Adjustable scale slider
- [ ] Multiple preview sizes
- [ ] Preview position options (left/right/bottom/floating)
- [ ] Device frame around preview
- [ ] Ruler/grid overlay
- [ ] Touch simulation
- [ ] Auto-refresh on save

## Comparison: Before vs After

### Before (Old Behavior)
- Settings page constrained to 800×480
- Small editing area
- Hard to work with
- Had to deploy to Pi to test
- Slow iteration

### After (New Behavior)
- Settings page uses full screen
- Large comfortable editing area
- Easy to work with
- See Pi display in real-time
- Fast iteration

## Conclusion

The Dashboard Preview feature provides a **professional development experience** where you can:
- Edit on a full-size screen
- See exact Pi display simultaneously
- Iterate quickly without deploying
- Catch issues before deployment
- Build better dashboards faster

Use the preview constantly while building to ensure your dashboard looks perfect on the Raspberry Pi!

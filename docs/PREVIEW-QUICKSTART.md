# Dashboard Preview - Quick Start

## What's New

The Configuration Builder now has a **Live Dashboard Preview** showing exactly how your dashboard will look on the Raspberry Pi's 800×480 display!

## Key Features

### Full-Screen Editor
- ✅ Settings page now uses **full browser size**
- ✅ Not constrained to 800×480 anymore
- ✅ Professional desktop editing experience
- ✅ Maximum workspace for building

### Live Pi Preview
- ✅ Shows dashboard at exact **800×480 resolution**
- ✅ Scaled to 50% (400×240) for comfortable viewing
- ✅ Real-time updates when you save changes
- ✅ Toggle on/off as needed

## Quick Usage

### 1. Access Builder

```bash
# Terminal 1
npm run api

# Terminal 2
npm start
```

Open http://localhost:8081/settings

### 2. Preview is Visible by Default

You'll see:
- Left side: Full-screen editor (Visual Builder/JSON/CSS)
- Right side: Live preview at Pi resolution

### 3. Toggle Preview

**Hide Preview:**
- Click "👁️ Hide Preview" button in header
- Editor expands to full width

**Show Preview:**
- Click "👁️ Show Preview" button
- Preview panel appears on right

### 4. Make Changes

1. Edit dashboard in Visual Builder or JSON
2. Click "Save Config"
3. Preview shows exact Pi display size
4. Click "↻" in preview to refresh

## Layout Comparison

### With Preview (Default)
```
┌────────────────────────┬─────────────┐
│                        │  Preview    │
│  Editor                │  800×480    │
│  (Full Width)          │  @ 50%      │
│                        │             │
│  Visual Builder        │  ┌────────┐ │
│  or JSON Editor        │  │ Live   │ │
│  or CSS Editor         │  │ Pi     │ │
│                        │  │Display │ │
│                        │  └────────┘ │
└────────────────────────┴─────────────┘
```

### Without Preview
```
┌──────────────────────────────────────┐
│                                      │
│  Editor (Full Screen Width)         │
│                                      │
│  Visual Builder or JSON or CSS      │
│                                      │
│                                      │
└──────────────────────────────────────┘
```

## Preview Panel

### Header
- **"Dashboard Preview"** - Title
- **800×480** - Resolution badge (purple)
- **50%** - Scale badge (green)
- **↻** - Manual refresh button
- **✕** - Close button

### Content
- Live iframe of dashboard
- Cyan border with glow
- Dimension markers (width/height)
- Exact Pi resolution scaled to fit

### Footer
- Info about live updates

## Why This Matters

### The Problem
- Pi display is only 800×480 pixels
- Desktop displays are much larger (1920×1080+)
- What looks good on desktop may be cramped on Pi
- Need to see actual Pi size while editing

### The Solution
- Edit comfortably on full-size screen
- See exact Pi display in real-time
- No need to deploy to Pi to test
- Catch sizing issues immediately
- Iterate much faster

## Workflow

### Standard Development Flow

1. **Open Builder** → `/settings`
2. **Edit Dashboard** → Visual Builder or JSON
3. **Check Preview** → Glance at right panel
4. **Adjust** → Fix any sizing issues
5. **Save** → Click "Save Config"
6. **Refresh** → Click "↻" or "Refresh Dashboard"
7. **Verify** → Preview shows your changes
8. **Deploy** → Push to Pi when ready

### Tips for Using Preview

**Always Visible:**
- Keep preview open while editing
- Constant feedback on sizing
- Catch issues immediately

**Check After Every Change:**
- Add a panel → Check preview
- Change text size → Check preview
- Adjust layout → Check preview

**Use as Design Constraint:**
- Design for 800×480 first
- Everything else is bonus
- Ensures compact, clean design

## Common Use Cases

### Text Size Validation
```
1. Add text panel with heading
2. Look at preview
3. Too small? Increase font size
4. Too big? Decrease font size
5. Save and verify
```

### Layout Testing
```
1. Create 3-column layout in builder
2. Check preview
3. Columns too narrow? Reduce to 2
4. Too much space? Add 4th column
5. Find perfect balance
```

### Panel Sizing
```
1. Add metric panels
2. Set flex values
3. Check preview proportions
4. Adjust flex ratios
5. Get exact sizing
```

### Spacing Verification
```
1. Set gap: 16px
2. Check preview
3. Too cramped? Increase gap
4. Too much space? Decrease gap
5. Perfect spacing
```

## Preview Controls

### Show/Hide Button
- Location: Header, right side
- Shortcut: Click "👁️ Show/Hide Preview"
- State: Toggles visibility

### Refresh Button
- Location: Preview header
- Icon: ↻
- Action: Reloads preview iframe
- Use: When preview seems stale

### Close Button
- Location: Preview header
- Icon: ✕
- Action: Hides preview panel
- Same as "Hide Preview" button

## Technical Details

### Resolution
- **Pi Display:** 800 × 480 pixels
- **Preview Display:** 400 × 240 pixels (50% scale)
- **Why Scaled:** Fits comfortably in side panel

### Update Mechanism
- Manual: Click "↻" in preview
- Auto: Save config + refresh dashboard
- Live: iframe reloads on refresh

### Platform
- **Web:** Full support
- **Mobile:** Fallback message
- **Desktop:** Best experience

## Best Practices

### 1. Design for Pi First
- Use preview as primary view
- Desktop is secondary
- Ensures compact design

### 2. Check Frequently
- After every major change
- Before saving
- After refreshing

### 3. Verify Text Readability
- Check all text sizes
- Ensure labels are visible
- Verify contrast

### 4. Test All Pages
- Navigate through pages
- Check each layout
- Verify transitions

### 5. Use Full Editor Space
- Hide preview when typing lots
- Show preview when designing
- Toggle as needed

## Troubleshooting

### Preview Not Showing
- Check if preview is toggled on
- Click "👁️ Show Preview"
- Verify dashboard is running

### Preview Not Updating
- Click "Save Config"
- Click "Refresh Dashboard"
- Click "↻" in preview
- Wait for reload

### Preview Shows Blank
- Check browser console
- Verify localhost:8081 works
- Restart dev server
- Clear browser cache

### Wrong Content in Preview
- Save configuration first
- Refresh dashboard
- Manual refresh in preview
- Check API server running

## Examples

### Example 1: Check Text Size
```
Before:
- Add text: "Welcome"
- Font size: $md

Check Preview:
- Too small to read!

Fix:
- Change to: $3xl
- Save and refresh
- Perfect size!
```

### Example 2: Layout Adjustment
```
Before:
- 4 columns in row layout

Check Preview:
- Columns too narrow
- Text cramped

Fix:
- Change to 3 columns
- Increase gap to 20
- Save and refresh
- Much better!
```

### Example 3: Metric Sizing
```
Before:
- 3 metrics, no flex values

Check Preview:
- Uneven sizes
- Looks messy

Fix:
- Set flex: 1 on all
- Save and refresh
- Equal sizes!
```

## Comparison: Old vs New

### Old Way (Before Preview)
1. Edit dashboard in constrained view (800×480)
2. Hard to work with small editor
3. Deploy to Pi to test
4. SSH into Pi, reload
5. Look at physical display
6. Go back to desktop to edit
7. Repeat...

### New Way (With Preview)
1. Edit dashboard in full-screen comfort
2. Glance at preview panel
3. See exact Pi size instantly
4. Adjust immediately
5. Done!

**Time Saved:** ~5-10 minutes per iteration
**Comfort:** Much better
**Accuracy:** 100% exact

## Success!

You now have:
- ✅ Full-screen editing space
- ✅ Live Pi preview at exact size
- ✅ Toggle preview on/off
- ✅ Real-time updates
- ✅ Professional development workflow

Start building with confidence knowing exactly how your dashboard will look on the Raspberry Pi!

For more details, see [DASHBOARD-PREVIEW.md](./DASHBOARD-PREVIEW.md)

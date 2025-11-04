# Visual Builder - Quick Start

## What's New

The Configuration Builder has been significantly enhanced with:

### 1. Visual Builder Tab (NEW!)
A form-based UI for creating dashboards without writing JSON:
- **Page Management** - Create, edit, delete pages
- **Layout Configuration** - Visual controls for flex/grid layouts
- **Panel Builder** - Add and configure panels with dropdowns
- **Real-time Sync** - Changes automatically sync to JSON

### 2. Professional JSON Editor
Upgraded from plain TextInput to Ace Editor (web only):
- **Syntax Highlighting** - Monokai theme with color coding
- **Auto-completion** - Smart code suggestions
- **Line Numbers** - Easy navigation
- **Error Detection** - Instant feedback on invalid JSON

### 3. Bidirectional Sync
Visual Builder ↔ JSON Editor work together:
- Edit in Visual Builder → See JSON update
- Edit JSON → See Visual Builder update
- No data loss when switching tabs

## Getting Started

### 1. Start the Servers

**Terminal 1 - API Server:**
```bash
npm run api
```

**Terminal 2 - Dashboard:**
```bash
npm start
```

### 2. Access Visual Builder

1. Open dashboard in browser (http://localhost:8081)
2. Click settings icon (gear)
3. Click "Configuration Builder"
4. You'll see 3 tabs: **Visual Builder**, Dashboard JSON, CSS Theme

### 3. Create Your First Page

**In Visual Builder tab:**

1. You'll see the default pages loaded
2. Click "+ Add Page" to create a new page
3. Set page name: "My Dashboard"
4. Configure layout:
   - Type: flex
   - Direction: column
   - Gap: 16
   - Padding: 16

### 4. Add Panels

1. Click "+ Add Panel"
2. Select panel type: text
3. Enter text content: "Hello, PiDash!"
4. Add more panels as needed

### 5. Save and Preview

1. Click "Save Config" button
2. Click "Refresh Dashboard"
3. Click "Go to Dashboard"
4. See your changes live!

## Quick Reference

### Page Properties
- **Page Name** - Display name
- **Layout Type** - flex, grid, or absolute
- **Direction** - row (horizontal) or column (vertical)
- **Gap** - Spacing between items (pixels)
- **Padding** - Inner spacing (pixels)
- **Justify** - Horizontal alignment
- **Align** - Vertical alignment

### Panel Types
- **text** - Static or dynamic text
- **container** - Group other panels
- **metric** - Display KPIs/metrics
- **chart** - Data visualizations (line, bar, area, pie)
- **table** - Tabular data
- **canvas** - 3D/2D graphics (r3f, webgl, 2d)

### Common Properties
- **Panel ID** - Unique identifier (auto-generated)
- **Flex** - Size ratio (1, 2, 3, etc.)
- **Text** - Text content (text panels)
- **Data Source** - Data source URL (metric panels)
- **Data Path** - Path to data (metric panels)
- **Chart Type** - Visualization type (chart panels)

## Workflow Examples

### Example 1: Simple Text Page

```
1. Create page "Welcome"
2. Set layout: flex, column, gap: 20
3. Add text panel: "Welcome to PiDash"
4. Add text panel: "Your dashboard is ready"
5. Save and preview
```

### Example 2: Metrics Dashboard

```
1. Create page "Metrics"
2. Set layout: flex, row, gap: 16
3. Add metric panel:
   - Type: metric
   - Source: mock://data
   - Path: cpu
   - Flex: 1
4. Add metric panel:
   - Type: metric
   - Source: mock://data
   - Path: memory
   - Flex: 1
5. Add metric panel:
   - Type: metric
   - Source: mock://data
   - Path: temp
   - Flex: 1
6. Save and preview
```

### Example 3: Grid Layout

```
1. Create page "Grid"
2. Set layout: grid
3. Set columns: 2
4. Set rows: 2
5. Add 4 text panels
6. Each panel automatically fills a grid cell
7. Save and preview
```

## Tips & Tricks

### Visual Builder Tips

1. **Use Page Tabs** - Switch between pages quickly
2. **Flex Values** - Set flex: 1 on all panels for equal sizing
3. **Layout Direction** - Column = vertical, Row = horizontal
4. **Delete Protection** - Can't delete last page
5. **Auto IDs** - IDs are generated automatically

### JSON Editor Tips

1. **Format JSON** - Click "Format JSON" to auto-format
2. **Syntax Check** - Red highlights show errors
3. **Copy/Paste** - Copy panels to duplicate them
4. **Advanced Features** - Add styles, labels, events in JSON

### Workflow Tips

1. **Start in Visual Builder** - Create structure visually
2. **Switch to JSON** - Fine-tune properties
3. **Back to Visual** - Make structural changes
4. **Save Often** - Click save after major changes
5. **Preview Frequently** - Refresh dashboard to see changes

## Tab Comparison

| Feature | Visual Builder | JSON Editor |
|---------|---------------|-------------|
| Page Management | ✅ Easy buttons | ❌ Manual JSON |
| Layout Config | ✅ Dropdowns | ❌ Text entry |
| Panel Creation | ✅ Form-based | ❌ Copy/paste |
| Advanced Props | ❌ Limited | ✅ Full control |
| Syntax Errors | ✅ Prevented | ⚠️ Can occur |
| Learning Curve | ✅ Gentle | ❌ Steep |

**Best Practice:** Use Visual Builder for structure, JSON for details.

## Keyboard Shortcuts

### JSON Editor (Web Only)
- `Ctrl/Cmd + F` - Find
- `Ctrl/Cmd + H` - Replace
- `Ctrl/Cmd + S` - Save (browser might intercept)
- `Tab` - Indent selection
- `Shift + Tab` - Outdent selection

### General
- Click "Format JSON" - Auto-format JSON
- Click "Reload" - Discard unsaved changes
- Click "Save Config" - Save to file
- Click "Refresh Dashboard" - Trigger reload

## Troubleshooting

### Visual Builder Not Loading
**Problem:** Visual Builder shows blank or loading
**Solution:**
- Check API server is running (`npm run api`)
- Check browser console for errors
- Click "Reload" button

### Changes Not Saving
**Problem:** Click save but nothing happens
**Solution:**
- Check API server is running
- Look for error alerts
- Check browser network tab
- Verify JSON is valid

### JSON Tab Not Working
**Problem:** JSON editor not appearing
**Solution:**
- Only works on web platform
- Check if running in browser
- Falls back to TextInput on mobile

### Visual Builder Out of Sync
**Problem:** Visual Builder doesn't match JSON
**Solution:**
- Click "Reload" to refresh from file
- Check for JSON syntax errors
- Restart dashboard if needed

## What You Can Build

### Simple Dashboards
- ✅ Text information pages
- ✅ Basic metric displays
- ✅ Simple layouts

### Advanced Dashboards
- ✅ Multi-page dashboards
- ✅ Complex grid layouts
- ✅ Data-driven visualizations
- ✅ Nested containers
- ✅ Custom styled panels

### Not Yet Supported in Visual Builder
- ❌ Custom styles (use JSON tab)
- ❌ Labels with positions (use JSON tab)
- ❌ Events and actions (use JSON tab)
- ❌ Nested children in containers (use JSON tab)
- ❌ Advanced panel props (use JSON tab)

## File Structure

```
piDash/
├── server/
│   └── config-api.js                    # API server
├── app/
│   ├── index.tsx                        # Dashboard
│   └── settings.tsx                     # Config builder (3 tabs)
├── components/config-builder/
│   └── VisualBuilder.tsx                # Visual builder UI
├── config/dashboards/
│   ├── mvp-test.json                    # Default template
│   └── custom-dashboard.json            # Your custom config
└── docs/
    ├── VISUAL-BUILDER-GUIDE.md          # Full guide
    └── VISUAL-BUILDER-QUICKSTART.md     # This file
```

## Next Steps

1. ✅ Create a simple page with text panels
2. ✅ Try different layout types (flex, grid)
3. ✅ Add metric panels with data sources
4. ✅ Switch to JSON tab to see structure
5. ✅ Add advanced features in JSON
6. ✅ Build your production dashboard

## Success!

You now have a powerful visual builder for creating dashboards! You can:
- Build dashboards without writing JSON
- See your changes in real-time
- Learn JSON structure by switching tabs
- Use both visual and code editing as needed

Start building your custom dashboard now!

For more details, see [VISUAL-BUILDER-GUIDE.md](./VISUAL-BUILDER-GUIDE.md)

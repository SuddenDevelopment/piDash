# Visual Builder Guide

The Visual Builder provides a user-friendly interface for creating and editing dashboard configurations without writing JSON directly.

## Overview

The Configuration Builder now has **3 tabs**:
1. **Visual Builder** - Form-based UI for creating pages and panels
2. **Dashboard JSON** - Professional JSON editor with syntax highlighting
3. **CSS Theme** - CSS editor for theme customization

## Visual Builder Features

### Page Management

**Create Pages:**
- Click "+ Add Page" to create a new page
- Each page has a unique ID and customizable name
- Switch between pages using the page tabs

**Page Properties:**
- **Page Name** - Display name shown in navigation
- **Page ID** - Unique identifier (auto-generated)
- **Delete Page** - Remove a page (requires at least 1 page)

### Layout Configuration

**Layout Types:**
- **Flex** - Flexible box layout (most common)
- **Grid** - Grid-based layout with rows/columns
- **Absolute** - Absolute positioning

**Flex Layout Options:**
- **Direction** - row or column
- **Gap** - Spacing between items (in pixels)
- **Padding** - Inner spacing (in pixels)
- **Justify Content** - Horizontal alignment
  - flex-start (left/top)
  - center
  - flex-end (right/bottom)
  - space-between
  - space-around
- **Align Items** - Vertical alignment
  - flex-start
  - center
  - flex-end
  - stretch

**Grid Layout Options:**
- **Columns** - Number of columns
- **Rows** - Number of rows
- **Gap** - Spacing between grid items
- **Padding** - Inner spacing

### Panel Management

**Add Panels:**
- Click "+ Add Panel" to add a new panel to the page
- Multiple panels can be added to each page
- Panels are rendered in order

**Panel Types:**

1. **Text** - Static or dynamic text content
   - Properties: Text content

2. **Container** - Groups other panels
   - Can contain nested panels (child panels)
   - Used for organizing layouts

3. **Metric** - Display key metrics/KPIs
   - Properties:
     - Data Source (e.g., "mock://data")
     - Data Path (e.g., "cpu")
     - Format string

4. **Chart** - Data visualizations
   - Chart Types:
     - line
     - bar
     - area
     - pie
   - Properties: Chart type selection

5. **Table** - Tabular data display
   - Properties: Table configuration

6. **Canvas** - 3D/2D graphics
   - Canvas Types:
     - r3f (React Three Fiber - 3D)
     - webgl (WebGL)
     - 2d (2D Canvas)

**Common Panel Properties:**
- **Panel ID** - Unique identifier (auto-generated)
- **Panel Type** - Type selector with buttons
- **Flex** - Flex grow factor (numeric)
  - 1 = equal space
  - 2 = twice the space
  - Leave empty for auto

### Workflow

**Creating a Dashboard:**

1. **Create Pages**
   - Add pages for different views
   - Name them appropriately
   - Configure layout type and direction

2. **Configure Layout**
   - Set grid/flex layout
   - Adjust gaps and padding
   - Configure alignment

3. **Add Panels**
   - Add panels to display content
   - Configure panel types
   - Set flex values for sizing

4. **Save Configuration**
   - Click "Save Config" button
   - Configuration saves to custom-dashboard.json
   - Dashboard automatically uses custom config

5. **Preview Changes**
   - Click "Refresh Dashboard"
   - Navigate back to dashboard
   - See your changes live

## Tab Switching

**Visual Builder → JSON:**
- Changes in visual builder automatically sync to JSON
- Switch to JSON tab to see generated configuration
- Great for learning JSON structure

**JSON → Visual Builder:**
- Valid JSON changes sync back to visual builder
- Edit JSON for advanced features
- Visual builder updates automatically

**Bidirectional Sync:**
- Both tabs stay in sync
- Edit in whichever is more convenient
- No data loss when switching tabs

## Professional JSON Editor (Web Only)

When running on web, the JSON and CSS tabs use **Ace Editor**:

**Features:**
- Syntax highlighting (Monokai theme)
- Line numbers
- Auto-completion
- Code folding
- Error highlighting
- Find/replace

**Keyboard Shortcuts:**
- Ctrl/Cmd + F - Find
- Ctrl/Cmd + H - Replace
- Ctrl/Cmd + / - Toggle comment
- Tab - Indent
- Shift + Tab - Outdent

**Fallback:**
On non-web platforms, a plain TextInput is used as fallback.

## Pro Tips

### Visual Builder Tips

1. **Start Simple**
   - Create one page first
   - Add a few text panels
   - Save and preview
   - Iterate from there

2. **Use Flex Wisely**
   - flex: 1 on all panels = equal height
   - flex: 2 on one panel = double height
   - No flex = auto size

3. **Layout Direction**
   - Column direction = vertical stack
   - Row direction = horizontal stack
   - Combine with containers for complex layouts

4. **Grid vs Flex**
   - Grids: Fixed rows/columns (dashboards)
   - Flex: Dynamic flowing content (lists)

### Advanced Techniques

1. **Nested Layouts**
   - Use containers with panels inside
   - Switch between JSON tab to add children
   - Create complex multi-level layouts

2. **Custom Properties**
   - Switch to JSON tab for advanced properties
   - Add custom styles, labels, events
   - Visual builder preserves your additions

3. **Rapid Prototyping**
   - Use visual builder for structure
   - Switch to JSON for fine-tuning
   - Preview frequently

4. **Template Reuse**
   - Create a page structure
   - Copy/paste in JSON editor
   - Modify IDs and content
   - Instant page templates

## Validation

The visual builder validates:
- At least 1 page required
- Unique page IDs
- Unique panel IDs within a page
- Valid layout types
- Numeric values for numbers

The JSON editor validates:
- JSON syntax
- Required fields (version, pages)
- Structure compliance

## Example Workflow

**Creating a Metrics Dashboard:**

1. Open Visual Builder
2. Create page "Metrics Overview"
3. Set layout:
   - Type: flex
   - Direction: column
   - Gap: 16
   - Padding: 16
4. Add 3 metric panels:
   - CPU Usage (source: mock://data, path: cpu)
   - Memory Usage (source: mock://data, path: memory)
   - Temperature (source: mock://data, path: temp)
5. Set flex: 1 on all metrics
6. Save configuration
7. Refresh dashboard
8. Done!

## Troubleshooting

**Visual Builder Not Updating:**
- Check if config is valid JSON
- Reload configurations
- Check browser console for errors

**Panels Not Showing:**
- Verify panel type is set
- Check if flex values are appropriate
- Ensure panels array is not empty

**Layout Issues:**
- Try different layout types
- Adjust gaps and padding
- Check justify/align settings

**Can't Save:**
- Ensure API server is running
- Check network tab in browser
- Verify JSON is valid

## Next Steps

Now that you have the visual builder:
1. Create your custom dashboards visually
2. Learn JSON structure by switching tabs
3. Use JSON for advanced features
4. Build complex layouts with containers
5. Deploy to production

Happy building!

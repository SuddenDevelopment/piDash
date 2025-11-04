# CSS-Based Theming

piDash uses a CSS file for theming, keeping styling separate from JSON structure.

## Quick Start

The dashboard theme is defined in `/public/styles/dashboard-theme.css` and automatically loaded on web.

### Using the Theme

**In JSON** - Use color tokens with `$` prefix:
```json
{
  "style": {
    "color": "$primary",
    "backgroundColor": "$surface",
    "borderColor": "$border"
  }
}
```

## Futuristic Theme

The default theme features:
- **Deep space backgrounds** (`#0A0E1A`) with blue tint
- **Electric cyan primary** (`#00D9FF`) for high-tech aesthetic
- **High contrast thin lines** for borders and separators
- **Subtle large surfaces** with low saturation
- **Vibrant neon data colors** for charts (8 distinct hues)

### Color Philosophy
- **Lines**: High contrast, thin (`#00D9FF`, `#2A3F5F`)
- **Areas**: Subtle, muted (`#0A0E1A`, `#121825`)
- **Data**: Vibrant, distinct neon colors
- **Text**: Excellent contrast (WCAG AAA)

## Available Color Tokens

### Primary Colors
- `$primary` - `#00D9FF` (Cyan)
- `$secondary` - `#B794F6` (Purple)
- `$accent` - `#FF6B9D` (Pink)

### Status Colors
- `$success` - `#00FFA3` (Green)
- `$warning` - `#FFB800` (Orange)
- `$error` - `#FF3366` (Red)
- `$info` - `#00D9FF` (Cyan)

### Backgrounds (Layered)
- `$background` - `#0A0E1A` (Base)
- `$backgroundLight` - `#131829`
- `$backgroundLighter` - `#1A2035`
- `$backgroundDark` - `#050812`

### Surfaces (Cards/Panels)
- `$surface` - `#121825`
- `$surfaceLight` - `#1A2338`
- `$surfaceDark` - `#0D1220`

### Text
- `$text` - `#E8F0FF` (Primary)
- `$textSecondary` - `#8BA3CC`
- `$textMuted` - `#5A6B8C`
- `$textInverse` - `#0A0E1A`

### Borders
- `$border` - `#2A3F5F`
- `$borderLight` - `#3D5170`
- `$borderDark` - `#1A2840`

### Chart Colors (8 colors)
- `$chart1` - `#00D9FF` (Cyan)
- `$chart2` - `#B794F6` (Purple)
- `$chart3` - `#00FFA3` (Green)
- `$chart4` - `#FF6B9D` (Pink)
- `$chart5` - `#FFB800` (Orange)
- `$chart6` - `#6366F1` (Indigo)
- `$chart7` - `#14B8A6` (Teal)
- `$chart8` - `#F472B6` (Rose)

### Semantic
- `$highlight` - `#00D9FF`
- `$overlay` - `rgba(10, 14, 26, 0.85)`
- `$shadow` - `rgba(0, 0, 0, 0.5)`

## Creating Custom Themes

### Method 1: Edit the CSS File

Edit `/public/styles/dashboard-theme.css`:

```css
:root {
  --primary: #YOUR_COLOR;
  --secondary: #YOUR_COLOR;
  /* ... etc */
}
```

### Method 2: Create a New CSS File

Create `/public/styles/my-theme.css`:

```css
:root {
  /* Your custom colors */
  --primary: #2563EB;
  --background: #FFFFFF;
  --text: #111827;
}
```

Update `app/_layout.tsx` to load your theme:
```typescript
themeLink.href = '/styles/my-theme.css';
```

### Method 3: Runtime Theme Switching

Load different CSS files based on conditions:

```typescript
const theme = 'dark'; // or 'light', 'cyberpunk', etc.
themeLink.href = `/styles/theme-${theme}.css`;
```

## Example Themes

### Cyberpunk Theme

```css
:root {
  --primary: #FF0080;
  --secondary: #00FFFF;
  --accent: #FFFF00;
  --background: #0D0221;
  --border: #FF0080;
}
```

### Corporate Theme

```css
:root {
  --primary: #2563EB;
  --secondary: #7C3AED;
  --background: #F9FAFB;
  --text: #111827;
  --border: #E5E7EB;
}
```

### Nature Theme

```css
:root {
  --primary: #10B981;
  --secondary: #3B82F6;
  --background: #1F2937;
  --text: #F3F4F6;
}
```

## Using CSS Variables Directly

You can also use CSS variables in custom HTML/components:

```html
<div style="background-color: var(--surface); border: 1px solid var(--border);">
  <p style="color: var(--text-secondary);">Content</p>
</div>
```

## Utility Classes

The CSS file includes utility classes:

```html
<div class="bg-surface text-primary border glow-primary">
  Styled content
</div>
```

Available classes:
- `.bg-primary`, `.bg-surface`, etc.
- `.text-primary`, `.text-secondary`, etc.
- `.border`, `.border-primary`, etc.
- `.glow-primary`, `.glow-secondary`

## Best Practices

### Consistency
- Use tokens instead of hard-coded colors
- Keep the same token for the same purpose
- Test on different displays

### Performance
- One CSS file per theme
- Use CSS variables for runtime changes
- Avoid inline styles when possible

### Accessibility
- Maintain 4.5:1 contrast ratio minimum
- Test with color blind simulators
- Don't rely on color alone

## File Locations

```
public/
  └── styles/
      └── dashboard-theme.css    # Main theme file

app/
  └── _layout.tsx                # Loads CSS file

components/dashboard/utils/
  └── styleResolver.ts           # Maps tokens to colors
```

## Deploying Themes

When deploying to Raspberry Pi:

```bash
# CSS file is included in the build
npm run build:web

# Deploy as usual
bash scripts/deploy-to-pi.sh
```

The CSS file is automatically included in the `dist/` folder.

## Troubleshooting

### Colors not updating
- Clear browser cache (Cmd+Shift+R)
- Check browser DevTools for CSS loading errors
- Verify file path: `/styles/dashboard-theme.css`

### CSS not loading
- Check `app/_layout.tsx` has the link tag
- Verify file exists in `public/styles/`
- Check browser console for 404 errors

## Summary

- ✅ Theme defined in single CSS file
- ✅ Tokens used in JSON (`$primary`, etc.)
- ✅ Easy to create custom themes
- ✅ CSS variables for advanced use
- ✅ Automatic loading on web
- ✅ Hot-reload support

Keep your JSON for structure, CSS for styling!

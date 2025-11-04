# JSON Dashboard MVP - Quick Start

## 🚀 Start the App

```bash
npm start
```

Then press `w` to open in web browser or navigate to `http://localhost:8081`

## 🎮 Navigation

- **Swipe Left/Right** - Navigate between pages
- **Click Arrows** (← →) - Use bottom navigation buttons  
- **Click Dots** - Jump to specific page
- **Auto-loops** - Page 5 → Page 1

## 📄 5 Pages to Explore

### 1. Welcome (Fade transition)
- Centered title and feature list
- Demonstrates fade-in animation

### 2. Row Layout (Slide transition)
- 3 horizontal metric cards
- Labels: top-left, top-center, top-right
- Chart placeholder

### 3. Column Layout (Slide transition)
- Two-column structure
- Status cards + data table + canvas
- Mixed label positions

### 4. Nested Layout (Scale transition)
- 3-level hierarchy (Row → Column → Row)
- Color-coded nesting
- Multiple label positions

### 5. Label Showcase (Fade transition)
- 3×3 grid showing all 9 label positions
- Color-coded for visibility

## 🎨 Features to Observe

✅ **Smooth transitions** between pages
✅ **Flex layouts** (row/column)
✅ **N-tier nesting** (3+ levels deep)
✅ **9 label positions** (all corners + centers)
✅ **Theme tokens** ($primary, $success, $error, etc.)
✅ **Responsive navigation** (swipe + buttons)

## 📝 Configuration

Edit the dashboard: `config/dashboards/mvp-test.json`

Validate changes:
```bash
npx tsx scripts/validate-dashboard.ts config/dashboards/mvp-test.json
```

## 📚 Full Documentation

- **Complete Guide**: `docs/dashboard-json-guide.md`
- **Implementation**: `docs/mvp-implementation-summary.md`  
- **Schema Reference**: `docs/dashboard-schema.json`

## 🐛 Troubleshooting

**Metro not starting?**
```bash
npx expo start --clear
```

**Port 8081 in use?**
```bash
lsof -ti:8081 | xargs kill -9
npm start
```

**JSON import error?**
- Fixed! Using `require()` for JSON imports

## ✨ Try It Yourself

1. Edit `config/dashboards/mvp-test.json`
2. Change text, colors, or layouts
3. Validate with the CLI tool
4. Refresh browser to see changes

---

**The MVP is fully functional and ready to explore!** 🎉

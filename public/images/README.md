# Dashboard Images

Place your dashboard images in this directory.

## Usage

Images placed here will be accessible via URL paths like:

```
/images/your-image.jpg
/images/your-image.png
```

## Image Overlay Page

The "Image Overlay" dashboard page uses images from this directory. To use it:

1. Add your image file to this directory (e.g., `dashboard-bg.jpg`)
2. Update the config at `config/dashboards/mvp-test.json`
3. Find the "image-overlay" page
4. Update the `backgroundImage` property:
   ```json
   "backgroundImage": "url('/images/dashboard-bg.jpg')"
   ```

## Recommended Image Specs

For best fit on the Raspberry Pi display (800×480):

- **Resolution**: 800×480 pixels (exact) or 1600×960 (2x for retina)
- **Aspect Ratio**: 5:3 (1.667:1)
- **Format**: JPG (for photos) or PNG (for graphics with transparency)
- **File Size**: Keep under 500KB for fast loading

## Background Size Options

In your dashboard config, you can control how the image fits:

- `"backgroundSize": "contain"` - Fits entire image, may show letterboxing
- `"backgroundSize": "cover"` - Fills entire space, may crop image
- `"backgroundSize": "100% 100%"` - Stretches to fill (may distort)

## Example Images

Consider adding:
- `logo.png` - Your organization's logo
- `background.jpg` - Full-screen background image
- `dashboard-bg.jpg` - Dashboard-specific background
- `overlay-*.png` - Transparent overlay graphics

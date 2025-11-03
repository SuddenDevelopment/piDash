/**
 * Display Configuration
 * Configure the fixed resolution for your Raspberry Pi display
 */

export const DISPLAY_CONFIG = {
  // Fixed display resolution (no scrolling)
  width: 800,
  height: 480,

  // Orientation
  orientation: 'landscape' as const,

  // Safe area (if you need margins, adjust these)
  safeArea: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  // Device type
  deviceType: 'raspberry-pi-5inch' as const,
};

/**
 * Get responsive dimensions based on display config
 */
export const getDimensions = () => ({
  width: DISPLAY_CONFIG.width,
  height: DISPLAY_CONFIG.height,
  safeWidth: DISPLAY_CONFIG.width - DISPLAY_CONFIG.safeArea.left - DISPLAY_CONFIG.safeArea.right,
  safeHeight: DISPLAY_CONFIG.height - DISPLAY_CONFIG.safeArea.top - DISPLAY_CONFIG.safeArea.bottom,
});

/**
 * Scale helper for consistent sizing
 * Use this for any dynamic sizing to maintain proportions
 */
export const scale = (size: number) => {
  // Base scale is 800x480
  const baseWidth = 800;
  return (DISPLAY_CONFIG.width / baseWidth) * size;
};

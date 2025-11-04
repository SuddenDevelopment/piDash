/**
 * Style resolver - Converts JSON styles to React Native styles with theme token support
 */

import type { StyleConfig, DashboardConfig } from '@/types/dashboard-schema';

// Futuristic theme tokens mapping
// These match the CSS variables in dashboard-theme.css
const DEFAULT_THEME_TOKENS: Record<string, any> = {
  // Colors - Futuristic Data Viz Theme
  $primary: '#00D9FF',
  $secondary: '#B794F6',
  $accent: '#FF6B9D',
  $success: '#00FFA3',
  $warning: '#FFB800',
  $error: '#FF3366',
  $info: '#00D9FF',
  $background: '#0A0E1A',
  $backgroundLight: '#131829',
  $backgroundLighter: '#1A2035',
  $backgroundDark: '#050812',
  $surface: '#121825',
  $surfaceLight: '#1A2338',
  $surfaceDark: '#0D1220',
  $text: '#E8F0FF',
  $textSecondary: '#8BA3CC',
  $textMuted: '#5A6B8C',
  $textInverse: '#0A0E1A',
  $border: '#2A3F5F',
  $borderLight: '#3D5170',
  $borderDark: '#1A2840',
  $chart1: '#00D9FF',
  $chart2: '#B794F6',
  $chart3: '#00FFA3',
  $chart4: '#FF6B9D',
  $chart5: '#FFB800',
  $chart6: '#6366F1',
  $chart7: '#14B8A6',
  $chart8: '#F472B6',
  $highlight: '#00D9FF',
  $overlay: 'rgba(10, 14, 26, 0.85)',
  $shadow: 'rgba(0, 0, 0, 0.5)',

  // Spacing (0-24, 4px increments)
  $0: 0,
  $1: 4,
  $2: 8,
  $3: 12,
  $4: 16,
  $5: 20,
  $6: 24,
  $8: 32,
  $10: 40,
  $12: 48,
  $16: 64,
  $20: 80,
  $24: 96,

  // Border radius
  $none: 0,
  $xs: 2,
  $sm: 4,
  $md: 8,
  $lg: 12,
  $xl: 16,
  $2xl: 20,
  $3xl: 24,
  $full: 9999,

  // Font sizes
  $2xs: 10,
  $xs: 12,
  $sm: 14,
  $md: 16,
  $lg: 18,
  $xl: 20,
  $2xl: 24,
  $3xl: 30,
  $4xl: 36,
  $5xl: 48,
  $6xl: 60,
};

export function resolveStyle(style: StyleConfig, config: DashboardConfig): any {
  const resolved: any = {};

  for (const [key, value] of Object.entries(style)) {
    if (typeof value === 'string' && value.startsWith('$')) {
      // Resolve theme token
      const tokenValue = DEFAULT_THEME_TOKENS[value];
      if (tokenValue !== undefined) {
        resolved[key] = tokenValue;
      } else {
        console.warn(`Unknown theme token: ${value}`);
        resolved[key] = value;
      }
    } else {
      resolved[key] = value;
    }
  }

  // Handle special aliases
  if (resolved.bg && !resolved.backgroundColor) {
    resolved.backgroundColor = resolved.bg;
    delete resolved.bg;
  }

  return resolved;
}

export function resolveTokenValue(value: string): any {
  if (typeof value === 'string' && value.startsWith('$')) {
    return DEFAULT_THEME_TOKENS[value] ?? value;
  }
  return value;
}

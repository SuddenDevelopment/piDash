/**
 * Style resolver - Converts JSON styles to React Native styles with theme token support
 */

import type { StyleConfig, DashboardConfig } from '@/types/dashboard-schema';

// Theme tokens mapping
const THEME_TOKENS: Record<string, any> = {
  // Colors
  $primary: '#3B82F6',
  $secondary: '#8B5CF6',
  $success: '#10B981',
  $warning: '#F59E0B',
  $error: '#EF4444',
  $info: '#06B6D4',
  $background: '#0A0A0A',
  $backgroundLight: '#1A1A1A',
  $backgroundLighter: '#2A2A2A',
  $text: '#FFFFFF',
  $textSecondary: '#A0A0A0',
  $textMuted: '#707070',

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
      const tokenValue = THEME_TOKENS[value];
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
    return THEME_TOKENS[value] ?? value;
  }
  return value;
}

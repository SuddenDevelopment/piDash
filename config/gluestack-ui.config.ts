import { createConfig } from '@gluestack-style/react';

export const config = createConfig({
  aliases: {
    bg: 'backgroundColor',
    bgColor: 'backgroundColor',
    h: 'height',
    w: 'width',
    p: 'padding',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    pt: 'paddingTop',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    pr: 'paddingRight',
    m: 'margin',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    mt: 'marginTop',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mr: 'marginRight',
  } as const,
  tokens: {
    colors: {
      // Dark theme colors optimized for Pi display
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4',

      // Background colors
      background: '#111827',
      backgroundLight: '#1f2937',
      backgroundLighter: '#374151',

      // Text colors
      text: '#f9fafb',
      textSecondary: '#9ca3af',
      textMuted: '#6b7280',

      // Border colors
      border: '#374151',
      borderLight: '#4b5563',
    },
    space: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
      12: 48,
      16: 64,
      20: 80,
      24: 96,
    },
    radii: {
      none: 0,
      xs: 2,
      sm: 4,
      md: 6,
      lg: 8,
      xl: 12,
      '2xl': 16,
      '3xl': 24,
      full: 9999,
    },
    fontSizes: {
      '2xs': 10,
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
      '6xl': 60,
    },
    lineHeights: {
      '2xs': 16,
      xs: 18,
      sm: 20,
      md: 22,
      lg: 24,
      xl: 28,
      '2xl': 32,
      '3xl': 40,
      '4xl': 48,
      '5xl': 64,
      '6xl': 72,
    },
    fontWeights: {
      hairline: '100',
      thin: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },
  globalStyle: {
    variants: {
      hardShadow: {
        '1': {
          shadowColor: '$backgroundLight',
          shadowOffset: {
            width: -2,
            height: 2,
          },
          shadowRadius: 8,
          shadowOpacity: 0.5,
          elevation: 10,
        },
      },
      softShadow: {
        '1': {
          shadowColor: '$backgroundLight',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowRadius: 10,
          shadowOpacity: 0.1,
          elevation: 5,
        },
      },
    },
  },
} as const);

export type Config = typeof config;

declare module '@gluestack-style/react' {
  interface ICustomConfig extends Config {}
}

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '../config/gluestack-ui.config';
import { DISPLAY_CONFIG } from '../config/display';

export default function RootLayout() {
  useEffect(() => {
    // Set viewport and body styles for web
    if (Platform.OS === 'web') {
      // Set viewport meta tag
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          'content',
          `width=${DISPLAY_CONFIG.width}, height=${DISPLAY_CONFIG.height}, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no`
        );
      }

      // Apply global styles to html and body
      const style = document.createElement('style');
      style.textContent = `
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          width: ${DISPLAY_CONFIG.width}px !important;
          height: ${DISPLAY_CONFIG.height}px !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          background-color: #111827 !important;
        }

        * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* Disable scrollbars */
        ::-webkit-scrollbar {
          display: none !important;
        }

        body {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <GluestackUIProvider config={config}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#111827',
            margin: 0,
            padding: 0,
          },
        }}
      />
    </GluestackUIProvider>
  );
}

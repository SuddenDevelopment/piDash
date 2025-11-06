/**
 * PageRenderer - Renders a single page with transition animations
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import type { Page, DashboardConfig } from '@/types/dashboard-schema';
import { LayoutRenderer } from './LayoutRenderer';
import { getTransitionAnimation } from './utils/animations';
import { DISPLAY_CONFIG } from '@/config/display';

type PageRendererProps = {
  page: Page;
  config: DashboardConfig;
  onNavigateTo: (pageId: string) => void;
};

const SCREEN_WIDTH = DISPLAY_CONFIG.width;
const SCREEN_HEIGHT = DISPLAY_CONFIG.height;

export function PageRenderer({ page, config, onNavigateTo }: PageRendererProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(SCREEN_WIDTH);
    scaleAnim.setValue(0.95);

    // Get transition config (use page-specific or default)
    const transitionConfig = page.transitions?.enter || config.config.transitions;
    const duration = transitionConfig?.duration || 300;
    const transitionType = page.transitions?.enter?.type || 'fade';

    // Run enter animation
    const animations = [];

    if (transitionType === 'fade') {
      animations.push(
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        })
      );
    } else if (transitionType === 'slide') {
      const direction = page.transitions?.enter?.direction || 'left';
      const slideStart = direction === 'left' ? SCREEN_WIDTH : -SCREEN_WIDTH;
      slideAnim.setValue(slideStart);

      animations.push(
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        })
      );
      animations.push(
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        })
      );
    } else if (transitionType === 'scale') {
      animations.push(
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
        ])
      );
    } else {
      // No animation, just show
      fadeAnim.setValue(1);
      scaleAnim.setValue(1);
      slideAnim.setValue(0);
    }

    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  }, [page.id]);

  const transitionType = page.transitions?.enter?.type || 'fade';
  const animatedStyle = getAnimatedStyle(transitionType, fadeAnim, slideAnim, scaleAnim);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LayoutRenderer
        layout={page.layout}
        panels={page.panels}
        config={config}
        onNavigateTo={onNavigateTo}
      />
    </Animated.View>
  );
}

function getAnimatedStyle(
  type: string,
  fadeAnim: Animated.Value,
  slideAnim: Animated.Value,
  scaleAnim: Animated.Value
) {
  switch (type) {
    case 'slide':
      return {
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      };
    case 'scale':
      return {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      };
    case 'fade':
    default:
      return {
        opacity: fadeAnim,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

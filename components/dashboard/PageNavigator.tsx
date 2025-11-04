/**
 * PageNavigator - Handles page navigation controls and gestures
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, PanResponder } from 'react-native';
import type { Page, NavigationConfig } from '@/types/dashboard-schema';
import { useSettings } from '@/contexts/SettingsContext';

type PageNavigatorProps = {
  currentIndex: number;
  totalPages: number;
  pages: Page[];
  onNavigateNext: () => void;
  onNavigatePrevious: () => void;
  onNavigateTo: (pageId: string) => void;
  navigationConfig: NavigationConfig;
};

export function PageNavigator({
  currentIndex,
  totalPages,
  pages,
  onNavigateNext,
  onNavigatePrevious,
  onNavigateTo,
  navigationConfig,
}: PageNavigatorProps) {
  const { settings } = useSettings();

  // Auto-transition support with settings toggle
  useEffect(() => {
    const scheduleEvent = navigationConfig.events?.find(e => e.type === 'onSchedule');

    // Only auto-transition if enabled in settings AND configured in JSON
    if (
      settings.autoTransitionEnabled &&
      scheduleEvent?.schedule?.rotate &&
      scheduleEvent.schedule.interval
    ) {
      const interval = setInterval(() => {
        onNavigateNext();
      }, scheduleEvent.schedule.interval);

      return () => clearInterval(interval);
    }
  }, [navigationConfig, onNavigateNext, settings.autoTransitionEnabled]);

  // Swipe gestures using PanResponder
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      const { dx } = gestureState;
      const hasSwipeLeft = navigationConfig.events?.some(e => e.type === 'onSwipeLeft');
      const hasSwipeRight = navigationConfig.events?.some(e => e.type === 'onSwipeRight');

      if (dx < -50 && hasSwipeLeft) {
        // Swipe left - go to next
        onNavigateNext();
      } else if (dx > 50 && hasSwipeRight) {
        // Swipe right - go to previous
        onNavigatePrevious();
      }
    },
  });

  return (
    <View style={styles.container}>
      {/* Page indicators */}
      <View style={styles.indicators}>
        {pages.map((page, index) => (
          <TouchableOpacity
            key={page.id}
            style={[
              styles.indicator,
              index === currentIndex && styles.indicatorActive,
            ]}
            onPress={() => onNavigateTo(page.id)}
          />
        ))}
      </View>

      {/* Page counter */}
      <View style={styles.pageCounter}>
        <Text style={styles.pageCounterText}>
          {currentIndex + 1} / {totalPages}
        </Text>
      </View>

      {/* Navigation buttons */}
      <View style={styles.navButtons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onNavigatePrevious}
          disabled={totalPages <= 1}
        >
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={onNavigateNext}
          disabled={totalPages <= 1}
        >
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 100,
  },
  indicators: {
    flexDirection: 'row',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  indicatorActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 24,
  },
  pageCounter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  pageCounterText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
  },
  navButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 18,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});

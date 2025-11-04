/**
 * DashboardRenderer - Core component that interprets and renders JSON dashboards
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import type { DashboardConfig, Page } from '@/types/dashboard-schema';
import { PageRenderer } from './PageRenderer';
import { PageNavigator } from './PageNavigator';
import { SettingsModal } from './SettingsModal';
import { validateDashboardConfig } from '@/lib/dashboard-validator';

type DashboardRendererProps = {
  config: DashboardConfig;
  onError?: (error: string) => void;
  onRefresh?: () => void;
};

export function DashboardRenderer({ config, onError, onRefresh }: DashboardRendererProps) {
  const [currentPageId, setCurrentPageId] = useState<string>(config.navigation.initialPage);
  const [isValidated, setIsValidated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Validate config on mount
  useEffect(() => {
    const result = validateDashboardConfig(config);
    if (!result.valid) {
      const errorMsg = `Invalid dashboard config: ${result.errors.map(e => `${e.path}: ${e.message}`).join(', ')}`;
      console.error(errorMsg);
      onError?.(errorMsg);
      return;
    }
    setIsValidated(true);
  }, [config]);

  if (!isValidated) {
    return null;
  }

  const currentPage = config.pages.find(p => p.id === currentPageId);
  const currentPageIndex = config.pages.findIndex(p => p.id === currentPageId);

  if (!currentPage) {
    console.error(`Page not found: ${currentPageId}`);
    return null;
  }

  const handleNavigateNext = () => {
    const nextIndex = (currentPageIndex + 1) % config.pages.length;
    setCurrentPageId(config.pages[nextIndex].id);
  };

  const handleNavigatePrevious = () => {
    const prevIndex = (currentPageIndex - 1 + config.pages.length) % config.pages.length;
    setCurrentPageId(config.pages[prevIndex].id);
  };

  const handleNavigateTo = (pageId: string) => {
    setCurrentPageId(pageId);
  };

  // Get auto-transition interval from config
  const autoTransitionInterval = config.navigation.events
    ?.find(e => e.type === 'onSchedule')
    ?.schedule?.interval;

  return (
    <View style={styles.container}>
      <PageRenderer
        page={currentPage}
        config={config}
        onNavigateTo={handleNavigateTo}
      />

      <PageNavigator
        currentIndex={currentPageIndex}
        totalPages={config.pages.length}
        pages={config.pages}
        onNavigateNext={handleNavigateNext}
        onNavigatePrevious={handleNavigatePrevious}
        onNavigateTo={handleNavigateTo}
        navigationConfig={config.navigation}
      />

      {/* Top Right Menu */}
      <View style={styles.topRightMenu}>
        {/* Refresh Button */}
        {onRefresh && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onRefresh}
          >
            <Text style={styles.menuIcon}>↻</Text>
          </TouchableOpacity>
        )}

        {/* Settings Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowSettings(true)}
        >
          <Text style={styles.menuIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Modal */}
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        autoTransitionInterval={autoTransitionInterval}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topRightMenu: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
    zIndex: 200,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuIcon: {
    fontSize: 24,
  },
});

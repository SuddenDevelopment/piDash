/**
 * DashboardRenderer - Core component that interprets and renders JSON dashboards
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import type { DashboardConfig, Page } from '@/types/dashboard-schema';
import { PageRenderer } from './PageRenderer';
import { PageNavigator } from './PageNavigator';
import { validateDashboardConfig } from '@/lib/dashboard-validator';

type DashboardRendererProps = {
  config: DashboardConfig;
  onError?: (error: string) => void;
};

export function DashboardRenderer({ config, onError }: DashboardRendererProps) {
  const [currentPageId, setCurrentPageId] = useState<string>(config.navigation.initialPage);
  const [isValidated, setIsValidated] = useState(false);

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

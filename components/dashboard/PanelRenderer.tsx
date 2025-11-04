/**
 * PanelRenderer - Renders individual panels based on type
 */

import React from 'react';
import { View, Text as RNText, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import type { Panel, DashboardConfig } from '@/types/dashboard-schema';
import { resolveStyle } from './utils/styleResolver';
import { LabelRenderer } from './LabelRenderer';
import { LayoutRenderer } from './LayoutRenderer';

type PanelRendererProps = {
  panel: Panel;
  config: DashboardConfig;
  onNavigateTo: (pageId: string) => void;
};

export function PanelRenderer({ panel, config, onNavigateTo }: PanelRendererProps) {
  const panelStyle = panel.style ? resolveStyle(panel.style, config) : {};
  const flexStyle = panel.flex ? { flex: panel.flex } : {};

  // Extract background image if present (React Native needs ImageBackground component)
  let backgroundImageUri: string | null = null;
  let resizeMode: 'cover' | 'contain' | 'stretch' | 'center' = 'cover';

  if (panelStyle.backgroundImage) {
    // Extract URL from CSS url('...') format
    const match = panelStyle.backgroundImage.match(/url\(['"]?([^'"()]+)['"]?\)/);
    if (match) {
      backgroundImageUri = match[1];
    }

    // Map CSS backgroundSize to React Native resizeMode
    if (panelStyle.backgroundSize === 'contain') {
      resizeMode = 'contain';
    } else if (panelStyle.backgroundSize === 'cover') {
      resizeMode = 'cover';
    }

    // Remove CSS properties not supported in React Native
    delete panelStyle.backgroundImage;
    delete panelStyle.backgroundSize;
    delete panelStyle.backgroundPosition;
    delete panelStyle.backgroundRepeat;
  }

  // Handle click events
  const hasClickEvent = panel.events?.some(e => e.type === 'onClick');
  const handlePress = () => {
    const clickEvent = panel.events?.find(e => e.type === 'onClick');
    if (clickEvent) {
      clickEvent.actions.forEach(action => {
        if (action.type === 'navigateTo' && action.target) {
          onNavigateTo(action.target);
        }
      });
    }
  };

  const content = renderPanelContent(panel, config, onNavigateTo);

  const WrapperComponent = hasClickEvent ? TouchableOpacity : View;
  const wrapperProps = hasClickEvent ? { onPress: handlePress, activeOpacity: 0.7 } : {};

  // If there's a background image, use ImageBackground
  if (backgroundImageUri) {
    // For image backgrounds, we need to combine flex and panelStyle
    const containerStyle = { ...flexStyle, ...panelStyle };

    return (
      <WrapperComponent style={[containerStyle]} {...wrapperProps}>
        <ImageBackground
          source={{ uri: backgroundImageUri }}
          style={styles.imageBackground}
          resizeMode={resizeMode}
        >
          {/* Label overlay */}
          {panel.label && (
            <LabelRenderer label={panel.label} config={config} />
          )}

          {/* Panel content */}
          {content}
        </ImageBackground>
      </WrapperComponent>
    );
  }

  return (
    <WrapperComponent style={[panelStyle, flexStyle]} {...wrapperProps}>
      {/* Label overlay */}
      {panel.label && (
        <LabelRenderer label={panel.label} config={config} />
      )}

      {/* Panel content */}
      {content}
    </WrapperComponent>
  );
}

function renderPanelContent(
  panel: Panel,
  config: DashboardConfig,
  onNavigateTo: (pageId: string) => void
): React.ReactNode {
  switch (panel.type) {
    case 'container':
      return renderContainer(panel, config, onNavigateTo);

    case 'text':
      return renderText(panel, config);

    case 'metric':
      return renderMetric(panel, config);

    case 'chart':
      return renderChartPlaceholder(panel, config);

    case 'table':
      return renderTablePlaceholder(panel, config);

    case 'canvas':
      return renderCanvasPlaceholder(panel, config);

    default:
      return (
        <View style={styles.placeholder}>
          <RNText style={styles.placeholderText}>
            Unsupported panel type: {panel.type}
          </RNText>
        </View>
      );
  }
}

function renderContainer(
  panel: Panel,
  config: DashboardConfig,
  onNavigateTo: (pageId: string) => void
): React.ReactNode {
  if (!panel.children || panel.children.length === 0) {
    return null;
  }

  const layout = panel.layout || { type: 'flex' as const, direction: 'column' as const };

  return (
    <LayoutRenderer
      layout={layout}
      panels={panel.children}
      config={config}
      onNavigateTo={onNavigateTo}
      parentStyle={styles.containerContent}
    />
  );
}

function renderText(panel: Panel, config: DashboardConfig): React.ReactNode {
  const textStyle = panel.style ? resolveStyle(panel.style, config) : {};

  return (
    <RNText style={[styles.text, textStyle]}>
      {panel.text || ''}
    </RNText>
  );
}

function renderMetric(panel: Panel, config: DashboardConfig): React.ReactNode {
  // For MVP, use mock data
  const mockValue = '42';
  const valueStyle = panel.value?.style ? resolveStyle(panel.value.style, config) : {};

  return (
    <View style={styles.metricContainer}>
      <RNText style={[styles.metricValue, valueStyle]}>
        {mockValue}
        {panel.unit || ''}
      </RNText>
    </View>
  );
}

function renderChartPlaceholder(panel: Panel, config: DashboardConfig): React.ReactNode {
  return (
    <View style={styles.placeholder}>
      <RNText style={styles.placeholderText}>
        📊 {panel.chartType || 'Chart'}
      </RNText>
      <RNText style={styles.placeholderSubtext}>
        Chart visualization (coming soon)
      </RNText>
    </View>
  );
}

function renderTablePlaceholder(panel: Panel, config: DashboardConfig): React.ReactNode {
  return (
    <View style={styles.placeholder}>
      <RNText style={styles.placeholderText}>
        📋 Data Table
      </RNText>
      <RNText style={styles.placeholderSubtext}>
        {panel.columns?.length || 0} columns
      </RNText>
    </View>
  );
}

function renderCanvasPlaceholder(panel: Panel, config: DashboardConfig): React.ReactNode {
  return (
    <View style={styles.placeholder}>
      <RNText style={styles.placeholderText}>
        🎨 Canvas
      </RNText>
      <RNText style={styles.placeholderSubtext}>
        {panel.canvasType || 'r3f'} renderer
      </RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  containerContent: {
    flex: 1,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  metricContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
  },
  placeholderText: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

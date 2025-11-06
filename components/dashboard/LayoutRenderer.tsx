/**
 * LayoutRenderer - Renders layout containers with flex/grid/absolute positioning
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { LayoutConfig, Panel, DashboardConfig } from '@/types/dashboard-schema';
import { PanelRenderer } from './PanelRenderer';
import { resolveStyle } from './utils/styleResolver';

type LayoutRendererProps = {
  layout: LayoutConfig;
  panels: Panel[];
  config: DashboardConfig;
  onNavigateTo: (pageId: string) => void;
  parentStyle?: any;
};

export function LayoutRenderer({
  layout,
  panels,
  config,
  onNavigateTo,
  parentStyle,
}: LayoutRendererProps) {
  const layoutStyle = buildLayoutStyle(layout);

  return (
    <View style={[layoutStyle, parentStyle]}>
      {panels.map((panel, index) => (
        <PanelRenderer
          key={panel.id || `panel-${index}`}
          panel={panel}
          config={config}
          onNavigateTo={onNavigateTo}
        />
      ))}
    </View>
  );
}

function buildLayoutStyle(layout: LayoutConfig): any {
  const style: any = {};

  // Base layout type
  if (layout.type === 'flex') {
    style.display = 'flex';
    style.flexDirection = layout.direction || 'column';

    if (layout.justify) {
      style.justifyContent = layout.justify;
    }
    if (layout.align) {
      style.alignItems = layout.align;
    }
    if (layout.wrap !== undefined) {
      style.flexWrap = layout.wrap ? 'wrap' : 'nowrap';
    }
  } else if (layout.type === 'grid') {
    // Grid layout - use flex as approximation for now
    style.display = 'flex';
    style.flexDirection = 'row';
    style.flexWrap = 'wrap';
  } else if (layout.type === 'absolute') {
    style.position = 'relative';
  }

  // Dimensions
  // Note: Don't set height: "100%" when using flex - it conflicts with flex: 1 on children
  // Instead, rely on flex: 1 in the parent style to fill available space
  if (layout.height !== undefined) {
    if (layout.height === 'auto') {
      style.height = 'auto';
    } else if (layout.height !== '100%') {
      // Only set explicit numeric heights, skip "100%" to let flex handle it
      style.height = layout.height;
    }
    // If height is "100%", don't set it - parent should have flex: 1 instead
  }

  if (layout.width !== undefined) {
    style.width = layout.width === 'auto' ? 'auto' : layout.width;
  }

  // Spacing
  if (layout.gap !== undefined) {
    style.gap = layout.gap;
  }

  if (layout.padding !== undefined) {
    if (typeof layout.padding === 'number') {
      style.padding = layout.padding;
    } else {
      if (layout.padding.top !== undefined) style.paddingTop = layout.padding.top;
      if (layout.padding.right !== undefined) style.paddingRight = layout.padding.right;
      if (layout.padding.bottom !== undefined) style.paddingBottom = layout.padding.bottom;
      if (layout.padding.left !== undefined) style.paddingLeft = layout.padding.left;
      if (layout.padding.horizontal !== undefined) style.paddingHorizontal = layout.padding.horizontal;
      if (layout.padding.vertical !== undefined) style.paddingVertical = layout.padding.vertical;
    }
  }

  return style;
}

/**
 * LabelRenderer - Renders labels at 9 anchor positions within panels
 */

import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import type { LabelConfig, DashboardConfig } from '@/types/dashboard-schema';
import { resolveStyle } from './utils/styleResolver';

type LabelRendererProps = {
  label: LabelConfig;
  config: DashboardConfig;
};

export function LabelRenderer({ label, config }: LabelRendererProps) {
  const labelStyle = label.style ? resolveStyle(label.style, config) : {};
  const positionStyle = getLabelPositionStyle(label.position, label.offset);

  return (
    <View style={[styles.labelContainer, positionStyle]}>
      <Text style={[styles.labelText, labelStyle]}>
        {label.text}
      </Text>
    </View>
  );
}

function getLabelPositionStyle(
  position: string,
  offset?: { x?: number; y?: number }
): any {
  const offsetX = offset?.x || 0;
  const offsetY = offset?.y || 0;

  const baseStyle: any = {
    position: 'absolute',
  };

  switch (position) {
    case 'top-left':
      return {
        ...baseStyle,
        top: 8 + offsetY,
        left: 8 + offsetX,
      };
    case 'top-center':
      return {
        ...baseStyle,
        top: 8 + offsetY,
        left: 0,
        right: 0,
        alignItems: 'center',
      };
    case 'top-right':
      return {
        ...baseStyle,
        top: 8 + offsetY,
        right: 8 + offsetX,
      };
    case 'center-left':
      return {
        ...baseStyle,
        top: 0,
        bottom: 0,
        left: 8 + offsetX,
        justifyContent: 'center',
      };
    case 'center':
      return {
        ...baseStyle,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
      };
    case 'center-right':
      return {
        ...baseStyle,
        top: 0,
        bottom: 0,
        right: 8 + offsetX,
        justifyContent: 'center',
      };
    case 'bottom-left':
      return {
        ...baseStyle,
        bottom: 8 + offsetY,
        left: 8 + offsetX,
      };
    case 'bottom-center':
      return {
        ...baseStyle,
        bottom: 8 + offsetY,
        left: 0,
        right: 0,
        alignItems: 'center',
      };
    case 'bottom-right':
      return {
        ...baseStyle,
        bottom: 8 + offsetY,
        right: 8 + offsetX,
      };
    default:
      return {
        ...baseStyle,
        top: 8,
        left: 8,
      };
  }
}

const styles = StyleSheet.create({
  labelContainer: {
    zIndex: 10,
  },
  labelText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DISPLAY_CONFIG } from '@/config/display';
import { DashboardConfig } from '@/types/dashboard-schema';
import { DashboardRenderer } from '@/components/dashboard/DashboardRenderer';
import { SettingsProvider } from '@/contexts/SettingsContext';

type DashboardPreviewProps = {
  config: DashboardConfig;
  isVisible: boolean;
  onToggle: () => void;
  position?: 'right' | 'bottom' | 'floating';
};

export function DashboardPreview({
  config,
  isVisible,
  onToggle,
  position = 'right'
}: DashboardPreviewProps) {
  const [scale, setScale] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  // Calculate scale to fit preview
  useEffect(() => {
    if (position === 'right') {
      // For right panel, show at 100% actual size
      setScale(1.0); // 800x480 (actual Pi display size)
    } else if (position === 'bottom') {
      setScale(0.6); // 480x288
    } else {
      setScale(0.8); // Floating preview
    }
  }, [position]);

  // Refresh preview when config changes
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [config]);

  if (!isVisible) return null;

  const containerStyle = position === 'floating'
    ? styles.floatingContainer
    : position === 'right'
    ? styles.rightContainer
    : styles.bottomContainer;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Dashboard Preview</Text>
          <View style={styles.resolutionBadge}>
            <Text style={styles.resolutionText}>
              {DISPLAY_CONFIG.width}×{DISPLAY_CONFIG.height}
            </Text>
          </View>
          <View style={styles.scaleBadge}>
            <Text style={styles.scaleText}>{Math.round(scale * 100)}%</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => setRefreshKey(prev => prev + 1)}
          >
            <Text style={styles.refreshButtonText}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onToggle}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Preview Area */}
      <View style={styles.previewContainer}>
        <View
          style={[
            styles.previewWrapper,
            {
              width: DISPLAY_CONFIG.width,
              height: DISPLAY_CONFIG.height,
              transform: [{ scale }],
            }
          ]}
        >
          <SettingsProvider>
            <DashboardRenderer
              key={refreshKey}
              config={config}
              onError={(error) => console.error('Preview error:', error)}
            />
          </SettingsProvider>
        </View>

        {/* Dimension Labels */}
        <View style={styles.dimensions}>
          <View style={styles.dimensionLabel}>
            <Text style={styles.dimensionText}>{DISPLAY_CONFIG.width}px</Text>
          </View>
          <View style={[styles.dimensionLabel, styles.dimensionLabelVertical]}>
            <Text style={styles.dimensionText}>{DISPLAY_CONFIG.height}px</Text>
          </View>
        </View>
      </View>

      {/* Info Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Live preview - Shows real-time changes as you edit (unsaved)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D1220',
    borderWidth: 1,
    borderColor: '#2A3F5F',
  },
  floatingContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    zIndex: 1000,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  rightContainer: {
    width: 850,
    height: '100%',
    borderLeftWidth: 2,
    borderLeftColor: '#2A3F5F',
  },
  bottomContainer: {
    width: '100%',
    height: 350,
    borderTopWidth: 2,
    borderTopColor: '#2A3F5F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3F5F',
    backgroundColor: '#131829',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00D9FF',
  },
  resolutionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#1A2338',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2A3F5F',
  },
  resolutionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B794F6',
    fontFamily: 'monospace',
  },
  scaleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#1A2338',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2A3F5F',
  },
  scaleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00FFA3',
  },
  refreshButton: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#1A2338',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3F5F',
  },
  refreshButtonText: {
    fontSize: 16,
    color: '#00D9FF',
    fontWeight: 'bold',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#1A2338',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3F5F',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#8BA3CC',
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0A0E1A',
    position: 'relative',
  },
  previewWrapper: {
    borderWidth: 2,
    borderColor: '#00D9FF',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#0A0A0A',
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  fallbackText: {
    color: '#8BA3CC',
    fontSize: 14,
    textAlign: 'center',
  },
  dimensions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  dimensionLabel: {
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: 'rgba(0, 217, 255, 0.9)',
    borderRadius: 3,
  },
  dimensionLabelVertical: {
    transform: [{ rotate: '-90deg' }],
  },
  dimensionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0A0E1A',
    fontFamily: 'monospace',
  },
  footer: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#2A3F5F',
    backgroundColor: '#131829',
  },
  footerText: {
    fontSize: 11,
    color: '#5A6B8C',
    textAlign: 'center',
  },
});

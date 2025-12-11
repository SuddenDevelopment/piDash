/**
 * SettingsModal - Settings modal with 90% size overlay
 */

import React from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
  autoTransitionInterval?: number;
  onRefresh?: () => void;
};

export function SettingsModal({ visible, onClose, autoTransitionInterval, onRefresh }: SettingsModalProps) {
  const { settings, toggleAutoTransition, toggleConfigMode } = useSettings();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Settings Content */}
          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            {/* Auto-Transition Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Auto-Transition Pages</Text>
                <Text style={styles.settingDescription}>
                  Automatically cycle through pages
                  {autoTransitionInterval
                    ? ` every ${autoTransitionInterval / 1000}s`
                    : ''}
                </Text>
              </View>
              <Switch
                value={settings.autoTransitionEnabled}
                onValueChange={toggleAutoTransition}
                trackColor={{ false: '#3A3A3A', true: '#3B82F6' }}
                thumbColor={settings.autoTransitionEnabled ? '#FFFFFF' : '#A0A0A0'}
                ios_backgroundColor="#3A3A3A"
              />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Config Mode Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Configuration Mode</Text>
                <Text style={styles.settingDescription}>
                  {settings.useDemoConfig
                    ? 'Using demo configuration'
                    : 'Using custom configuration'}
                </Text>
              </View>
              <Switch
                value={settings.useDemoConfig}
                onValueChange={toggleConfigMode}
                trackColor={{ false: '#3A3A3A', true: '#3B82F6' }}
                thumbColor={settings.useDemoConfig ? '#FFFFFF' : '#A0A0A0'}
                ios_backgroundColor="#3A3A3A"
              />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Refresh Configuration Button */}
            {onRefresh && (
              <>
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={() => {
                    onRefresh();
                    onClose();
                  }}
                >
                  <Text style={styles.refreshButtonText}>↻ Refresh Configuration</Text>
                  <Text style={styles.refreshButtonSubtext}>
                    Reload dashboard with latest config
                  </Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider} />
              </>
            )}

            {/* Info Section */}
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>About</Text>
              <Text style={styles.infoText}>PiDash MVP - JSON Dashboard System</Text>
              <Text style={styles.infoText}>Version 1.0.0</Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.doneButton}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const MODAL_WIDTH = SCREEN_WIDTH * 0.9;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.9;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: MODAL_WIDTH,
    height: MODAL_HEIGHT,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#A0A0A0',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#A0A0A0',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginVertical: 16,
  },
  refreshButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#1A2338',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 4,
  },
  refreshButtonSubtext: {
    fontSize: 12,
    color: '#8BA3CC',
  },
  infoSection: {
    marginTop: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#707070',
    marginBottom: 6,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  doneButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

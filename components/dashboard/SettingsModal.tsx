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
} from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
  autoTransitionInterval?: number;
};

export function SettingsModal({ visible, onClose, autoTransitionInterval }: SettingsModalProps) {
  const { settings, toggleAutoTransition } = useSettings();

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
          <View style={styles.content}>
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

            {/* Configuration Builder Button */}
            <TouchableOpacity
              style={styles.configButton}
              onPress={() => {
                onClose();
                router.push('/settings');
              }}
            >
              <View style={styles.configButtonContent}>
                <Text style={styles.configButtonIcon}>⚙️</Text>
                <View style={styles.configButtonText}>
                  <Text style={styles.configButtonTitle}>Configuration Builder</Text>
                  <Text style={styles.configButtonDescription}>
                    Edit dashboard JSON and CSS theme
                  </Text>
                </View>
                <Text style={styles.configButtonArrow}>→</Text>
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Info Section */}
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>About</Text>
              <Text style={styles.infoText}>PiDash MVP - JSON Dashboard System</Text>
              <Text style={styles.infoText}>Version 1.0.0</Text>
            </View>
          </View>

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
  configButton: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  configButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  configButtonIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  configButtonText: {
    flex: 1,
  },
  configButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  configButtonDescription: {
    fontSize: 13,
    color: '#A0A0A0',
  },
  configButtonArrow: {
    fontSize: 24,
    color: '#3B82F6',
    marginLeft: 12,
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

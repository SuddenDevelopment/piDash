/**
 * NotificationOverlay Component
 *
 * Custom notification overlay for displaying real-time event notifications
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface NotificationOverlayProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

function NotificationItem({ notification, onDismiss }: {
  notification: Notification;
  onDismiss: (id: string) => void;
}) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after duration
    const duration = notification.duration || 3000;
    const timeout = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timeout);
  }, []);

  const handleDismiss = () => {
    // Exit animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(notification.id);
    });
  };

  const getSeverityStyle = () => {
    switch (notification.severity) {
      case 'success':
        return styles.notificationSuccess;
      case 'warning':
        return styles.notificationWarning;
      case 'error':
        return styles.notificationError;
      case 'info':
      default:
        return styles.notificationInfo;
    }
  };

  const getSeverityIcon = () => {
    switch (notification.severity) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <Animated.View
      style={[
        styles.notification,
        getSeverityStyle(),
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationIcon}>{getSeverityIcon()}</Text>
        <View style={styles.notificationText}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
        </View>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={handleDismiss}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.dismissButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export function NotificationOverlay({ notifications, onDismiss }: NotificationOverlayProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </View>
  );
}

// Notification service hook
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const show = (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification: Notification = {
      ...notification,
      id,
    };

    setNotifications((prev) => [...prev, newNotification]);
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const dismissAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    show,
    dismiss,
    dismissAll,
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'stretch',
  },
  notification: {
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationInfo: {
    backgroundColor: '#3B82F6',
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  notificationSuccess: {
    backgroundColor: '#10B981',
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  notificationWarning: {
    backgroundColor: '#F59E0B',
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
  },
  notificationError: {
    backgroundColor: '#EF4444',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  notificationIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    marginRight: 12,
    fontWeight: 'bold',
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  dismissButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  dismissButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

/**
 * WebSocketContext - Real-time event system provider
 *
 * Manages WebSocket connection and handles real-time events
 */

import React, { createContext, useContext, ReactNode, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useWebSocket } from '@/hooks/useWebSocket';
import { ActionExecutor } from '@/services/ActionExecutor';
import { NotificationOverlay, useNotifications } from '@/components/NotificationOverlay';
import { useSettings } from '@/contexts/SettingsContext';
import { WS_URL } from '@/config/api.config';
import type { DashboardEvent, ActionContext } from '@/types/events';

interface WebSocketContextType {
  connected: boolean;
  connecting: boolean;
  reconnectAttempts: number;
  send: (data: any) => void;
  disconnect: () => void;
  connect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  wsUrl?: string;
  token?: string;
}

export function WebSocketProvider({ children, wsUrl, token }: WebSocketProviderProps) {
  const router = useRouter();
  const settings = useSettings();
  const notifications = useNotifications();
  const [configReloadTrigger, setConfigReloadTrigger] = useState(0);

  // Create action context
  const actionContext: ActionContext = useMemo(() => ({
    navigation: router,
    settings: {
      ...settings,
      updateSettings: (updates: any) => {
        // Convert flat or nested updates to settings format
        Object.keys(updates).forEach((key) => {
          if (key === 'autoTransition' || key === 'autoTransitionEnabled') {
            settings.updateSettings({ autoTransitionEnabled: updates[key] });
          } else {
            settings.updateSettings({ [key]: updates[key] });
          }
        });
      },
      toggleAutoTransition: (enabled?: boolean) => {
        if (enabled !== undefined) {
          settings.updateSettings({ autoTransitionEnabled: enabled });
        } else {
          settings.toggleAutoTransition();
        }
      },
    },
    config: {
      reload: () => {
        console.log('[WebSocket] Triggering config reload');
        setConfigReloadTrigger((prev) => prev + 1);
        // You might want to emit an event or call a global refresh function here
      },
      refreshComponent: (componentId: string) => {
        console.log(`[WebSocket] Refreshing component: ${componentId}`);
        // Implement component-specific refresh logic
      },
      customHandlers: {},
    },
    notificationService: notifications,
  }), [router, settings, notifications, configReloadTrigger]);

  // Create action executor
  const actionExecutor = useMemo(() => {
    return new ActionExecutor(actionContext);
  }, [actionContext]);

  // Handle incoming events
  const handleEvent = useCallback((event: DashboardEvent) => {
    console.log('[WebSocket] Received event:', event.id);
    actionExecutor.processEvent(event);
  }, [actionExecutor]);

  // Connect to WebSocket
  const { connected, connecting, reconnectAttempts, send, disconnect, connect } = useWebSocket({
    url: wsUrl || WS_URL,
    token: token || 'pidash-local-token-12345',
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
    onEvent: handleEvent,
    onConnect: () => {
      console.log('[WebSocket] Connected to server');
      notifications.show({
        title: 'Connected',
        message: 'WebSocket connected',
        severity: 'success',
        duration: 2000,
      });
    },
    onDisconnect: () => {
      console.log('[WebSocket] Disconnected from server');
    },
    onError: (error) => {
      console.error('[WebSocket] Error:', error);
    },
  });

  const contextValue: WebSocketContextType = {
    connected,
    connecting,
    reconnectAttempts,
    send,
    disconnect,
    connect,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
      <NotificationOverlay
        notifications={notifications.notifications}
        onDismiss={notifications.dismiss}
      />
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
}

// Optional: Export a hook to check connection status
export function useWebSocketStatus() {
  const context = useWebSocketContext();
  return {
    connected: context.connected,
    connecting: context.connecting,
    reconnectAttempts: context.reconnectAttempts,
  };
}

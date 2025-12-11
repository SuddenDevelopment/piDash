/**
 * Event System Type Definitions
 *
 * Defines types for real-time events and actions
 */

// ==================== ACTION TYPES ====================

export type NavigateAction = {
  type: 'navigate';
  target: string;
  params?: Record<string, any>;
};

export type NotifyAction = {
  type: 'notify';
  title: string;
  message: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
  duration?: number; // milliseconds, default 3000
};

export type ConfigUpdateAction = {
  type: 'config.update';
  path: string;
  value: any;
  persistent?: boolean; // default false (in-memory only)
};

export type RefreshAction = {
  type: 'refresh';
  target?: 'all' | string; // 'all' or specific component ID
};

export type TransitionControlAction = {
  type: 'transition.pause' | 'transition.resume';
};

export type CustomAction = {
  type: 'custom';
  handler: string;
  params?: Record<string, any>;
};

export type EventAction =
  | NavigateAction
  | NotifyAction
  | ConfigUpdateAction
  | RefreshAction
  | TransitionControlAction
  | CustomAction;

// ==================== EVENT TYPES ====================

export interface DashboardEvent {
  id: string;
  type?: string;
  actions: EventAction[];
  timestamp?: number;
  metadata?: Record<string, any>;
}

// ==================== WEBSOCKET MESSAGE TYPES ====================

export type WebSocketMessageType =
  | 'connection'
  | 'event'
  | 'error'
  | 'ping'
  | 'pong';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  [key: string]: any;
}

export interface ConnectionMessage extends WebSocketMessage {
  type: 'connection';
  status: 'connected' | 'disconnected';
  message: string;
  timestamp: number;
}

export interface EventMessage extends WebSocketMessage {
  type: 'event';
  event: DashboardEvent;
  timestamp: number;
}

export interface ErrorMessage extends WebSocketMessage {
  type: 'error';
  error: string;
  timestamp: number;
}

// ==================== ACTION EXECUTOR CONTEXT ====================

export interface ActionContext {
  navigation: any; // Navigation object from expo-router
  settings: any; // Settings context
  config: any; // Config management
  notificationService: any; // Notification service
}

// ==================== EVENT CONFIGURATION ====================

export interface EventConfig {
  handlers?: DashboardEvent[];
  sources?: {
    websocket?: {
      enabled: boolean;
      url: string;
      token?: string;
      reconnectInterval?: number;
    };
  };
}

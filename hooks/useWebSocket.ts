/**
 * useWebSocket Hook
 *
 * Manages WebSocket connection with auto-reconnect functionality
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type { DashboardEvent, WebSocketMessage } from '@/types/events';

interface UseWebSocketOptions {
  url: string;
  token?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onEvent?: (event: DashboardEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

interface UseWebSocketReturn {
  connected: boolean;
  connecting: boolean;
  ws: WebSocket | null;
  reconnectAttempts: number;
  send: (data: any) => void;
  disconnect: () => void;
  connect: () => void;
}

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    url,
    token = 'pidash-local-token-12345',
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
    onEvent,
    onConnect,
    onDisconnect,
    onError
  } = options;

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const intentionalCloseRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || connecting) {
      return;
    }

    setConnecting(true);
    intentionalCloseRef.current = false;

    try {
      // Add token to query string
      const wsUrl = `${url}?token=${encodeURIComponent(token)}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('[WebSocket] Connected');
        setConnected(true);
        setConnecting(false);
        setReconnectAttempts(0);
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          // Handle different message types
          switch (message.type) {
            case 'event':
              if (message.event && onEvent) {
                onEvent(message.event);
              }
              break;

            case 'connection':
              console.log('[WebSocket] Connection message:', message);
              break;

            case 'pong':
              // Respond to ping if needed
              break;

            case 'error':
              console.error('[WebSocket] Server error:', message.error);
              break;

            default:
              console.log('[WebSocket] Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        setConnecting(false);
        onError?.(error);
      };

      ws.onclose = () => {
        console.log('[WebSocket] Disconnected');
        setConnected(false);
        setConnecting(false);
        wsRef.current = null;
        onDisconnect?.();

        // Auto-reconnect unless intentionally closed
        if (!intentionalCloseRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const nextAttempt = reconnectAttemptsRef.current + 1;
          reconnectAttemptsRef.current = nextAttempt;
          setReconnectAttempts(nextAttempt);

          // Exponential backoff: 3s, 6s, 12s, 24s, 48s, etc (capped at 60s)
          const backoffDelay = Math.min(reconnectInterval * Math.pow(2, nextAttempt - 1), 60000);

          console.log(
            `[WebSocket] Reconnecting in ${backoffDelay}ms (attempt ${nextAttempt}/${maxReconnectAttempts})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, backoffDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.error('[WebSocket] Max reconnect attempts reached. Please check if the server is running.');
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      setConnecting(false);
    }
  }, [url, token, reconnectInterval, maxReconnectAttempts, connecting, onEvent, onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    intentionalCloseRef.current = true;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setConnected(false);
    setConnecting(false);
    setReconnectAttempts(0);
    reconnectAttemptsRef.current = 0;
  }, []);

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      wsRef.current.send(message);
    } else {
      console.warn('[WebSocket] Cannot send message - not connected');
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return {
    connected,
    connecting,
    ws: wsRef.current,
    reconnectAttempts,
    send,
    disconnect,
    connect
  };
}

/**
 * WebSocket Server for PiDash Real-Time Events
 *
 * Provides WebSocket connections for real-time event broadcasting
 * - Heartbeat/ping-pong to detect dead connections
 * - Token authentication for security
 * - Broadcast events to all connected clients
 */

const WebSocket = require('ws');
const http = require('http');

// Authentication token (in production, load from env or config)
const VALID_TOKEN = process.env.PIDASH_WS_TOKEN || 'pidash-local-token-12345';

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({
      server,
      path: '/ws',
      maxPayload: 10 * 1024, // 10KB limit
      clientTracking: true
    });

    this.setupConnectionHandler();
    this.setupHeartbeat();

    console.log('WebSocket server initialized on path /ws');
  }

  setupConnectionHandler() {
    this.wss.on('connection', (ws, req) => {
      // Extract token from query params
      const url = new URL(req.url, 'ws://localhost');
      const token = url.searchParams.get('token');

      // Authenticate connection
      if (token !== VALID_TOKEN) {
        console.log('❌ Unauthorized WebSocket connection attempt');
        ws.close(4001, 'Unauthorized');
        return;
      }

      const clientIP = req.socket.remoteAddress;
      console.log(`✅ WebSocket client connected: ${clientIP}`);

      // Mark connection as alive
      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connection',
        status: 'connected',
        message: 'Connected to PiDash WebSocket server',
        timestamp: Date.now()
      }));

      // Handle incoming messages from client
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(ws, message);
        } catch (error) {
          console.error('Invalid message from client:', error);
          ws.send(JSON.stringify({
            type: 'error',
            error: 'Invalid message format',
            timestamp: Date.now()
          }));
        }
      });

      ws.on('close', () => {
        console.log(`🔌 WebSocket client disconnected: ${clientIP}`);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  setupHeartbeat() {
    // Ping clients every 30 seconds to detect dead connections
    const interval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
          console.log('Terminating dead connection');
          return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);

    this.wss.on('close', () => {
      clearInterval(interval);
    });
  }

  handleClientMessage(ws, message) {
    console.log('Received message from client:', message.type);

    // Echo back for testing
    if (message.type === 'ping') {
      ws.send(JSON.stringify({
        type: 'pong',
        timestamp: Date.now()
      }));
    }
  }

  /**
   * Broadcast event to all connected clients
   * @param {Object} event - Event object to broadcast
   */
  broadcast(event) {
    const message = JSON.stringify({
      type: 'event',
      event,
      timestamp: Date.now()
    });

    let sentCount = 0;
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        sentCount++;
      }
    });

    console.log(`📡 Broadcast event "${event.id}" to ${sentCount} client(s)`);
    return sentCount;
  }

  /**
   * Send event to a specific client
   * @param {WebSocket} ws - WebSocket connection
   * @param {Object} event - Event object to send
   */
  sendToClient(ws, event) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'event',
        event,
        timestamp: Date.now()
      }));
    }
  }

  /**
   * Get count of connected clients
   */
  getClientCount() {
    return this.wss.clients.size;
  }

  /**
   * Get server status
   */
  getStatus() {
    return {
      connected: true,
      clients: this.getClientCount(),
      path: '/ws'
    };
  }
}

module.exports = WebSocketServer;

# PiDash Real-Time Event System

A WebSocket-based real-time event system that allows external systems to control the dashboard through JSON-configurable events.

## 🎯 Features

- **WebSocket Server**: Runs on Pi alongside REST API
- **Token Authentication**: Simple token-based security
- **Auto-Reconnect**: Client automatically reconnects if connection drops
- **Custom Notifications**: Beautiful overlay notifications with severity levels
- **Command Pattern**: Extensible action execution system
- **JSON-Configurable**: All events and actions defined in JSON

## 🏗️ Architecture

```
[External System/Sensor]
    ↓ HTTP POST
[Pi REST API: /api/events/trigger]
    ↓ Broadcast
[WebSocket Server (ws://pi:3001/ws)]
    ↓
[Dashboard Clients]
    ↓
[ActionExecutor]
    ↓
[Navigate | Notify | Update Config | Refresh]
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

The WebSocket library (`ws`) is already added to package.json.

### 2. Start the Server

```bash
npm run api
```

The server will start with both HTTP and WebSocket endpoints:
- HTTP API: `http://localhost:3001`
- WebSocket: `ws://localhost:3001/ws`

### 3. Start the Dashboard

```bash
npm run start:network
```

The dashboard will automatically connect to the WebSocket server.

### 4. Trigger Events

Use curl to trigger events:

```bash
# Show a notification
curl -X POST http://localhost:3001/api/events/trigger \
  -H 'Content-Type: application/json' \
  -d '{
    "id": "test-notification",
    "actions": [
      {
        "type": "notify",
        "title": "Hello!",
        "message": "Event system is working!",
        "severity": "success"
      }
    ]
  }'
```

## 📋 Action Types

### Navigate
Navigate to a different page.

```json
{
  "type": "navigate",
  "target": "/",
  "params": { "optional": "params" }
}
```

### Notify
Show a notification overlay.

```json
{
  "type": "notify",
  "title": "Title",
  "message": "Message text",
  "severity": "info|success|warning|error",
  "duration": 3000
}
```

### Config Update
Update configuration (in-memory only by default).

```json
{
  "type": "config.update",
  "path": "autoTransitionEnabled",
  "value": false,
  "persistent": false
}
```

### Refresh
Trigger a dashboard or component refresh.

```json
{
  "type": "refresh",
  "target": "all"
}
```

### Transition Control
Pause or resume automatic page transitions.

```json
{
  "type": "transition.pause"
}
```

```json
{
  "type": "transition.resume"
}
```

### Custom
Execute a custom handler.

```json
{
  "type": "custom",
  "handler": "myCustomHandler",
  "params": { "key": "value" }
}
```

## 📚 Example Events

See [`config/events-examples.json`](./config/events-examples.json) for a complete list of example events with curl commands.

### Common Examples

#### Show Success Notification
```bash
curl -X POST http://localhost:3001/api/events/trigger \
  -H 'Content-Type: application/json' \
  -d '{"id":"success","actions":[{"type":"notify","title":"Success!","message":"Operation completed","severity":"success"}]}'
```

#### Pause Transitions
```bash
curl -X POST http://localhost:3001/api/events/trigger \
  -H 'Content-Type: application/json' \
  -d '{"id":"pause","actions":[{"type":"transition.pause"},{"type":"notify","title":"Paused","message":"Transitions paused","severity":"info"}]}'
```

#### Critical Alert
```bash
curl -X POST http://localhost:3001/api/events/trigger \
  -H 'Content-Type: application/json' \
  -d '{"id":"alert","actions":[{"type":"notify","title":"CRITICAL","message":"System temperature high!","severity":"error","duration":10000},{"type":"transition.pause"}]}'
```

## 🔧 Configuration

### WebSocket URL

By default, the client connects to `ws://192.168.1.100:3001/ws`. To change this:

**Option 1**: Set environment variable (not yet implemented)

**Option 2**: Modify `contexts/WebSocketContext.tsx`:

```typescript
const getWebSocketUrl = () => {
  return 'ws://YOUR_PI_IP:3001/ws';
};
```

### Authentication Token

Default token: `pidash-local-token-12345`

To change:

**Server Side**: Set environment variable or modify `server/websocket-server.js`:

```javascript
const VALID_TOKEN = process.env.PIDASH_WS_TOKEN || 'your-secure-token';
```

**Client Side**: Modify `contexts/WebSocketContext.tsx`:

```typescript
<WebSocketProvider token="your-secure-token">
```

## 🧪 Testing

### Check WebSocket Status

```bash
curl http://localhost:3001/api/events/status
```

Response:
```json
{
  "success": true,
  "websocket": {
    "connected": true,
    "clients": 1,
    "path": "/ws"
  }
}
```

### Test with wscat

Install wscat globally:
```bash
npm install -g wscat
```

Connect to WebSocket:
```bash
wscat -c "ws://localhost:3001/ws?token=pidash-local-token-12345"
```

### Monitor Logs

**Server logs**: Watch the terminal running `npm run api`
- Connection events
- Event broadcasts
- Client count

**Client logs**: Open browser console
- `[WebSocket] Connected`
- `[ActionExecutor] Executing action: notify`
- Event processing

## 🔐 Security

### Current Implementation
- Token-based authentication via query string
- Basic event validation
- Local network only (no encryption)

### Recommended for Production
1. Use WSS (WebSocket Secure) with TLS certificates
2. Store tokens in environment variables
3. Implement rate limiting (included in server)
4. Add IP whitelisting if needed
5. Use stronger authentication (JWT tokens)

## 📁 File Structure

```
piDash/
├── server/
│   ├── config-api.js           # REST API + WebSocket integration
│   └── websocket-server.js     # WebSocket server implementation
├── contexts/
│   └── WebSocketContext.tsx    # React context provider
├── hooks/
│   └── useWebSocket.ts          # WebSocket hook with auto-reconnect
├── services/
│   └── ActionExecutor.ts        # Command pattern implementation
├── components/
│   └── NotificationOverlay.tsx  # Custom notification UI
├── types/
│   └── events.ts                # TypeScript type definitions
└── config/
    └── events-examples.json     # Example events and curl commands
```

## 🐛 Troubleshooting

### Dashboard not connecting to WebSocket

1. Check server is running: `curl http://localhost:3001/api/status`
2. Check WebSocket endpoint: `curl http://localhost:3001/api/events/status`
3. Verify token matches between client and server
4. Check browser console for connection errors
5. Ensure firewall allows port 3001

### Events not triggering actions

1. Check event format in server logs
2. Verify action type is supported
3. Check ActionExecutor logs in browser console
4. Ensure contexts (navigation, settings) are available

### Connection keeps disconnecting

1. Check for network issues
2. Verify Pi is accessible from client device
3. Check for firewall/router issues
4. Review heartbeat/ping-pong logs

## 🔮 Future Enhancements

- [ ] Persistent event handlers in dashboard config
- [ ] Event queue with retry logic
- [ ] Bi-directional communication (client → server events)
- [ ] MQTT integration for IoT sensors
- [ ] Webhook support
- [ ] Event history and replay
- [ ] Custom event filters and rules
- [ ] Scheduled events (cron-like)

## 📖 API Reference

### POST /api/events/trigger

Broadcast an event to all connected WebSocket clients.

**Request Body:**
```json
{
  "id": "event-id",
  "type": "event.type.optional",
  "actions": [
    { "type": "action-type", ...action-specific-fields }
  ],
  "metadata": { "optional": "metadata" }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event broadcast successfully",
  "event": {
    "id": "event-id",
    "actionsCount": 1
  },
  "clientsNotified": 1,
  "timestamp": "2025-01-06T..."
}
```

### GET /api/events/status

Get WebSocket server status.

**Response:**
```json
{
  "success": true,
  "websocket": {
    "connected": true,
    "clients": 1,
    "path": "/ws"
  },
  "timestamp": "2025-01-06T..."
}
```

## 🎓 Examples Use Cases

### Home Automation
- Motion sensor triggers dashboard page change
- Temperature alert shows critical notification
- Door sensor pauses dashboard transitions

### IoT Monitoring
- CPU threshold alert navigates to system monitor
- Disk space low notification
- Service down error notification

### External Control
- MQTT messages control dashboard
- REST API from external service
- Scheduled cron jobs trigger events

### Smart Displays
- Meeting room booking system updates display
- Digital signage content control
- Information kiosk remote updates

## 📝 License

Part of PiDash project.

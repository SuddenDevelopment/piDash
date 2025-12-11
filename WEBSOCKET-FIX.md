# WebSocket Connection Fix

## Issues Fixed

### 1. Infinite Reconnection Loop
**Problem:** WebSocket was failing to connect and retrying infinitely without proper backoff.

**Root Cause:** The `reconnectAttempts` state was in the `connect` callback's dependency array, causing stale closures. When the timeout fired to reconnect, it was calling an old version of `connect()` with outdated retry counts.

**Solution:**
- Added `reconnectAttemptsRef` ref to track retry count without causing dependency issues
- Implemented exponential backoff: 3s → 6s → 12s → 24s → 48s → 60s (capped)
- Removed `reconnectAttempts` from the `connect` callback dependencies
- Added clearer error messages when max retries reached

**Files Modified:**
- `hooks/useWebSocket.ts`

### 2. Hardcoded Server IP Address
**Problem:** Server URLs were hardcoded to `localhost:3001` or specific IPs in multiple places, making it difficult to connect to different servers.

**Solution:**
- Created centralized API configuration: `config/api.config.ts`
- URLs now derive from a single source with localStorage support
- Easy to switch between localhost and Pi server

**Files Modified:**
- `config/api.config.ts` (new)
- `app/index.tsx`
- `app/settings.tsx`
- `contexts/WebSocketContext.tsx`

## How to Configure Server Host

### Method 1: Browser Console (Temporary for Development)
```javascript
// In your browser console:
localStorage.setItem('pidash_server_host', '192.168.1.166');
location.reload();

// To switch back to localhost:
localStorage.removeItem('pidash_server_host');
location.reload();
```

### Method 2: Edit Config File (Permanent)
Edit `config/api.config.ts` and change the default in `getServerHost()`:

```typescript
const getServerHost = (): string => {
  // Set your Pi's IP here for development
  return '192.168.1.166';  // Change this to your Pi's IP

  // Or keep the localStorage logic for flexibility
};
```

## Testing the Fix

1. **Clear the infinite loop:**
   - Refresh your browser
   - WebSocket will attempt to connect with exponential backoff
   - After 10 failed attempts, it will stop trying and show a message

2. **Check if server is running:**
   ```bash
   # Check if WebSocket server is running on Pi
   ssh pi@192.168.1.166
   pm2 status pidash

   # Or check manually
   curl http://192.168.1.166:3001/api/config
   ```

3. **Verify connection:**
   - Open browser console
   - Look for: `[WebSocket] Connected to server`
   - You should see a success notification in the UI

## Current Behavior

- **Max Retries:** 10 attempts
- **Backoff:** Exponential (3s, 6s, 12s, 24s, 48s, 60s...)
- **Timeout per attempt:** None (WebSocket default)
- **Error message after max retries:** "Max reconnect attempts reached. Please check if the server is running."

## Troubleshooting

1. **Still seeing infinite loop:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear cache and reload

2. **Cannot connect to Pi:**
   - Verify Pi's IP: `ifconfig` or `hostname -I` on Pi
   - Check firewall: `sudo ufw status`
   - Verify server is running: `pm2 logs pidash`

3. **Connection works on localhost but not from another device:**
   - Use `localStorage.setItem('pidash_server_host', 'YOUR_PI_IP')`
   - Make sure both devices are on same network

# Auto-Refresh on Deployment

## Overview

The dashboard automatically refreshes when you deploy new code to the Raspberry Pi. This eliminates the need to manually refresh the browser or send keyboard commands.

## How It Works

### Version Polling System

1. **API Server** tracks a deployment version number
2. **Dashboard** polls the version every 3 seconds
3. **Deploy Script** bumps the version after deployment
4. **Dashboard** detects version change and auto-refreshes

### Flow Diagram

```
┌─────────────┐
│   Deploy    │
│   Script    │
└──────┬──────┘
       │ 1. Build & sync files
       │ 2. Restart service
       │ 3. Bump version
       ▼
┌─────────────┐
│ API Server  │
│ (Port 3001) │
└──────┬──────┘
       │ version: 1234567890
       │
       ▼
┌─────────────┐      Poll every 3s
│  Dashboard  │◄──────────────────┐
│  (Browser)  │                   │
└──────┬──────┘                   │
       │ Detect version change    │
       │ → window.location.reload()
       └──────────────────────────┘
```

## Implementation

### API Server (`server/config-api.js`)

**New Endpoints:**

```
GET  /api/version       - Get current deployment version
POST /api/version/bump  - Bump version (trigger refresh)
```

**Version Storage:**
- Stored in `.deployment-version` file
- Persists across server restarts
- Timestamp-based (milliseconds since epoch)

### Dashboard (`app/index.tsx`)

**Auto-Refresh Logic:**

```typescript
// Load initial version on mount
useEffect(() => {
  loadInitialVersion();
}, []);

// Poll for version changes every 3 seconds
useEffect(() => {
  const interval = setInterval(() => {
    checkForNewVersion();
  }, 3000);
  return () => clearInterval(interval);
}, [deploymentVersion]);

// Reload page if version changed
const checkForNewVersion = async () => {
  const response = await fetch(`${API_BASE_URL}/api/version`);
  const data = await response.json();

  if (data.version !== deploymentVersion) {
    console.log('New deployment detected! Refreshing...');
    window.location.reload();
  }
};
```

### Deploy Script (`scripts/deploy-to-pi.sh`)

**Added Step:**

```bash
# Trigger browser refresh by bumping deployment version
echo "📱 Triggering browser refresh..."
ssh "$PI_USER@$PI_HOST" \
  "curl -X POST http://localhost:3001/api/version/bump -s"
```

## Usage

### Normal Deployment

```bash
npm run deploy:pi
```

**What Happens:**

1. ✅ Builds production bundle
2. ✅ Syncs files to Pi
3. ✅ Restarts service
4. ✅ Bumps deployment version
5. ✅ Browser auto-refreshes (within 3 seconds)

### Manual Version Bump

If you need to trigger a refresh without deploying:

```bash
# On Pi or via SSH
curl -X POST http://localhost:3001/api/version/bump
```

### Check Current Version

```bash
# Get version number
curl http://localhost:3001/api/version
```

**Response:**
```json
{
  "success": true,
  "version": 1730678945123,
  "timestamp": "2025-11-04T01:15:45.123Z"
}
```

## Configuration

### Polling Interval

Default: **3 seconds**

To change, edit `app/index.tsx`:

```typescript
const interval = setInterval(() => {
  checkForNewVersion();
}, 3000); // Change this value (milliseconds)
```

**Recommendations:**
- 3000ms (3s) - Good balance (default)
- 5000ms (5s) - Less network traffic
- 1000ms (1s) - Faster response, more traffic

### Version File Location

```
.deployment-version
```

This file is:
- ✅ Created automatically
- ✅ Persists across restarts
- ✅ Contains timestamp as version
- ✅ Gitignored (local state)

## Benefits

### Before (Manual Refresh)

```
1. Deploy to Pi
2. Wait for deploy to finish
3. SSH into Pi
4. Run: DISPLAY=:0 xdotool key F5
5. Or manually press F5 on Pi
6. Hope browser refreshed
```

**Time:** ~30-60 seconds
**Reliability:** Depends on xdotool/manual action

### After (Auto-Refresh)

```
1. Deploy to Pi
2. Wait 3 seconds
3. Done!
```

**Time:** ~3 seconds
**Reliability:** 100% automatic

## Troubleshooting

### Browser Not Refreshing

**Problem:** Dashboard doesn't refresh after deployment

**Solutions:**

1. **Check API Server Running:**
   ```bash
   curl http://localhost:3001/api/version
   ```
   Should return version JSON

2. **Check Browser Console:**
   Open DevTools and look for:
   ```
   Initial deployment version: 1234567890
   New deployment detected! Refreshing...
   ```

3. **Manual Version Bump:**
   ```bash
   curl -X POST http://localhost:3001/api/version/bump
   ```

4. **Check Polling:**
   Look for network requests to `/api/version` every 3 seconds

### Version Not Bumping

**Problem:** Deploy script doesn't bump version

**Solutions:**

1. **Check SSH Access:**
   ```bash
   ssh pi@raspberrypi.local "echo 'SSH works'"
   ```

2. **Check API Accessibility:**
   ```bash
   ssh pi@raspberrypi.local "curl http://localhost:3001/api/version"
   ```

3. **Manual Bump:**
   ```bash
   ssh pi@raspberrypi.local \
     "curl -X POST http://localhost:3001/api/version/bump"
   ```

### Version File Issues

**Problem:** Version resets or doesn't persist

**Solutions:**

1. **Check File Permissions:**
   ```bash
   ls -la .deployment-version
   ```

2. **Recreate File:**
   ```bash
   rm .deployment-version
   curl -X POST http://localhost:3001/api/version/bump
   ```

3. **Check Server Logs:**
   Look for version loading/saving errors

## Advanced Usage

### Disable Auto-Refresh

If you want to disable auto-refresh temporarily:

**Option 1: Comment out polling**

Edit `app/index.tsx`:
```typescript
// useEffect(() => {
//   const interval = setInterval(() => {
//     checkForNewVersion();
//   }, 3000);
//   return () => clearInterval(interval);
// }, [deploymentVersion]);
```

**Option 2: Increase interval**

Set to a very long interval:
```typescript
const interval = setInterval(() => {
  checkForNewVersion();
}, 3600000); // 1 hour
```

### Multiple Dashboard Instances

If running multiple dashboards:
- Each tracks version independently
- All refresh when version bumps
- Perfect for testing multiple Pi devices

### Development vs Production

**Development:**
- Version polling works locally
- Useful for testing auto-refresh
- Can manually bump version

**Production:**
- Deploy script handles versioning
- Automatic and reliable
- No manual intervention needed

## Technical Details

### Version Format

**Timestamp (milliseconds):**
```
1730678945123
```

Why timestamp?
- Always unique
- Always increasing
- No collision risk
- Easy to debug (convert to date)

### Network Traffic

**Per Dashboard:**
- 1 request every 3 seconds
- ~20 requests per minute
- ~1,200 requests per hour
- Minimal data (< 100 bytes per request)

**Total Impact:** Negligible

### Browser Compatibility

**Supported:**
- ✅ Chrome/Chromium (Pi browser)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ All modern browsers

**Method:**
```javascript
window.location.reload()
```

Standard API, works everywhere.

## Best Practices

### 1. Let It Work Automatically
- Don't manually refresh after deploy
- Wait 3 seconds for auto-refresh
- Trust the system

### 2. Watch Deploy Output
```
📱 Triggering browser refresh...
✅ Deployment complete!
📱 Browser will auto-refresh within 3 seconds
```

### 3. Check Console on Issues
- Browser DevTools → Console
- Look for version messages
- Verify polling is working

### 4. Keep API Server Running
- Auto-refresh requires API server
- Start with: `npm run api`
- Or use systemd service

## Comparison: Alternatives

### xdotool Method
```bash
ssh pi@raspberrypi "DISPLAY=:0 xdotool key F5"
```

**Pros:**
- Direct keyboard simulation
- Works if API is down

**Cons:**
- Requires xdotool installed
- Needs DISPLAY environment
- Can fail if window not focused
- Timing issues

### Auto-Refresh (Current)
```bash
# Happens automatically via version bump
```

**Pros:**
- ✅ Automatic and reliable
- ✅ Works regardless of focus
- ✅ Clean implementation
- ✅ No extra dependencies

**Cons:**
- Requires API server running
- 3-second delay

## Summary

**Auto-refresh on deployment:**
- ✅ Implemented via version polling
- ✅ Automatic browser refresh
- ✅ 3-second refresh time
- ✅ Zero manual intervention
- ✅ Works with standard deploy script
- ✅ Reliable and maintainable

Deploy with confidence knowing the browser will automatically refresh!

## Quick Reference

```bash
# Deploy (auto-refresh included)
npm run deploy:pi

# Manual version bump
curl -X POST http://localhost:3001/api/version/bump

# Check version
curl http://localhost:3001/api/version

# Test locally
curl -X POST http://localhost:3001/api/version/bump
# Watch browser refresh within 3 seconds
```

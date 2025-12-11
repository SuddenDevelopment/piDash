# Raspberry Pi Setup Guide

This guide explains how to set up piDashboard on your Raspberry Pi so it uses your custom configuration from the builder.

## The Problem

piDashboard requires **two services** to load custom configurations:
1. **Web Server** (port 3000) - serves the dashboard HTML/JS/CSS
2. **API Server** (port 3001) - serves configuration files and handles saves

Without the API server running, the dashboard falls back to the embedded default configuration.

## Quick Setup (Automated)

### Step 1: Install the systemd service

From your development machine, run:

```bash
./scripts/setup-service.sh
```

This will:
- Copy the systemd service file to your Pi
- Enable the service to start on boot
- Start the service immediately

### Step 2: Deploy your dashboard

```bash
npm run deploy:pi
```

This will:
- Build the production bundle
- Sync all files to your Pi (including your custom config)
- Restart the services
- **Reboot the Pi** to ensure everything loads fresh

**For faster iteration during development** (no reboot):
```bash
npm run deploy:pi:fast
```
This restarts the service but doesn't reboot. You'll need to manually refresh your browser.

### Step 3: Access your dashboard

Open: `http://raspberrypi.local:3000`

Your custom configuration should now be loaded!

## Manual Setup

If you prefer to set up manually:

### 1. SSH into your Pi

```bash
ssh pi@raspberrypi.local
```

### 2. Install Node.js (if not already installed)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Navigate to piDash directory

```bash
cd /home/pi/piDash
```

### 4. Start the services manually

```bash
./scripts/start-pidash.sh
```

## Verifying It Works

### Check if API server is running

```bash
curl http://localhost:3001/api/status
```

Should return:
```json
{
  "success": true,
  "status": "running",
  "version": "1.0.0"
}
```

### Check which config is loaded

```bash
curl http://localhost:3001/api/config | grep -o '"source":"[^"]*"'
```

Should show:
- `"source":"custom"` ✅ (using your saved config)
- `"source":"default"` ❌ (using default - API not finding custom config)

### Check browser console

1. Open dashboard: `http://raspberrypi.local:3000`
2. Press F12 to open developer tools
3. Look for console message:
   - ✅ "Dashboard loaded from custom config"
   - ❌ "Dashboard loaded from default config"
   - ❌ "API not available, using default config"

## Managing the Service

### Start the service

```bash
sudo systemctl start pidash
```

### Stop the service

```bash
sudo systemctl stop pidash
```

### Restart the service

```bash
sudo systemctl restart pidash
```

### Check service status

```bash
sudo systemctl status pidash
```

### View logs

```bash
sudo journalctl -u pidash -f
```

Or check the temporary logs:
```bash
tail -f /tmp/pidash-api.log
tail -f /tmp/pidash-web.log
```

## Troubleshooting

### Dashboard shows default config instead of custom

**Check if API is running:**
```bash
curl http://localhost:3001/api/config
```

**If connection refused:**
- API server is not running
- Run: `sudo systemctl status pidash`
- Check logs: `sudo journalctl -u pidash -n 50`

**If API returns "source":"default":**
- Custom config file doesn't exist
- Check: `ls -la /home/pi/piDash/config/dashboards/custom-dashboard.json`
- Redeploy: `npm run deploy:pi` from your dev machine

### Service won't start

**Check logs:**
```bash
sudo journalctl -u pidash -n 50
```

**Common issues:**
- Node.js not installed: `node --version`
- Script not executable: `chmod +x /home/pi/piDash/scripts/*.sh`
- Port already in use: `sudo lsof -i :3001` and `sudo lsof -i :3000`

### Changes not appearing after deploy

**Full deploy with reboot (recommended):**
```bash
npm run deploy:pi
```
The Pi will reboot and come back online in 30-60 seconds with your changes.

**Fast deploy without reboot:**
```bash
npm run deploy:pi:fast
```
Then manually refresh your browser with Ctrl+Shift+R.

**Check deployment version:**
```bash
curl http://localhost:3001/api/version
```

### Browser cache issues

The dashboard uses cache-busting and polls for updates every 3 seconds, but if you still have issues:

1. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. Clear browser cache
3. Restart the service: `sudo systemctl restart pidash`

## Configuration Flow

```
┌─────────────────────────────────────────┐
│ 1. Edit config in builder on dev       │
│    machine (Settings page)              │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│ 2. Click "Save Config"                  │
│    Saves to config/dashboards/          │
│    custom-dashboard.json                │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│ 3. Deploy to Pi                         │
│    npm run deploy:pi                    │
│    Syncs custom-dashboard.json to Pi    │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│ 4. API server on Pi (port 3001)         │
│    Reads custom-dashboard.json          │
│    Serves via /api/config endpoint      │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│ 5. Dashboard loads (port 3000)          │
│    Fetches from API                     │
│    Displays your custom config          │
└─────────────────────────────────────────┘
```

## File Locations

| File | Location on Pi |
|------|----------------|
| Custom config | `/home/pi/piDash/config/dashboards/custom-dashboard.json` |
| Default config | `/home/pi/piDash/config/dashboards/mvp-test.json` |
| API server | `/home/pi/piDash/server/config-api.js` |
| Start script | `/home/pi/piDash/scripts/start-pidash.sh` |
| Stop script | `/home/pi/piDash/scripts/stop-pidash.sh` |
| Service file | `/etc/systemd/system/pidash.service` |
| API logs | `/tmp/pidash-api.log` |
| Web logs | `/tmp/pidash-web.log` |

## Auto-start on Boot

The systemd service is configured to start automatically on boot. To verify:

```bash
sudo systemctl is-enabled pidash
```

Should return: `enabled`

To disable auto-start:
```bash
sudo systemctl disable pidash
```

To re-enable:
```bash
sudo systemctl enable pidash
```

## Network Access

By default, the dashboard is accessible on your local network:

- From Pi: `http://localhost:3000`
- From local network: `http://raspberrypi.local:3000` or `http://<pi-ip-address>:3000`

To find your Pi's IP address:
```bash
hostname -I
```

## Next Steps

1. Run `./scripts/setup-service.sh` to install the service
2. Run `npm run deploy:pi` to deploy your custom config
3. Access `http://raspberrypi.local:3000`
4. Verify you see your custom configuration
5. Enjoy your piDashboard! 🎉

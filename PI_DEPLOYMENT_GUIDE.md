# Raspberry Pi Deployment Guide

Complete guide for keeping your Raspberry Pi updated during development.

## Quick Start

### Option 1: Network Dev Server (Recommended for Development)

**Fastest iteration** - See changes instantly on Pi.

1. **On development machine:**
   ```bash
   npm run start:network
   ```

2. **Find your IP address:**
   ```bash
   # macOS
   ipconfig getifaddr en0

   # Linux
   hostname -I | awk '{print $1}'
   ```

3. **On Raspberry Pi, update kiosk URL:**
   ```bash
   nano ~/.config/lxsession/LXDE-pi/autostart
   ```

   Change to:
   ```
   @chromium-browser --kiosk http://YOUR_DEV_MACHINE_IP:8081
   ```

4. **Restart Pi or reload Chromium**

**Pros:** Instant hot reloading, no build step
**Cons:** Dev machine must stay running

---

### Option 2: Rsync Deployment (Recommended for Production Testing)

**Best for testing production builds** with quick deployments.

#### One-Time Setup:

1. **Set up SSH keys (passwordless login):**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ssh-copy-id pi@raspberrypi.local
   ```

2. **Configure deployment script:**
   ```bash
   # Edit scripts/deploy-to-pi.sh
   # Update PI_HOST with your Pi's hostname or IP
   nano scripts/deploy-to-pi.sh
   ```

3. **Make scripts executable:**
   ```bash
   chmod +x scripts/*.sh
   ```

#### Usage:

**Manual deployment:**
```bash
npm run deploy:pi
```

**Watch mode (auto-deploy on file changes):**
```bash
# Install fswatch first
brew install fswatch  # macOS
# or apt-get install inotify-tools  # Linux

npm run watch:pi
```

---

### Option 3: Git-Based Auto-Pull (Best for Multiple Pis)

**Best for:** Multiple Raspberry Pis, team environments

#### On Raspberry Pi:

1. **Clone repository:**
   ```bash
   cd /home/pi
   git clone YOUR_REPO_URL piDash
   cd piDash
   ```

2. **Install dependencies:**
   ```bash
   npm install
   npm run build:web
   ```

3. **Set up auto-update script:**
   ```bash
   chmod +x scripts/pi-auto-update.sh

   # Test it
   ./scripts/pi-auto-update.sh
   ```

4. **Add to crontab (check every 5 minutes):**
   ```bash
   crontab -e
   ```

   Add:
   ```
   */5 * * * * /home/pi/piDash/scripts/pi-auto-update.sh >> /home/pi/piDash/update.log 2>&1
   ```

#### On Development Machine:

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Updated dashboard"
   git push origin main
   ```

2. **Pi will automatically pull within 5 minutes**

**Pros:** Works with multiple Pis, version controlled
**Cons:** 5-minute delay (or manual trigger needed)

---

### Option 4: Webhook Auto-Deploy (Instant Updates)

**Best for:** Instant deployments, CI/CD pipeline

#### On Raspberry Pi:

1. **Install webhook server:**
   ```bash
   cd /home/pi/piDash
   npm install express
   ```

2. **Create systemd service:**
   ```bash
   sudo nano /etc/systemd/system/pidash-webhook.service
   ```

   Add:
   ```ini
   [Unit]
   Description=piDash Webhook Server
   After=network.target

   [Service]
   Type=simple
   User=pi
   WorkingDirectory=/home/pi/piDash
   ExecStart=/usr/bin/node /home/pi/piDash/scripts/webhook-server.js
   Restart=always
   Environment=WEBHOOK_SECRET=your-secret-here

   [Install]
   WantedBy=multi-user.target
   ```

3. **Enable and start:**
   ```bash
   sudo systemctl enable pidash-webhook
   sudo systemctl start pidash-webhook
   sudo systemctl status pidash-webhook
   ```

4. **Open firewall (if needed):**
   ```bash
   sudo ufw allow 9000/tcp
   ```

#### On Development Machine:

1. **Update webhook secret:**
   ```bash
   # Edit scripts/trigger-deploy.sh
   nano scripts/trigger-deploy.sh
   # Set WEBHOOK_SECRET to match Pi
   ```

2. **Trigger deployment:**
   ```bash
   git push origin main
   ./scripts/trigger-deploy.sh
   ```

3. **Optional: Auto-trigger on git push:**
   ```bash
   # Add to .git/hooks/post-commit
   echo './scripts/trigger-deploy.sh' >> .git/hooks/post-commit
   chmod +x .git/hooks/post-commit
   ```

---

## Raspberry Pi Server Setup

### Express Server for Production

1. **Create server file on Pi:**
   ```bash
   mkdir -p /home/pi/piDash/server
   nano /home/pi/piDash/server/index.js
   ```

2. **Add server code:**
   ```javascript
   const express = require('express');
   const path = require('path');
   const app = express();

   // Serve static files
   app.use(express.static(path.join(__dirname, '../dist')));

   // Handle client-side routing
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../dist/index.html'));
   });

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
     console.log(`piDash running on http://localhost:${PORT}`);
   });
   ```

3. **Create systemd service:**
   ```bash
   sudo nano /etc/systemd/system/pidash.service
   ```

   Add:
   ```ini
   [Unit]
   Description=piDash Application
   After=network.target

   [Service]
   Type=simple
   User=pi
   WorkingDirectory=/home/pi/piDash
   ExecStart=/usr/bin/node server/index.js
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

4. **Enable and start:**
   ```bash
   sudo systemctl enable pidash
   sudo systemctl start pidash
   sudo systemctl status pidash
   ```

---

## Troubleshooting

### Can't Connect to Dev Server from Pi

**Check firewall on dev machine:**
```bash
# macOS
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add node

# Linux
sudo ufw allow 8081/tcp
```

**Verify IP and port:**
```bash
# On dev machine
npm start:network
# Note the IP address shown

# On Pi, test connection
curl http://YOUR_IP:8081
```

### Rsync/SSH Issues

**Test SSH connection:**
```bash
ssh pi@raspberrypi.local
```

**If hostname doesn't resolve, use IP:**
```bash
# Find Pi's IP
# On Pi:
hostname -I

# Update scripts/deploy-to-pi.sh with IP address
PI_HOST="192.168.1.100"
```

### Permission Denied on Scripts

```bash
chmod +x scripts/*.sh
```

### Git Pull Fails on Pi

**Reset to remote state:**
```bash
cd /home/pi/piDash
git fetch origin
git reset --hard origin/main
```

### Service Won't Start

**Check logs:**
```bash
sudo journalctl -u pidash -f
```

**Common fixes:**
```bash
# Missing dependencies
cd /home/pi/piDash && npm install

# Build not present
npm run build:web

# Port already in use
sudo lsof -i :3000
sudo kill -9 PID
```

---

## Monitoring & Logs

### View Service Logs

```bash
# piDash app
sudo journalctl -u pidash -f

# Webhook server
sudo journalctl -u pidash-webhook -f
```

### View Update Logs

```bash
tail -f /home/pi/piDash/update.log
```

### Check Service Status

```bash
sudo systemctl status pidash
sudo systemctl status pidash-webhook
```

---

## Recommended Workflow

### During Active Development:
1. Use **Network Dev Server** (Option 1)
2. See changes instantly with hot reloading
3. Point Pi browser to `http://YOUR_IP:8081`

### Before Pushing to Git:
1. Test production build with **Rsync** (Option 2)
2. `npm run deploy:pi`
3. Verify everything works in production mode

### After Git Push:
1. Pi auto-updates via **Git-based** (Option 3) or **Webhook** (Option 4)
2. All Pis on your network stay in sync

---

## Performance Tips

1. **Enable Pi Hardware Acceleration:**
   ```bash
   sudo nano /boot/config.txt
   # Add:
   dtoverlay=vc4-kms-v3d
   ```

2. **Reduce Bundle Size:**
   ```bash
   # Analyze bundle
   npx expo export:web --analyze

   # Enable production optimizations
   export NODE_ENV=production
   ```

3. **Use Production Build:**
   ```bash
   npm run build:web
   # Never deploy with 'npm start' in production
   ```

4. **Enable Caching:**
   ```bash
   # Add cache headers in server/index.js
   app.use(express.static('dist', {
     maxAge: '1d',
     etag: true
   }));
   ```

---

## Network Discovery

### Find Raspberry Pi on Network

```bash
# Using nmap
nmap -sn 192.168.1.0/24 | grep -B 2 "Raspberry"

# Using arp
arp -a | grep -i "b8:27:eb\|dc:a6:32"

# Using avahi (if mDNS enabled)
ping raspberrypi.local
```

### Set Static IP on Pi

```bash
sudo nano /etc/dhcpcd.conf
```

Add:
```
interface wlan0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1
```

---

## Multiple Pi Management

### Deploy to Multiple Pis

Create `scripts/deploy-to-all.sh`:
```bash
#!/bin/bash

PIS=("pi1.local" "pi2.local" "pi3.local")

for pi in "${PIS[@]}"; do
    echo "Deploying to $pi..."
    rsync -avz --delete dist/ "pi@$pi:/home/pi/piDash/dist/"
    ssh "pi@$pi" "sudo systemctl restart pidash"
done
```

### Centralized Configuration

Use environment variables or config server:
```javascript
// On Pi, set environment
export CONFIG_URL=http://config-server.local/pi1.json

// In app, fetch config
fetch(process.env.CONFIG_URL)
```

---

## Backup & Recovery

### Backup Pi Configuration

```bash
# From dev machine
rsync -avz pi@raspberrypi.local:/home/pi/piDash/config ./backup/
```

### Quick Recovery

```bash
# Re-image SD card
# Boot Pi
# Run one-liner:
curl -sSL https://raw.githubusercontent.com/YOUR_REPO/main/scripts/pi-setup.sh | bash
```

---

## Next Steps

1. Choose your deployment method (start with Option 1 or 2)
2. Set up SSH keys for passwordless access
3. Test deployment workflow
4. Configure auto-updates for hands-free operation
5. Set up monitoring/alerting if needed

For questions or issues, refer to the main README.md or open an issue.

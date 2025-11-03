# piDash Deployment Cheat Sheet

Quick reference for common deployment tasks.

## 🚀 Quick Deploy Commands

```bash
# Deploy to Pi (production build)
npm run deploy:pi

# Watch and auto-deploy on changes
npm run watch:pi

# Start network dev server (for dev mode)
npm run start:network

# Trigger webhook deployment
./scripts/trigger-deploy.sh
```

## 🥧 On Raspberry Pi

```bash
# Check service status
sudo systemctl status pidash

# View live logs
sudo journalctl -u pidash -f

# Restart service
sudo systemctl restart pidash

# Stop service
sudo systemctl stop pidash

# Manual update from git
cd /home/pi/piDash && ./scripts/pi-auto-update.sh

# Check if dashboard is responding
curl http://localhost:3000/health
```

## 🔧 Development Workflow

### Active Development (Fastest)
```bash
# On dev machine - start server
npm run start:network

# Get your IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux

# Point Pi browser to: http://YOUR_IP:8081
```

### Production Testing
```bash
# Build and deploy
npm run deploy:pi

# Or with watch mode
npm run watch:pi
```

## 🐛 Troubleshooting

```bash
# Can't connect to Pi
ping raspberrypi.local
ssh pi@raspberrypi.local

# Find Pi's IP address
nmap -sn 192.168.1.0/24 | grep -B 2 "Raspberry"

# Check if port is open
nc -zv raspberrypi.local 3000

# Service won't start - check logs
sudo journalctl -u pidash -n 50 --no-pager

# Clear logs
sudo journalctl --vacuum-time=1d

# Kill process on port 3000
sudo lsof -ti:3000 | xargs sudo kill -9

# Reset Pi to clean state
cd /home/pi/piDash
git fetch origin
git reset --hard origin/main
npm install
npm run build:web
sudo systemctl restart pidash
```

## 🔐 SSH Quick Setup

```bash
# Generate key
ssh-keygen -t ed25519

# Copy to Pi
ssh-copy-id pi@raspberrypi.local

# Test
ssh pi@raspberrypi.local "echo 'Success!'"
```

## 📊 Monitoring

```bash
# CPU/Memory usage on Pi
ssh pi@raspberrypi.local "top -bn1 | head -20"

# Disk space
ssh pi@raspberrypi.local "df -h"

# Temperature
ssh pi@raspberrypi.local "vcgencmd measure_temp"

# Network status
ssh pi@raspberrypi.local "iwconfig wlan0"
```

## 🔄 Multiple Pi Management

```bash
# Deploy to all Pis
for pi in pi1.local pi2.local pi3.local; do
    echo "Deploying to $pi..."
    rsync -avz dist/ pi@$pi:/home/pi/piDash/dist/
    ssh pi@$pi "sudo systemctl restart pidash"
done
```

## 📱 Mobile Development

```bash
# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Build for production
eas build --platform ios
eas build --platform android
```

## 🌐 Network Info

```bash
# Your dev machine IP
ipconfig getifaddr en0                    # macOS WiFi
ipconfig getifaddr en1                    # macOS Ethernet
hostname -I | awk '{print $1}'           # Linux

# Pi's IP address (from Pi)
hostname -I

# Find all devices on network
nmap -sn 192.168.1.0/24

# Check firewall (macOS)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Open port for dev server (Linux)
sudo ufw allow 8081/tcp
```

## 🎯 One-Liners

```bash
# Complete deploy in one command
npm run build:web && npm run deploy:pi

# Build, deploy, and check status
npm run deploy:pi && ssh pi@raspberrypi.local "sudo systemctl status pidash"

# Quick restart
ssh pi@raspberrypi.local "sudo systemctl restart pidash"

# Tail logs remotely
ssh pi@raspberrypi.local "sudo journalctl -u pidash -f"

# Update and restart
ssh pi@raspberrypi.local "cd piDash && git pull && npm run build:web && sudo systemctl restart pidash"
```

## 📋 Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| Service definition | `/etc/systemd/system/pidash.service` | Systemd service config |
| Autostart config | `~/.config/lxsession/LXDE-pi/autostart` | Kiosk mode startup |
| WiFi check | `/home/pi/check_wifi.sh` | WiFi monitoring script |
| App logs | `journalctl -u pidash` | Application logs |
| Update logs | `/home/pi/piDash/update.log` | Git pull logs |

## 🔄 Git Workflow

```bash
# Commit and push
git add .
git commit -m "Update dashboard"
git push origin main

# Pi will auto-update (if cron job setup)
# Or trigger manually:
./scripts/trigger-deploy.sh
```

## ⚙️ Performance

```bash
# Analyze bundle size
npx expo export:web --analyze

# Check Pi performance
ssh pi@raspberrypi.local "vcgencmd measure_temp && free -h && uptime"

# Monitor resource usage
ssh pi@raspberrypi.local "watch -n 1 'vcgencmd measure_temp && ps aux | grep node'"
```

## 🆘 Emergency Commands

```bash
# Restart Pi remotely
ssh pi@raspberrypi.local "sudo reboot"

# Stop kiosk mode (to debug)
ssh pi@raspberrypi.local "DISPLAY=:0 killall chromium-browser"

# Emergency service restart
ssh pi@raspberrypi.local "sudo systemctl restart pidash && sudo systemctl status pidash"

# Roll back to previous version
ssh pi@raspberrypi.local "cd piDash && git log --oneline -5"
ssh pi@raspberrypi.local "cd piDash && git checkout COMMIT_HASH && npm run build:web && sudo systemctl restart pidash"
```

## 📞 Common Hostnames/IPs

```bash
# Default Pi hostname
raspberrypi.local

# If .local doesn't work, use IP
# Find it with: nmap -sn 192.168.1.0/24

# Common router IPs
192.168.1.1    # Most common
192.168.0.1    # Alternative
10.0.0.1       # Some networks
```

## 💡 Pro Tips

1. **Alias common commands** in `~/.zshrc` or `~/.bashrc`:
   ```bash
   alias pi-deploy='npm run deploy:pi'
   alias pi-logs='ssh pi@raspberrypi.local "sudo journalctl -u pidash -f"'
   alias pi-restart='ssh pi@raspberrypi.local "sudo systemctl restart pidash"'
   alias pi-status='ssh pi@raspberrypi.local "sudo systemctl status pidash"'
   ```

2. **Use tmux on Pi** for persistent sessions:
   ```bash
   ssh pi@raspberrypi.local "tmux attach || tmux"
   ```

3. **Set static IP** to avoid hostname issues

4. **Bookmark health check**: `http://raspberrypi.local:3000/health`

5. **Use VS Code Remote SSH** for editing files directly on Pi

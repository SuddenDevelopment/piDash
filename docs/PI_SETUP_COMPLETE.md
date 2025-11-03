# ✅ Pi Setup Complete!

Your Raspberry Pi at **192.168.1.166** is now running piDash!

## 🎯 Quick Access

- **Dashboard:** http://192.168.1.166:3000
- **Health Check:** http://192.168.1.166:3000/health
- **System Info API:** http://192.168.1.166:3000/api/system

## ✨ What's Configured

### On Your Mac
- ✅ Local Pi configuration (`pi-config.local.sh`) - not committed to git
- ✅ SSH passwordless login set up (admin@192.168.1.166)
- ✅ Deployment script configured for your Pi
- ✅ Scripts made executable

### On Your Pi (192.168.1.166)
- ✅ Node.js v20.19.5 installed
- ✅ npm v10.8.2 installed
- ✅ piDash directory: `/home/admin/piDash`
- ✅ Express server installed and running
- ✅ Systemd service (pidash) configured and enabled
- ✅ Dashboard files deployed to `/home/admin/piDash/dist`
- ✅ Auto-starts on boot

## 🚀 Development Workflow

### Deploy Changes
```bash
# From your Mac - builds and deploys to Pi
npm run deploy:pi
```

**What it does:**
1. Builds production bundle
2. Syncs files to Pi via rsync
3. Restarts the pidash service
4. Shows you the URL

### Check Pi Status
```bash
# View service status
ssh admin@192.168.1.166 'sudo systemctl status pidash'

# View live logs
ssh admin@192.168.1.166 'sudo journalctl -u pidash -f'

# Restart manually
ssh admin@192.168.1.166 'sudo systemctl restart pidash'
```

### Typical Workflow
1. Edit dashboard: `app/index.tsx`
2. Deploy: `npm run deploy:pi`
3. View changes at: http://192.168.1.166:3000
4. Repeat!

## 📁 Your Local Configuration

The file `pi-config.local.sh` contains your Pi-specific settings:

```bash
PI_USER="admin"
PI_HOST="192.168.1.166"
PI_PATH="/home/admin/piDash"
```

This file is in `.gitignore` and won't be committed to the repository, so your local settings stay private.

## 🔧 Service Management

### Systemd Service Commands
```bash
# Start service
ssh admin@192.168.1.166 'sudo systemctl start pidash'

# Stop service
ssh admin@192.168.1.166 'sudo systemctl stop pidash'

# Restart service
ssh admin@192.168.1.166 'sudo systemctl restart pidash'

# Check status
ssh admin@192.168.1.166 'sudo systemctl status pidash'

# View logs
ssh admin@192.168.1.166 'sudo journalctl -u pidash -f'

# Disable auto-start
ssh admin@192.168.1.166 'sudo systemctl disable pidash'

# Re-enable auto-start
ssh admin@192.168.1.166 'sudo systemctl enable pidash'
```

## 🖥️ Setting Up Kiosk Mode

To make your Pi boot directly into the dashboard in fullscreen:

```bash
# SSH to your Pi
ssh admin@192.168.1.166

# Create autostart directory
mkdir -p ~/.config/lxsession/LXDE-pi

# Create autostart file
nano ~/.config/lxsession/LXDE-pi/autostart
```

Add this content:
```bash
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi

# Disable screen blanking
@xset s off
@xset -dpms
@xset s noblank

# Wait for network
@bash -c "sleep 10"

# Start Chromium in kiosk mode
@chromium-browser --kiosk --incognito http://localhost:3000 \
  --noerrdialogs \
  --disable-infobars \
  --ignore-gpu-blacklist \
  --use-gl=egl \
  --enable-accelerated-2d-canvas
```

Then reboot:
```bash
sudo reboot
```

## 🧪 Testing

### Test Health Endpoint
```bash
curl http://192.168.1.166:3000/health
```

### Test System Info API
```bash
curl http://192.168.1.166:3000/api/system
```

### Open Dashboard in Browser
```bash
open http://192.168.1.166:3000
```

## 🐛 Troubleshooting

### Dashboard Not Loading
```bash
# Check if service is running
ssh admin@192.168.1.166 'sudo systemctl status pidash'

# Check logs for errors
ssh admin@192.168.1.166 'sudo journalctl -u pidash -n 50'

# Restart service
ssh admin@192.168.1.166 'sudo systemctl restart pidash'
```

### Files Not Deploying
```bash
# Check SSH connection
ssh admin@192.168.1.166 'echo "SSH working!"'

# Check rsync
rsync --version

# Manually copy files
scp -r dist/* admin@192.168.1.166:/home/admin/piDash/dist/
```

### Service Won't Start
```bash
# Check for syntax errors
ssh admin@192.168.1.166 'node /home/admin/piDash/server/index.js'

# Check if port is in use
ssh admin@192.168.1.166 'sudo lsof -i :3000'
```

## 📝 Files & Directories

### On Your Mac
```
piDash/
├── pi-config.local.sh    # Your local Pi config (not in git)
├── app/                  # Dashboard source code
├── server/               # Express server
├── dist/                 # Built files (deployed to Pi)
└── scripts/              # Deployment scripts
```

### On Your Pi
```
/home/admin/piDash/
├── server/
│   └── index.js         # Express server
├── dist/                # Your deployed dashboard
│   ├── index.html
│   └── _expo/
├── node_modules/        # Dependencies
└── package.json
```

## ⚙️ Service Configuration

Service file location: `/etc/systemd/system/pidash.service`

```ini
[Unit]
Description=piDash Application
After=network.target

[Service]
Type=simple
User=admin
WorkingDirectory=/home/admin/piDash
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

## 🎨 Next Steps

Now that your Pi is set up, you can:

1. **Customize the dashboard** - Edit `app/index.tsx`
2. **Add more features** - Check the README for Victory charts, Gluestack UI
3. **Create new dashboards** - Add routes in `app/`
4. **Set up kiosk mode** - Follow instructions above
5. **Add dashboard rotation** - Implement auto-switching between views

## 📚 Documentation

- **Quick Start:** [QUICKSTART.md](./QUICKSTART.md)
- **Full Deployment Guide:** [PI_DEPLOYMENT_GUIDE.md](./PI_DEPLOYMENT_GUIDE.md)
- **Command Reference:** [DEPLOYMENT_CHEATSHEET.md](./DEPLOYMENT_CHEATSHEET.md)
- **Architecture:** [README.md](./README.md)

---

**Happy Dashboarding! 🥧✨**

Your dashboard is live at: http://192.168.1.166:3000

# piDash Quick Start Guide

Get your dashboard running on Raspberry Pi in minutes!

## ✨ What's Working Now

- ✅ Basic dashboard with live clock
- ✅ Production web build ready
- ✅ Express server configured
- ✅ Deployment scripts ready
- ✅ Easy update workflow

## 🚀 Option 1: Network Dev Server (Fastest for Development)

**Best for:** Active development with instant hot reloading

### On Your Development Machine:

```bash
# Start the dev server (accessible from network)
npm run start:network

# Note the URL shown (e.g., http://192.168.1.100:8081)
```

### On Your Raspberry Pi:

```bash
# Point Chromium to your dev machine
chromium-browser --kiosk http://YOUR_DEV_MACHINE_IP:8081
```

**That's it!** Changes you make will instantly appear on the Pi.

---

## 🥧 Option 2: Deploy to Raspberry Pi (Production)

**Best for:** Testing production builds, permanent setup

### Step 1: Initial Pi Setup

**On your Raspberry Pi**, run this one-liner:

```bash
curl -sSL https://raw.githubusercontent.com/SuddenDevelopment/piDash/main/scripts/pi-initial-setup.sh | bash -s -- https://github.com/SuddenDevelopment/piDash.git
```

Or manually:

```bash
# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git chromium-browser

# Clone the repository
git clone https://github.com/SuddenDevelopment/piDash.git ~/piDash
cd ~/piDash

# Install dependencies
npm install

# Build the project
npm run build:web

# Create and start the service
sudo cp scripts/pi-initial-setup.sh /tmp/ && sudo bash /tmp/pi-initial-setup.sh
```

### Step 2: Deploy Updates from Dev Machine

**One-time setup:**

```bash
# Set up passwordless SSH
ssh-keygen -t ed25519
ssh-copy-id pi@raspberrypi.local

# Update the deploy script with your Pi's hostname/IP
# Edit scripts/deploy-to-pi.sh if needed
```

**Deploy anytime:**

```bash
npm run deploy:pi
```

---

## 📝 Quick Reference

### Development Commands

```bash
# Start dev server
npm start

# Start dev server (network accessible)
npm run start:network

# Build for production
npm run build:web

# Deploy to Pi
npm run deploy:pi

# Watch and auto-deploy
npm run watch:pi
```

### Pi Commands (SSH to Pi first)

```bash
# Check service status
sudo systemctl status pidash

# View live logs
sudo journalctl -u pidash -f

# Restart service
sudo systemctl restart pidash

# Manual git update
cd ~/piDash && git pull && npm run build:web && sudo systemctl restart pidash
```

---

## 🔍 Verify It's Working

### Check the Dashboard

**From your browser:**
- Dev mode: `http://YOUR_DEV_MACHINE_IP:8081`
- Production (on Pi): `http://raspberrypi.local:3000`

**You should see:**
- 🥧 piDash header
- Live clock updating every second
- System information cards
- Welcome message with features

### Health Check

```bash
# Check if server is responding
curl http://raspberrypi.local:3000/health

# Should return JSON with status: "ok"
```

---

## 🐛 Troubleshooting

### Can't connect to dev server from Pi

```bash
# On Mac, get your IP
ipconfig getifaddr en0

# Make sure firewall allows connections
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add node
```

### Pi hostname doesn't resolve

```bash
# Find Pi's IP address
# On Pi:
hostname -I

# Use IP instead of hostname:
http://192.168.1.XXX:3000
```

### Build fails

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build:web
```

### Service won't start on Pi

```bash
# Check logs
sudo journalctl -u pidash -n 50

# Common fixes:
cd ~/piDash
npm install  # Install missing dependencies
npm run build:web  # Ensure build exists
```

---

## 📱 What's Next?

Now that you have the basics running, you can:

1. **Customize the dashboard** - Edit `app/index.tsx`
2. **Add charts** - Follow the Victory integration guide in README
3. **Configure JSON-driven UI** - Create dashboard configs in `config/dashboards/`
4. **Add more dashboards** - Create new routes in `app/` folder
5. **Set up auto-rotation** - Implement dashboard switching

---

## 🎯 Current Project Status

### ✅ Completed
- Basic React Native Web project structure
- Express server for Pi hosting
- Simple dashboard with live clock
- Production build pipeline
- Deployment scripts
- Development workflow

### 🔄 Next Steps
- Add Gluestack UI components
- Integrate Victory charts
- Implement JSON configuration system
- Add dashboard rotation
- Create example dashboards (weather, system monitor)

---

## 💡 Pro Tips

**For the fastest development experience:**
1. Use `npm run start:network` on your dev machine
2. Point Pi browser to your dev server
3. Edit files and see changes instantly
4. When ready for production testing, run `npm run deploy:pi`

**For multiple Pis:**
1. Set up git-based deployment (see PI_DEPLOYMENT_GUIDE.md)
2. Push to GitHub
3. All Pis auto-update via cron job

**For CI/CD:**
1. Set up webhook server on Pi
2. Configure GitHub Actions
3. Auto-deploy on push to main

---

## 📚 Documentation

- **Full Setup Guide:** [PI_DEPLOYMENT_GUIDE.md](./PI_DEPLOYMENT_GUIDE.md)
- **Quick Commands:** [DEPLOYMENT_CHEATSHEET.md](./DEPLOYMENT_CHEATSHEET.md)
- **Architecture & Tech Stack:** [README.md](./README.md)

---

## 🆘 Need Help?

- Check the [troubleshooting section](#-troubleshooting) above
- Review the [deployment guide](./PI_DEPLOYMENT_GUIDE.md)
- Open an issue on GitHub: https://github.com/SuddenDevelopment/piDash/issues

---

**Happy Dashboarding! 🥧✨**

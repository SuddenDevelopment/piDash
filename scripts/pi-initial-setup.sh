#!/bin/bash
# Run this script ON the Raspberry Pi for initial setup

set -e  # Exit on error

echo "🥧 piDash Raspberry Pi Setup"
echo "============================"

# Configuration
INSTALL_DIR="/home/pi/piDash"
REPO_URL="${REPO_URL:-}"  # Set this or provide as argument

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "\n${GREEN}▶ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if running on Raspberry Pi
if ! grep -q "Raspberry Pi" /proc/cpuinfo 2>/dev/null; then
    print_warning "This doesn't appear to be a Raspberry Pi"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Update system
print_step "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    print_step "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    print_step "Node.js already installed: $(node --version)"
fi

# Install dependencies
print_step "Installing system dependencies..."
sudo apt-get install -y \
    git \
    chromium-browser \
    unclutter \
    xdotool \
    rsync

# Clone or update repository
if [ -d "$INSTALL_DIR" ]; then
    print_step "piDash directory exists, updating..."
    cd "$INSTALL_DIR"
    git pull
else
    if [ -z "$REPO_URL" ]; then
        print_error "REPO_URL not set. Please provide the repository URL:"
        read -p "Repository URL: " REPO_URL
    fi

    print_step "Cloning repository..."
    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# Install npm dependencies
print_step "Installing npm dependencies..."
npm install

# Build the project
print_step "Building production bundle..."
npm run build:web || print_warning "Build failed - you may need to build from dev machine"

# Create Express server
print_step "Setting up Express server..."
mkdir -p server
cat > server/index.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, '../dist')));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`piDash running on http://localhost:\${PORT}\`);
});
EOF

# Create systemd service
print_step "Creating systemd service..."
sudo tee /etc/systemd/system/pidash.service > /dev/null << EOF
[Unit]
Description=piDash Application
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
print_step "Enabling piDash service..."
sudo systemctl daemon-reload
sudo systemctl enable pidash
sudo systemctl start pidash

# Configure Chromium kiosk mode
print_step "Configuring Chromium kiosk mode..."
mkdir -p ~/.config/lxsession/LXDE-pi

# Backup existing autostart
if [ -f ~/.config/lxsession/LXDE-pi/autostart ]; then
    cp ~/.config/lxsession/LXDE-pi/autostart ~/.config/lxsession/LXDE-pi/autostart.backup
fi

# Create new autostart
cat > ~/.config/lxsession/LXDE-pi/autostart << 'EOF'
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@xscreensaver -no-splash

# Disable screen blanking
@xset s off
@xset -dpms
@xset s noblank

# Hide mouse cursor when idle
@unclutter -idle 0.5 -root

# Wait for network and services to start
@bash -c "sleep 10"

# Start Chromium in kiosk mode
@chromium-browser --kiosk --incognito http://localhost:3000 \
  --noerrdialogs \
  --disable-infobars \
  --ignore-gpu-blacklist \
  --use-gl=egl \
  --enable-accelerated-2d-canvas \
  --disable-features=TranslateUI \
  --no-first-run \
  --fast --fast-start \
  --disable-pinch
EOF

# Make deployment scripts executable
print_step "Setting up deployment scripts..."
chmod +x scripts/*.sh 2>/dev/null || true

# Configure WiFi reliability
print_step "Setting up WiFi monitoring..."
cat > /home/pi/check_wifi.sh << 'EOF'
#!/bin/bash
# Check WiFi connectivity and reconnect if down

ping -c4 8.8.8.8 > /dev/null 2>&1

if [ $? != 0 ]; then
    echo "$(date): WiFi down, reconnecting..." >> /home/pi/wifi_check.log
    sudo ifconfig wlan0 down
    sleep 5
    sudo ifconfig wlan0 up
fi
EOF

chmod +x /home/pi/check_wifi.sh

# Add to crontab if not already there
(crontab -l 2>/dev/null | grep -q check_wifi) || \
    (crontab -l 2>/dev/null; echo "*/5 * * * * /home/pi/check_wifi.sh") | crontab -

# Enable hardware acceleration
print_step "Enabling hardware acceleration..."
if ! grep -q "dtoverlay=vc4-kms-v3d" /boot/config.txt 2>/dev/null; then
    echo "dtoverlay=vc4-kms-v3d" | sudo tee -a /boot/config.txt > /dev/null
fi

# Configure watchdog (optional but recommended)
print_step "Configuring watchdog timer..."
if ! grep -q "dtparam=watchdog=on" /boot/config.txt 2>/dev/null; then
    echo "dtparam=watchdog=on" | sudo tee -a /boot/config.txt > /dev/null
fi

# Summary
print_step "Setup Complete!"
echo ""
echo "============================"
echo "✅ piDash installed at: $INSTALL_DIR"
echo "✅ Service: pidash.service"
echo "✅ URL: http://localhost:3000"
echo "✅ WiFi monitoring: enabled"
echo "✅ Kiosk mode: configured"
echo ""
echo "Next steps:"
echo "1. Reboot the Pi: sudo reboot"
echo "2. The dashboard will auto-start in kiosk mode"
echo "3. To deploy updates from dev machine:"
echo "   - Set up SSH keys: ssh-copy-id pi@raspberrypi.local"
echo "   - Run: npm run deploy:pi"
echo ""
echo "Useful commands:"
echo "  sudo systemctl status pidash   # Check service status"
echo "  sudo systemctl restart pidash  # Restart service"
echo "  sudo journalctl -u pidash -f   # View logs"
echo ""
read -p "Reboot now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo reboot
fi

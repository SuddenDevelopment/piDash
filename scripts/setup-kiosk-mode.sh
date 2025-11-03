#!/bin/bash

# Setup Kiosk Mode on Raspberry Pi
# Run this on the Pi to configure Chromium to auto-start in kiosk mode

echo "🖥️  Setting up Chromium kiosk mode..."

# Create autostart directory if it doesn't exist
mkdir -p ~/.config/lxsession/LXDE-pi

# Backup existing autostart if it exists
if [ -f ~/.config/lxsession/LXDE-pi/autostart ]; then
    echo "📋 Backing up existing autostart..."
    cp ~/.config/lxsession/LXDE-pi/autostart ~/.config/lxsession/LXDE-pi/autostart.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create new autostart configuration
echo "📝 Creating autostart configuration..."
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

echo "✅ Kiosk mode configured!"
echo ""
echo "The dashboard will auto-start in fullscreen Chromium after reboot."
echo ""
echo "To test without rebooting, run:"
echo "  DISPLAY=:0 chromium-browser --kiosk --incognito http://localhost:3000 &"
echo ""
echo "To reboot now:"
echo "  sudo reboot"

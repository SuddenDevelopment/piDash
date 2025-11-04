#!/bin/bash

# Setup Kiosk Mode on Raspberry Pi
# Run this on the Pi to configure Chromium to auto-start in kiosk mode

echo "🖥️  Setting up Chromium kiosk mode..."

# Create startup script that waits for service
echo "📝 Creating startup script with health check..."
cat > $HOME/start-kiosk.sh << 'EOF'
#!/bin/bash
# Start Chromium kiosk mode after waiting for piDash service

LOG_FILE="$HOME/kiosk-startup.log"
URL="http://localhost:3000"
MAX_ATTEMPTS=60
WAIT_TIME=2

echo "$(date): Starting kiosk mode..." > "$LOG_FILE"

# Wait for X server to be ready
echo "$(date): Waiting for X server..." >> "$LOG_FILE"
while ! xset q &>/dev/null; do
    sleep 1
done

# Disable screen blanking
xset s off
xset -dpms
xset s noblank

# Hide mouse cursor
unclutter -idle 0.5 -root &

# Wait for network to be up
echo "$(date): Waiting for network..." >> "$LOG_FILE"
attempt=0
while ! ping -c 1 8.8.8.8 &>/dev/null && [ $attempt -lt 30 ]; do
    sleep 1
    attempt=$((attempt + 1))
done

if [ $attempt -eq 30 ]; then
    echo "$(date): WARNING: Network timeout, proceeding anyway" >> "$LOG_FILE"
fi

# Wait for piDash service to be ready
echo "$(date): Waiting for piDash service..." >> "$LOG_FILE"
attempt=0
while [ $attempt -lt $MAX_ATTEMPTS ]; do
    # Check if service is responding
    if curl -sf "$URL/health" > /dev/null 2>&1; then
        echo "$(date): Service is ready!" >> "$LOG_FILE"
        break
    fi

    echo "$(date): Attempt $((attempt + 1))/$MAX_ATTEMPTS - waiting for service..." >> "$LOG_FILE"
    sleep $WAIT_TIME
    attempt=$((attempt + 1))
done

if [ $attempt -eq $MAX_ATTEMPTS ]; then
    echo "$(date): ERROR: Service failed to start after $MAX_ATTEMPTS attempts" >> "$LOG_FILE"
    # Try starting anyway in case health check failed but service is up
fi

# Give it one more second to be safe
sleep 1

# Start Chromium in kiosk mode
echo "$(date): Starting Chromium..." >> "$LOG_FILE"
chromium --kiosk --incognito "$URL" \
  --noerrdialogs \
  --disable-infobars \
  --ignore-gpu-blacklist \
  --use-gl=egl \
  --enable-accelerated-2d-canvas \
  --disable-features=TranslateUI \
  --no-first-run \
  --fast --fast-start \
  --disable-pinch \
  --check-for-update-interval=31536000 \
  >> "$LOG_FILE" 2>&1

echo "$(date): Chromium exited" >> "$LOG_FILE"
EOF

chmod +x $HOME/start-kiosk.sh

# Create autostart directory if it doesn't exist
mkdir -p ~/.config/lxsession/LXDE-pi

# Backup existing autostart if it exists
if [ -f ~/.config/lxsession/LXDE-pi/autostart ]; then
    echo "📋 Backing up existing autostart..."
    cp ~/.config/lxsession/LXDE-pi/autostart ~/.config/lxsession/LXDE-pi/autostart.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create new autostart configuration
echo "📝 Creating autostart configuration..."
cat > ~/.config/lxsession/LXDE-pi/autostart << EOF
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@xscreensaver -no-splash

# Start kiosk mode with our smart startup script
@$HOME/start-kiosk.sh
EOF

# Also create a systemd user service as a backup method
echo "📝 Creating systemd user service..."
mkdir -p ~/.config/systemd/user
cat > ~/.config/systemd/user/kiosk.service << EOF
[Unit]
Description=Chromium Kiosk Mode
After=graphical.target
Wants=graphical.target

[Service]
Type=simple
Environment=DISPLAY=:0
ExecStart=$HOME/start-kiosk.sh
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
EOF

# Enable the systemd service
systemctl --user daemon-reload
systemctl --user enable kiosk.service

echo "✅ Kiosk mode configured!"
echo ""
echo "The dashboard will auto-start in fullscreen Chromium after reboot."
echo "Startup logs will be saved to $HOME/kiosk-startup.log"
echo ""
echo "To test without rebooting, run:"
echo "  $HOME/start-kiosk.sh"
echo ""
echo "To check startup logs:"
echo "  cat $HOME/kiosk-startup.log"
echo ""
echo "To reboot now:"
echo "  sudo reboot"

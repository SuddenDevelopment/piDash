#!/bin/bash

# Enable Kiosk Mode on Raspberry Pi (run from your Mac)
# This sets up the Pi to automatically launch the dashboard in fullscreen Chrome on boot

# Default Configuration
PI_USER="pi"
PI_HOST="raspberrypi.local"

# Load local configuration if it exists (overrides defaults)
if [ -f "pi-config.local.sh" ]; then
    echo "📝 Loading local Pi configuration..."
    source pi-config.local.sh
fi

echo "🖥️  Enabling kiosk mode on $PI_HOST..."

# Copy the kiosk setup script to the Pi
echo "📡 Copying kiosk setup script..."
scp scripts/setup-kiosk-mode.sh "$PI_USER@$PI_HOST:/tmp/setup-kiosk-mode.sh"

# Run the setup script on the Pi
echo "⚙️  Running kiosk mode setup..."
ssh "$PI_USER@$PI_HOST" "bash /tmp/setup-kiosk-mode.sh && rm /tmp/setup-kiosk-mode.sh"

echo ""
echo "✅ Kiosk mode enabled!"
echo ""
echo "The dashboard will automatically launch in fullscreen Chrome after reboot."
echo ""
echo "To test it now, reboot your Pi:"
echo "  ssh $PI_USER@$PI_HOST 'sudo reboot'"

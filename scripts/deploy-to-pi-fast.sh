#!/bin/bash

# Fast Deploy - No Reboot
# Use this during development for faster iteration

# Default Configuration
PI_USER="pi"
PI_HOST="raspberrypi.local"
PI_PATH="/home/pi/piDash"
LOCAL_BUILD_DIR="dist"

# Load local configuration if it exists (overrides defaults)
if [ -f "pi-config.local.sh" ]; then
    echo "📝 Loading local Pi configuration..."
    source pi-config.local.sh
fi

echo "⚡ Fast deploying to Raspberry Pi (no reboot)..."

# Build the web bundle
echo "📦 Building production bundle..."
npm run build:web

# Check if build succeeded
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Sync to Pi using rsync
echo "📡 Syncing to $PI_HOST..."

# Sync dist directory
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --progress \
    "$LOCAL_BUILD_DIR/" \
    "$PI_USER@$PI_HOST:$PI_PATH/dist/"

# Sync server directory
rsync -avz \
    --progress \
    server/ \
    "$PI_USER@$PI_HOST:$PI_PATH/server/"

# Sync config directory (includes custom-dashboard.json)
rsync -avz \
    --progress \
    config/ \
    "$PI_USER@$PI_HOST:$PI_PATH/config/"

# Sync scripts directory (includes start/stop scripts)
rsync -avz \
    --progress \
    scripts/ \
    "$PI_USER@$PI_HOST:$PI_PATH/scripts/"

# Make scripts executable
ssh "$PI_USER@$PI_HOST" "chmod +x $PI_PATH/scripts/*.sh"

# Restart the service on Pi (if using systemd)
echo "🔄 Restarting piDash service..."
ssh "$PI_USER@$PI_HOST" "sudo systemctl restart pidash 2>/dev/null || echo 'Service not found, skipping restart'"

# Trigger browser refresh by bumping deployment version
echo "📱 Triggering browser refresh..."
ssh "$PI_USER@$PI_HOST" "curl -X POST http://localhost:3001/api/version/bump -s > /dev/null 2>&1 || echo 'Could not trigger refresh (API not running)'"

echo ""
echo "✅ Fast deployment complete!"
echo "🌐 Access at: http://$PI_HOST:3000"
echo "📱 Manually refresh your browser (Ctrl+Shift+R)"
echo ""
echo "💡 Tip: Use 'npm run deploy:pi' for full deployment with reboot"

#!/bin/bash

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

echo "🚀 Deploying to Raspberry Pi..."

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

# Sync config directory (for version.ts)
rsync -avz \
    --progress \
    config/ \
    "$PI_USER@$PI_HOST:$PI_PATH/config/"

# Restart the service on Pi (if using systemd)
echo "🔄 Restarting piDash service..."
ssh "$PI_USER@$PI_HOST" "sudo systemctl restart pidash 2>/dev/null || echo 'Service not found, skipping restart'"

echo "✅ Deployment complete!"
echo "🌐 Access at: http://$PI_HOST:3000"

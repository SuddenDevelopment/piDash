#!/bin/bash

# Configuration
PI_USER="pi"
PI_HOST="raspberrypi.local"  # or use IP like 192.168.1.100
PI_PATH="/home/pi/piDash"
LOCAL_BUILD_DIR="dist"

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
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --progress \
    "$LOCAL_BUILD_DIR/" \
    "$PI_USER@$PI_HOST:$PI_PATH/dist/"

# Restart the service on Pi (if using systemd)
echo "🔄 Restarting piDash service..."
ssh "$PI_USER@$PI_HOST" "sudo systemctl restart pidash 2>/dev/null || echo 'Service not found, skipping restart'"

echo "✅ Deployment complete!"
echo "🌐 Access at: http://$PI_HOST:3000"

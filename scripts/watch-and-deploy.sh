#!/bin/bash

# Watch for file changes and auto-deploy to Pi
# Requires fswatch (install with: brew install fswatch)

# Default Configuration
PI_USER="pi"
PI_HOST="raspberrypi.local"
PI_PATH="/home/pi/piDash"

# Load local configuration if it exists (overrides defaults)
if [ -f "pi-config.local.sh" ]; then
    source pi-config.local.sh
fi

echo "👀 Watching for changes..."
echo "Press Ctrl+C to stop"

# Debounce time in seconds
DEBOUNCE=3
LAST_RUN=0

# Watch for changes in app, components, config directories
fswatch -o \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    app components config services hooks utils | while read change
do
    CURRENT_TIME=$(date +%s)
    TIME_DIFF=$((CURRENT_TIME - LAST_RUN))

    if [ $TIME_DIFF -gt $DEBOUNCE ]; then
        echo ""
        echo "📝 Changes detected at $(date '+%H:%M:%S')"
        echo "🚀 Deploying..."

        # Build and deploy
        npm run build:web && \
        rsync -az --delete dist/ "$PI_USER@$PI_HOST:$PI_PATH/dist/" && \
        ssh "$PI_USER@$PI_HOST" "sudo systemctl restart pidash 2>/dev/null || pkill -f 'node.*server'" && \
        echo "✅ Deployed successfully!"

        LAST_RUN=$CURRENT_TIME
    fi
done

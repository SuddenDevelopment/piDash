#!/bin/bash
# Run this script ON the Raspberry Pi

# Configuration
REPO_PATH="/home/pi/piDash"
BRANCH="main"

cd "$REPO_PATH" || exit 1

echo "🔍 Checking for updates..."

# Fetch latest changes
git fetch origin "$BRANCH"

# Check if there are updates
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "📥 New changes found, updating..."

    # Pull changes
    git pull origin "$BRANCH"

    # Install any new dependencies
    if [ -f "package.json" ]; then
        echo "📦 Installing dependencies..."
        npm install
    fi

    # Build the project
    echo "🔨 Building..."
    npm run build:web

    # Restart service
    echo "🔄 Restarting service..."
    sudo systemctl restart pidash

    echo "✅ Update complete!"
else
    echo "✓ Already up to date"
fi

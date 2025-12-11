#!/bin/bash

# Configuration
PI_USER="pi"
PI_HOST="raspberrypi.local"
PI_PATH="/home/pi/piDash"

# Load local configuration if it exists
if [ -f "pi-config.local.sh" ]; then
    echo "📝 Loading local Pi configuration..."
    source pi-config.local.sh
fi

echo "🔧 Setting up piDash systemd service on $PI_HOST..."

# Copy service file to Pi
echo "📋 Copying service file..."
scp pidash.service "$PI_USER@$PI_HOST:/tmp/"

# Install and enable service
echo "⚙️  Installing service..."
ssh "$PI_USER@$PI_HOST" << 'EOF'
    # Move service file to systemd directory
    sudo mv /tmp/pidash.service /etc/systemd/system/

    # Set correct permissions
    sudo chmod 644 /etc/systemd/system/pidash.service

    # Reload systemd
    sudo systemctl daemon-reload

    # Enable service to start on boot
    sudo systemctl enable pidash

    # Start the service
    sudo systemctl start pidash

    # Check status
    echo "📊 Service status:"
    sudo systemctl status pidash --no-pager
EOF

echo ""
echo "✅ Service setup complete!"
echo ""
echo "📝 Useful commands:"
echo "  Check status:  ssh $PI_USER@$PI_HOST sudo systemctl status pidash"
echo "  View logs:     ssh $PI_USER@$PI_HOST sudo journalctl -u pidash -f"
echo "  Restart:       ssh $PI_USER@$PI_HOST sudo systemctl restart pidash"
echo "  Stop:          ssh $PI_USER@$PI_HOST sudo systemctl stop pidash"

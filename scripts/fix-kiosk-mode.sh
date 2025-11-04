#!/bin/bash

# Troubleshoot and Fix Kiosk Mode on Raspberry Pi
# Run this script on the Pi to diagnose and fix kiosk mode issues

echo "🔧 piDash Kiosk Mode Troubleshooter"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_step() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        return 1
    fi
}

echo "Step 1: Checking piDash service..."
echo "-----------------------------------"

# Check if service exists
if systemctl list-unit-files | grep -q pidash.service; then
    echo -e "${GREEN}✓${NC} pidash.service exists"

    # Check if enabled
    if systemctl is-enabled pidash.service &>/dev/null; then
        echo -e "${GREEN}✓${NC} Service is enabled"
    else
        echo -e "${YELLOW}⚠${NC} Service is not enabled. Enabling..."
        sudo systemctl enable pidash
        check_step "Service enabled"
    fi

    # Check if running
    if systemctl is-active pidash.service &>/dev/null; then
        echo -e "${GREEN}✓${NC} Service is running"
    else
        echo -e "${RED}✗${NC} Service is not running. Starting..."
        sudo systemctl start pidash
        sleep 2
        check_step "Service started"
    fi

    # Check service health
    if curl -sf http://localhost:3000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Service health check passed"
    else
        echo -e "${RED}✗${NC} Service health check failed"
        echo ""
        echo "Service logs (last 20 lines):"
        sudo journalctl -u pidash -n 20 --no-pager
        echo ""
    fi
else
    echo -e "${RED}✗${NC} pidash.service not found!"
    echo ""
    echo "Run the initial setup script first:"
    echo "  bash scripts/pi-initial-setup.sh"
    exit 1
fi

echo ""
echo "Step 2: Checking kiosk configuration..."
echo "----------------------------------------"

# Check if start-kiosk.sh exists
if [ -f $HOME/start-kiosk.sh ]; then
    echo -e "${GREEN}✓${NC} start-kiosk.sh exists"

    # Check if executable
    if [ -x $HOME/start-kiosk.sh ]; then
        echo -e "${GREEN}✓${NC} start-kiosk.sh is executable"
    else
        echo -e "${YELLOW}⚠${NC} start-kiosk.sh is not executable. Fixing..."
        chmod +x $HOME/start-kiosk.sh
        check_step "Made executable"
    fi
else
    echo -e "${RED}✗${NC} start-kiosk.sh not found"
    echo "Creating it now..."
    bash /tmp/setup-kiosk-mode.sh 2>/dev/null || echo "Run: bash scripts/enable-kiosk-mode.sh"
fi

# Check autostart configuration
if [ -f ~/.config/lxsession/LXDE-pi/autostart ]; then
    echo -e "${GREEN}✓${NC} autostart file exists"

    if grep -q "start-kiosk.sh" ~/.config/lxsession/LXDE-pi/autostart; then
        echo -e "${GREEN}✓${NC} start-kiosk.sh is in autostart"
    else
        echo -e "${RED}✗${NC} start-kiosk.sh not in autostart"
        echo "Re-run setup: bash scripts/enable-kiosk-mode.sh"
    fi
else
    echo -e "${RED}✗${NC} autostart file not found"
    echo "Re-run setup: bash scripts/enable-kiosk-mode.sh"
fi

# Check systemd user service
if [ -f ~/.config/systemd/user/kiosk.service ]; then
    echo -e "${GREEN}✓${NC} systemd user service exists"

    if systemctl --user is-enabled kiosk.service &>/dev/null; then
        echo -e "${GREEN}✓${NC} systemd user service is enabled"
    else
        echo -e "${YELLOW}⚠${NC} systemd user service not enabled. Enabling..."
        systemctl --user enable kiosk.service
        check_step "User service enabled"
    fi
else
    echo -e "${YELLOW}⚠${NC} systemd user service not found (optional)"
fi

echo ""
echo "Step 3: Checking startup logs..."
echo "---------------------------------"

if [ -f $HOME/kiosk-startup.log ]; then
    echo -e "${GREEN}✓${NC} Startup log exists"
    echo ""
    echo "Last 10 lines of startup log:"
    tail -n 10 $HOME/kiosk-startup.log
else
    echo -e "${YELLOW}⚠${NC} No startup log found (system hasn't rebooted since setup)"
fi

echo ""
echo "Step 4: Checking Chromium..."
echo "-----------------------------"

if command -v chromium-browser &> /dev/null; then
    echo -e "${GREEN}✓${NC} Chromium is installed"
else
    echo -e "${RED}✗${NC} Chromium not found. Installing..."
    sudo apt-get update
    sudo apt-get install -y chromium-browser
    check_step "Chromium installed"
fi

# Check if Chromium is currently running
if pgrep -f chromium-browser > /dev/null; then
    echo -e "${GREEN}✓${NC} Chromium is currently running"
else
    echo -e "${YELLOW}⚠${NC} Chromium is not running"
fi

echo ""
echo "Step 5: Testing manual startup..."
echo "----------------------------------"

echo "Testing if kiosk script can start..."
echo "(This will attempt to start Chromium in the background)"
echo ""

# Try to start it in background
DISPLAY=:0 $HOME/start-kiosk.sh &
SCRIPT_PID=$!

# Wait a moment
sleep 5

# Check if Chromium started
if pgrep -f chromium-browser > /dev/null; then
    echo -e "${GREEN}✓${NC} Chromium started successfully"

    # Kill the test instance
    pkill -f chromium-browser
    wait $SCRIPT_PID 2>/dev/null
else
    echo -e "${RED}✗${NC} Failed to start Chromium"
    echo ""
    echo "Check the log for errors:"
    cat $HOME/kiosk-startup.log
fi

echo ""
echo "Summary & Recommendations"
echo "========================="
echo ""

# Final recommendations
SERVICE_OK=false
KIOSK_OK=false

if systemctl is-active pidash.service &>/dev/null && curl -sf http://localhost:3000/health > /dev/null 2>&1; then
    SERVICE_OK=true
fi

if [ -f $HOME/start-kiosk.sh ] && [ -x $HOME/start-kiosk.sh ] && [ -f ~/.config/lxsession/LXDE-pi/autostart ]; then
    KIOSK_OK=true
fi

if $SERVICE_OK && $KIOSK_OK; then
    echo -e "${GREEN}✅ Everything looks good!${NC}"
    echo ""
    echo "If kiosk mode still doesn't work after reboot:"
    echo "1. Check logs: cat $HOME/kiosk-startup.log"
    echo "2. Check service: sudo journalctl -u pidash -f"
    echo "3. Test manually: $HOME/start-kiosk.sh"
    echo ""
    echo "To reboot and test:"
    echo "  sudo reboot"
else
    if ! $SERVICE_OK; then
        echo -e "${RED}❌ piDash service has issues${NC}"
        echo ""
        echo "Fix the service first:"
        echo "  sudo systemctl restart pidash"
        echo "  sudo journalctl -u pidash -f"
        echo ""
    fi

    if ! $KIOSK_OK; then
        echo -e "${RED}❌ Kiosk mode configuration has issues${NC}"
        echo ""
        echo "Re-run the kiosk setup from your Mac:"
        echo "  bash scripts/enable-kiosk-mode.sh"
        echo ""
    fi
fi

echo "For more help, see: docs/RASPBERRY-PI-SETUP.md"

# Kiosk Mode Troubleshooting

When Chromium doesn't auto-start on Raspberry Pi boot.

## Quick Fix (From Your Mac)

```bash
# Re-run the kiosk setup script
bash scripts/enable-kiosk-mode.sh

# Then SSH to Pi and reboot
ssh pi@raspberrypi.local 'sudo reboot'
```

## Troubleshooting on the Pi

SSH into your Raspberry Pi and run these commands:

### 1. Run the Auto-Fix Script

```bash
bash scripts/fix-kiosk-mode.sh
```

This script will:
- Check if piDash service is running
- Verify kiosk configuration files
- Check startup logs
- Test manual startup
- Provide specific fix recommendations

### 2. Check Service Status

```bash
# Check if piDash service is running
sudo systemctl status pidash

# If not running, start it
sudo systemctl start pidash

# Check the service logs
sudo journalctl -u pidash -f
```

### 3. Check Kiosk Startup Logs

```bash
# View the kiosk startup log
cat /home/pi/kiosk-startup.log

# Watch for errors in real-time (after reboot)
tail -f /home/pi/kiosk-startup.log
```

### 4. Test Manual Startup

```bash
# Try starting kiosk mode manually
/home/pi/start-kiosk.sh
```

This should open Chromium in kiosk mode. If it works manually but not on boot, the issue is with autostart configuration.

## Common Issues & Solutions

### Issue 1: Service Not Running

**Symptoms:**
- Chromium starts but shows error page
- Health check fails

**Solution:**
```bash
# Restart the service
sudo systemctl restart pidash

# Check for errors
sudo journalctl -u pidash -n 50
```

### Issue 2: Chromium Doesn't Start

**Symptoms:**
- Desktop loads but no Chromium
- `/home/pi/kiosk-startup.log` shows "Service failed to start"

**Solution:**
```bash
# Check if service is enabled to start on boot
sudo systemctl enable pidash

# Reboot
sudo reboot
```

### Issue 3: Network Timeout

**Symptoms:**
- Log shows "WARNING: Network timeout"
- Takes very long to start

**Solution:**
```bash
# Check WiFi configuration
iwconfig

# Test connectivity
ping -c 4 8.8.8.8

# Run WiFi monitor check manually
bash /home/pi/check_wifi.sh
```

### Issue 4: Autostart Not Running

**Symptoms:**
- `/home/pi/start-kiosk.sh` works manually
- But doesn't run on boot

**Solution:**
```bash
# Check autostart file
cat ~/.config/lxsession/LXDE-pi/autostart

# Should contain:
# @/home/pi/start-kiosk.sh

# If missing, re-run setup from Mac:
# bash scripts/enable-kiosk-mode.sh
```

### Issue 5: Display/X Server Issues

**Symptoms:**
- Log shows waiting for X server
- Black screen after boot

**Solution:**
```bash
# Check if X server is running
echo $DISPLAY

# Should output: :0

# If not, check desktop environment
ps aux | grep lxsession

# Ensure autologin is enabled
cat /etc/lightdm/lightdm.conf | grep autologin
```

## Configuration Files

### Key Files to Check

1. **Service Definition**
   ```bash
   /etc/systemd/system/pidash.service
   ```

2. **Kiosk Startup Script**
   ```bash
   /home/pi/start-kiosk.sh
   ```

3. **Autostart Configuration**
   ```bash
   ~/.config/lxsession/LXDE-pi/autostart
   ```

4. **Systemd User Service (backup method)**
   ```bash
   ~/.config/systemd/user/kiosk.service
   ```

5. **Startup Log**
   ```bash
   /home/pi/kiosk-startup.log
   ```

## Manual Configuration Steps

If auto-setup fails, you can configure manually:

### 1. Ensure Service Runs on Boot

```bash
sudo systemctl enable pidash
sudo systemctl start pidash

# Verify it's working
curl http://localhost:3000/health
```

### 2. Configure Autostart

```bash
mkdir -p ~/.config/lxsession/LXDE-pi

cat > ~/.config/lxsession/LXDE-pi/autostart << 'EOF'
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@xscreensaver -no-splash
@/home/pi/start-kiosk.sh
EOF
```

### 3. Verify Script is Executable

```bash
chmod +x /home/pi/start-kiosk.sh
```

### 4. Reboot and Test

```bash
sudo reboot
```

## Monitoring After Reboot

After rebooting, wait 1-2 minutes then check:

```bash
# From your Mac
ssh pi@raspberrypi.local 'cat /home/pi/kiosk-startup.log'

# Check if Chromium is running
ssh pi@raspberrypi.local 'pgrep -f chromium-browser'

# Check service status
ssh pi@raspberrypi.local 'systemctl status pidash'
```

## Advanced Debugging

### Enable Detailed Logging

Edit `/home/pi/start-kiosk.sh` and add `set -x` at the top:

```bash
#!/bin/bash
set -x  # Enable debug mode
# ... rest of script
```

### Check System Logs

```bash
# All boot logs
journalctl -b

# Desktop environment logs
journalctl -b | grep lxsession

# Display manager logs
cat /var/log/lightdm/lightdm.log
```

### Test Chromium Separately

```bash
# Start Chromium manually with kiosk flags
DISPLAY=:0 chromium-browser --kiosk http://localhost:3000 &
```

## Complete Reset

If nothing works, reset everything:

```bash
# From your Mac
bash scripts/enable-kiosk-mode.sh

# SSH to Pi
ssh pi@raspberrypi.local

# On the Pi - verify service is running
sudo systemctl status pidash

# Reboot
sudo reboot
```

## Getting Help

If issues persist:

1. **Collect diagnostic info:**
   ```bash
   bash scripts/fix-kiosk-mode.sh > kiosk-diagnostics.txt
   cat /home/pi/kiosk-startup.log >> kiosk-diagnostics.txt
   sudo journalctl -u pidash -n 50 >> kiosk-diagnostics.txt
   ```

2. **Check the diagnostic file:**
   ```bash
   cat kiosk-diagnostics.txt
   ```

3. **Common patterns:**
   - "Service is not running" → Check pidash service
   - "Network timeout" → Check WiFi/network
   - "Waiting for X server" → Check desktop autologin
   - "curl: command not found" → Install curl: `sudo apt install curl`

## Prevention

To prevent kiosk mode from breaking:

1. **Don't manually edit system files** without backup
2. **Use the provided scripts** for configuration
3. **Check logs after updates** - `cat /home/pi/kiosk-startup.log`
4. **Keep service running** - `sudo systemctl enable pidash`

## Files Modified by Setup

The kiosk setup modifies these files:

- `/home/pi/start-kiosk.sh` - Startup script (created)
- `~/.config/lxsession/LXDE-pi/autostart` - Desktop autostart (modified)
- `~/.config/systemd/user/kiosk.service` - User service (created)
- `/home/pi/kiosk-startup.log` - Startup log (created)

Backups are created automatically with timestamp:
- `~/.config/lxsession/LXDE-pi/autostart.backup.YYYYMMDD_HHMMSS`

## Summary of Commands

```bash
# From Mac - Fix kiosk mode
bash scripts/enable-kiosk-mode.sh

# On Pi - Diagnose issues
bash scripts/fix-kiosk-mode.sh

# On Pi - Check logs
cat /home/pi/kiosk-startup.log
sudo journalctl -u pidash -f

# On Pi - Test manually
/home/pi/start-kiosk.sh

# On Pi - Restart everything
sudo systemctl restart pidash
sudo reboot
```

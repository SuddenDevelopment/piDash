# GitHub Actions Auto-Deploy Setup

This guide will set up automatic deployment to your Raspberry Pi whenever you push to the main branch.

## 🎯 What This Does

Every time you push code to the `main` branch:
1. ✅ GitHub Actions builds your production bundle
2. ✅ Syncs files to your Raspberry Pi via SSH
3. ✅ Restarts the pidash service
4. ✅ Verifies the deployment worked

**Push to GitHub → Auto-deploy to Pi in ~2 minutes!**

---

## 📝 One-Time Setup

### Step 1: Generate SSH Key for GitHub Actions

On your Mac, generate a dedicated SSH key for deployments:

```bash
# Generate a new SSH key (no passphrase for automation)
ssh-keygen -t ed25519 -C "github-actions@pidash" -f ~/.ssh/pidash_deploy_key -N ""

# This creates:
# - Private key: ~/.ssh/pidash_deploy_key
# - Public key: ~/.ssh/pidash_deploy_key.pub
```

### Step 2: Add Public Key to Your Pi

Copy the public key to your Raspberry Pi:

```bash
# Copy the public key to your Pi
ssh-copy-id -i ~/.ssh/pidash_deploy_key.pub admin@192.168.1.166

# Or manually:
cat ~/.ssh/pidash_deploy_key.pub | ssh admin@192.168.1.166 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'
```

Test the connection:

```bash
ssh -i ~/.ssh/pidash_deploy_key admin@192.168.1.166 'echo "SSH key working!"'
```

### Step 3: Get Your Private Key Content

Display your private key (you'll need this for GitHub):

```bash
cat ~/.ssh/pidash_deploy_key
```

**Copy the ENTIRE output**, including:
- `-----BEGIN OPENSSH PRIVATE KEY-----`
- All the key content
- `-----END OPENSSH PRIVATE KEY-----`

### Step 4: Configure GitHub Secrets

Go to your GitHub repository:

**https://github.com/SuddenDevelopment/piDash/settings/secrets/actions**

Click **"New repository secret"** and add these **4 secrets**:

#### 1. `PI_SSH_KEY`
- **Name:** `PI_SSH_KEY`
- **Value:** Paste the ENTIRE private key from Step 3
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
  ...
  -----END OPENSSH PRIVATE KEY-----
  ```

#### 2. `PI_HOST`
- **Name:** `PI_HOST`
- **Value:** `192.168.1.166`

#### 3. `PI_USER`
- **Name:** `PI_USER`
- **Value:** `admin`

#### 4. `PI_PATH`
- **Name:** `PI_PATH`
- **Value:** `/home/admin/piDash`

### Step 5: Grant Passwordless Sudo (For Service Restart)

On your Pi, allow the admin user to restart the service without a password:

```bash
# SSH to your Pi
ssh admin@192.168.1.166

# Create sudoers file for pidash service
sudo tee /etc/sudoers.d/pidash << 'EOF'
admin ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart pidash
admin ALL=(ALL) NOPASSWD: /usr/bin/systemctl status pidash
EOF

# Set proper permissions
sudo chmod 0440 /etc/sudoers.d/pidash

# Test it works
sudo systemctl restart pidash
# Should not ask for password
```

---

## ✅ Verify Setup

### Test the Workflow

1. **Make a small change:**
   ```bash
   # Edit the dashboard
   nano app/index.tsx
   # Change something small, like the subtitle text
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Test auto-deploy"
   git push origin main
   ```

3. **Watch the deployment:**
   - Go to: https://github.com/SuddenDevelopment/piDash/actions
   - Click on your latest workflow run
   - Watch it build and deploy!

### Check the Dashboard

After ~2 minutes:
- Visit: http://192.168.1.166:3000
- Your changes should be live!

---

## 🔍 Troubleshooting

### "Permission denied (publickey)"

**Problem:** GitHub Actions can't SSH to Pi

**Solution:**
```bash
# Verify the public key is on the Pi
ssh admin@192.168.1.166 'cat ~/.ssh/authorized_keys | grep github-actions'

# Re-copy if needed
ssh-copy-id -i ~/.ssh/pidash_deploy_key.pub admin@192.168.1.166
```

### "sudo: a password is required"

**Problem:** Service restart requires password

**Solution:**
```bash
# SSH to Pi and create sudoers file
ssh admin@192.168.1.166
sudo tee /etc/sudoers.d/pidash << 'EOF'
admin ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart pidash
admin ALL=(ALL) NOPASSWD: /usr/bin/systemctl status pidash
EOF
sudo chmod 0440 /etc/sudoers.d/pidash
```

### Workflow Fails on Health Check

**Problem:** Dashboard not responding after deployment

**Check:**
```bash
# SSH to Pi and check service
ssh admin@192.168.1.166 'sudo systemctl status pidash'

# Check logs
ssh admin@192.168.1.166 'sudo journalctl -u pidash -n 50'
```

### Need to Update Secrets?

If your Pi IP changes or you need to update credentials:

1. Go to: https://github.com/SuddenDevelopment/piDash/settings/secrets/actions
2. Click the secret name
3. Click "Update"
4. Enter new value
5. Save

---

## 🎯 Workflow Details

### What Triggers Deployment?

- ✅ Push to `main` branch
- ✅ Changes to code files (`.ts`, `.tsx`, `.js`, `.json`)
- ❌ Changes to documentation (`.md` files) - skipped

### What Gets Deployed?

```
dist/                    # Production build
  ├── index.html
  ├── _expo/
  │   └── static/
  │       └── js/
  └── assets/
```

### Deployment Steps

1. **Build** - Runs `npm run build:web`
2. **Sync** - Rsync `dist/` to Pi
3. **Restart** - Restarts pidash service
4. **Verify** - Checks service status & health endpoint

### Deployment Time

- **Total:** ~2 minutes
  - Build: ~30 seconds
  - Deploy: ~10 seconds
  - Verification: ~10 seconds

---

## 🚀 Usage

### Normal Development Workflow

**Option 1: Auto-Deploy (Slower but Hands-Off)**
```bash
# Edit code
nano app/index.tsx

# Push to GitHub
git add .
git commit -m "Update dashboard"
git push origin main

# Wait ~2 minutes, check Pi display
# Changes are live automatically!
```

**Option 2: Manual Deploy (Faster)**
```bash
# Edit code
nano app/index.tsx

# Deploy directly from Mac
npm run deploy:pi

# Changes live in ~10 seconds!
```

### When to Use Each Method

**Use Auto-Deploy (GitHub Actions) when:**
- ✅ Working remotely (not on local network)
- ✅ Want deployment history/logs
- ✅ Multiple team members deploying
- ✅ Want automated testing before deploy

**Use Manual Deploy when:**
- ✅ On local network with Pi
- ✅ Need instant feedback (~10 sec vs 2 min)
- ✅ Iterating quickly on design
- ✅ Testing/debugging

---

## 📊 Monitoring Deployments

### View Deployment History

https://github.com/SuddenDevelopment/piDash/actions

### Check Last Deployment

```bash
# On your Mac
gh run list --limit 5

# View specific run
gh run view <run-id>
```

### Get Deployment Notifications

1. Go to: https://github.com/SuddenDevelopment/piDash/settings/notifications
2. Configure email/Slack notifications for Actions

---

## 🔐 Security Notes

### SSH Key Safety

- ✅ Dedicated key only for deployments
- ✅ Stored securely in GitHub Secrets (encrypted)
- ✅ Only accessible to repository workflows
- ✅ Separate from your personal SSH key

### Network Security

- ⚠️ **Important:** Your Pi must be accessible from the internet for GitHub Actions to work
- **Alternative:** Use a GitHub self-hosted runner on your local network
- **Best Practice:** Use VPN or firewall rules to restrict SSH access

### Sudo Access

- Only grants permission to restart `pidash` service
- Does not grant full sudo access
- Can be revoked anytime by deleting `/etc/sudoers.d/pidash`

---

## 🛠️ Advanced Configuration

### Deploy on Pull Request

Edit `.github/workflows/deploy-to-pi.yml`:

```yaml
on:
  push:
    branches:
      - main
  pull_request:  # Add this
    branches:
      - main
```

### Deploy to Multiple Pis

Add secrets for each Pi:
- `PI_HOST_1`, `PI_HOST_2`, etc.
- Create separate jobs in workflow

### Add Slack Notifications

Install Slack GitHub app:
- https://github.com/marketplace/slack-github

---

## 📚 Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Workflow File:** `.github/workflows/deploy-to-pi.yml`
- **Secrets Configuration:** https://github.com/SuddenDevelopment/piDash/settings/secrets/actions

---

## ✅ Quick Reference

### GitHub Secrets (Required)
```
PI_SSH_KEY  → Your private SSH key content
PI_HOST     → 192.168.1.166
PI_USER     → admin
PI_PATH     → /home/admin/piDash
```

### SSH Key Location
```
~/.ssh/pidash_deploy_key      → Private key
~/.ssh/pidash_deploy_key.pub  → Public key
```

### Sudoers File
```
/etc/sudoers.d/pidash
```

---

**Your Pi will now auto-deploy on every push to main! 🎉**

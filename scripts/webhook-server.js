// Simple webhook server for Raspberry Pi
// Run this on the Pi to receive deployment webhooks

const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();
const PORT = 9000;
const SECRET = process.env.WEBHOOK_SECRET || 'change-me-in-production';

app.use(express.json());

// Webhook endpoint
app.post('/deploy', (req, res) => {
  // Optional: Verify webhook signature
  const signature = req.headers['x-hub-signature-256'];
  if (signature) {
    const expectedSignature = 'sha256=' +
      crypto.createHmac('sha256', SECRET)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(401).send('Invalid signature');
    }
  }

  console.log('📥 Deployment webhook received');

  // Run update script
  exec('/home/pi/piDash/scripts/pi-auto-update.sh', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Deployment failed:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log(stdout);
    if (stderr) console.error(stderr);

    res.json({
      success: true,
      message: 'Deployment started',
      timestamp: new Date().toISOString()
    });
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`🎣 Webhook server listening on port ${PORT}`);
});

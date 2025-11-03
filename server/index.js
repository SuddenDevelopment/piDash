const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Read version info at startup
let versionInfo = { buildNumber: 0, version: 'unknown' };
try {
  const versionPath = path.join(__dirname, '../config/version.ts');
  if (fs.existsSync(versionPath)) {
    const versionContent = fs.readFileSync(versionPath, 'utf8');
    const match = versionContent.match(/buildNumber:\s*(\d+)/);
    if (match) {
      versionInfo.buildNumber = parseInt(match[1], 10);
      versionInfo.version = `build #${versionInfo.buildNumber}`;
    }
  }
} catch (error) {
  console.warn('Could not read version info:', error.message);
}

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Version check endpoint for auto-reload
app.get('/api/version', (req, res) => {
  res.json(versionInfo);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: versionInfo.version,
    buildNumber: versionInfo.buildNumber,
  });
});

// API endpoint for system info (example)
app.get('/api/system', (req, res) => {
  res.json({
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    memory: {
      total: Math.round(require('os').totalmem() / 1024 / 1024),
      free: Math.round(require('os').freemem() / 1024 / 1024),
    },
    uptime: Math.round(require('os').uptime()),
  });
});

// Handle client-side routing - serve index.html for all routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🥧 piDash server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 System info: http://localhost:${PORT}/api/system`);
});

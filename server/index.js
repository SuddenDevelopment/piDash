const express = require('express');
const path = require('path');
const app = express();

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '0.1.0',
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

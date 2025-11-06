/**
 * Configuration API Server
 *
 * Provides REST endpoints for managing dashboard configurations
 * - GET /api/config - Load current dashboard config
 * - POST /api/config - Save dashboard config
 * - GET /api/css - Load current CSS theme
 * - POST /api/css - Save CSS theme
 * - POST /api/dashboard/restart - Restart dashboard
 * - POST /api/dashboard/refresh - Trigger dashboard refresh
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const os = require('os');

const app = express();
const PORT = 3001;

// Get local network IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const LOCAL_IP = getLocalIpAddress();
const BASE_URL = `http://${LOCAL_IP}:${PORT}`;
console.log(`Server base URL: ${BASE_URL}`);

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/images');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Preserve original filename with timestamp to avoid collisions
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${timestamp}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'));
  }
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve uploaded images
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Paths
const CONFIG_PATH = path.join(__dirname, '../config/dashboards/custom-dashboard.json');
const DEFAULT_CONFIG_PATH = path.join(__dirname, '../config/dashboards/mvp-test.json');
const CSS_PATH = path.join(__dirname, '../public/styles/dashboard-theme.css');

// Helper: Ensure directories exist
async function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error('Error creating directory:', error);
  }
}

// Deployment version tracking
let deploymentVersion = Date.now();
const VERSION_FILE = path.join(__dirname, '../.deployment-version');

// Load or create version file
async function loadVersion() {
  try {
    const content = await fs.readFile(VERSION_FILE, 'utf-8');
    deploymentVersion = parseInt(content.trim()) || Date.now();
  } catch (error) {
    // File doesn't exist, create it
    deploymentVersion = Date.now();
    await fs.writeFile(VERSION_FILE, String(deploymentVersion), 'utf-8');
  }
}

// Initialize version on startup
loadVersion();

// Helper: Read file with fallback
async function readFileWithFallback(primaryPath, fallbackPath) {
  try {
    const content = await fs.readFile(primaryPath, 'utf-8');
    return { content, source: 'custom' };
  } catch (error) {
    if (error.code === 'ENOENT' && fallbackPath) {
      try {
        const content = await fs.readFile(fallbackPath, 'utf-8');
        return { content, source: 'default' };
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
    throw error;
  }
}

// GET /api/config - Load dashboard configuration
app.get('/api/config', async (req, res) => {
  try {
    const { content, source } = await readFileWithFallback(CONFIG_PATH, DEFAULT_CONFIG_PATH);
    const config = JSON.parse(content);

    res.json({
      success: true,
      source,
      config,
      paths: {
        custom: CONFIG_PATH,
        default: DEFAULT_CONFIG_PATH
      }
    });
  } catch (error) {
    console.error('Error loading config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load configuration',
      details: error.message
    });
  }
});

// POST /api/config - Save dashboard configuration
app.post('/api/config', async (req, res) => {
  try {
    const { config } = req.body;

    if (!config) {
      return res.status(400).json({
        success: false,
        error: 'Missing config in request body'
      });
    }

    // Validate JSON structure
    if (!config.version || !config.pages) {
      return res.status(400).json({
        success: false,
        error: 'Invalid config structure. Must include version and pages.'
      });
    }

    // Ensure directory exists
    await ensureDirectoryExists(CONFIG_PATH);

    // Write config
    await fs.writeFile(
      CONFIG_PATH,
      JSON.stringify(config, null, 2),
      'utf-8'
    );

    res.json({
      success: true,
      message: 'Configuration saved successfully',
      path: CONFIG_PATH,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save configuration',
      details: error.message
    });
  }
});

// GET /api/css - Load CSS theme
app.get('/api/css', async (req, res) => {
  try {
    const content = await fs.readFile(CSS_PATH, 'utf-8');

    res.json({
      success: true,
      css: content,
      path: CSS_PATH
    });
  } catch (error) {
    console.error('Error loading CSS:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load CSS',
      details: error.message
    });
  }
});

// POST /api/css - Save CSS theme
app.post('/api/css', async (req, res) => {
  try {
    const { css } = req.body;

    if (css === undefined || css === null) {
      return res.status(400).json({
        success: false,
        error: 'Missing css in request body'
      });
    }

    await fs.writeFile(CSS_PATH, css, 'utf-8');

    res.json({
      success: true,
      message: 'CSS saved successfully',
      path: CSS_PATH,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving CSS:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save CSS',
      details: error.message
    });
  }
});

// POST /api/dashboard/refresh - Trigger dashboard refresh
app.post('/api/dashboard/refresh', async (req, res) => {
  try {
    // Write a refresh signal file that the dashboard can watch
    const refreshSignalPath = path.join(__dirname, '../.refresh-signal');
    await fs.writeFile(refreshSignalPath, Date.now().toString(), 'utf-8');

    res.json({
      success: true,
      message: 'Refresh signal sent',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error triggering refresh:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger refresh',
      details: error.message
    });
  }
});

// GET /api/status - Health check
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'running',
    version: '1.0.0',
    deploymentVersion,
    timestamp: new Date().toISOString()
  });
});

// GET /api/version - Get current deployment version
app.get('/api/version', (req, res) => {
  res.json({
    success: true,
    version: deploymentVersion,
    timestamp: new Date().toISOString()
  });
});

// POST /api/version/bump - Bump deployment version (trigger refresh)
app.post('/api/version/bump', async (req, res) => {
  try {
    deploymentVersion = Date.now();
    await fs.writeFile(VERSION_FILE, String(deploymentVersion), 'utf-8');

    res.json({
      success: true,
      message: 'Deployment version bumped',
      version: deploymentVersion,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error bumping version:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bump version',
      details: error.message
    });
  }
});

// GET /api/images - List all uploaded images
app.get('/api/images', async (req, res) => {
  try {
    const imagesDir = path.join(__dirname, '../public/images');

    // Ensure directory exists
    try {
      await fs.mkdir(imagesDir, { recursive: true });
    } catch (err) {
      // Directory might already exist, that's fine
    }

    const files = await fs.readdir(imagesDir);

    // Filter out non-image files and README
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const images = [];

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.includes(ext)) {
        const filePath = path.join(imagesDir, file);
        const stats = await fs.stat(filePath);

        images.push({
          filename: file,
          url: `${BASE_URL}/images/${file}`,
          size: stats.size,
          uploadedAt: stats.mtime
        });
      }
    }

    // Sort by upload date, newest first
    images.sort((a, b) => b.uploadedAt - a.uploadedAt);

    res.json({
      success: true,
      images,
      count: images.length
    });
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list images',
      details: error.message
    });
  }
});

// POST /api/images/upload - Upload a new image
app.post('/api/images/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      image: {
        filename: req.file.filename,
        url: `${BASE_URL}/images/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image',
      details: error.message
    });
  }
});

// DELETE /api/images/:filename - Delete an image
app.delete('/api/images/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../public/images', filename);

    // Security check: ensure filename doesn't contain path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename'
      });
    }

    // Don't allow deleting README
    if (filename === 'README.md') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete README file'
      });
    }

    await fs.unlink(filePath);

    res.json({
      success: true,
      message: 'Image deleted successfully',
      filename
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete image',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  PiDash Configuration API Server                      ║
╠════════════════════════════════════════════════════════╣
║  Status: Running                                       ║
║  Port: ${PORT}                                             ║
║  Access: http://localhost:${PORT}                         ║
║                                                        ║
║  Endpoints:                                            ║
║  - GET  /api/config             Load dashboard config ║
║  - POST /api/config             Save dashboard config ║
║  - GET  /api/css                Load CSS theme        ║
║  - POST /api/css                Save CSS theme        ║
║  - GET  /api/images             List uploaded images  ║
║  - POST /api/images/upload      Upload new image      ║
║  - DELETE /api/images/:filename Delete image          ║
║  - POST /api/dashboard/refresh  Trigger refresh       ║
║  - GET  /api/status             Health check          ║
║  - GET  /api/version            Get version           ║
║  - POST /api/version/bump       Bump version          ║
╚════════════════════════════════════════════════════════╝
  `);
});

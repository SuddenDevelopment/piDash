/**
 * Prepare Config Script
 *
 * Determines which config to embed in the build:
 * 1. Check if custom-dashboard.json exists
 * 2. If yes, copy it as the active config
 * 3. If no, use mvp-test.json as the active config
 *
 * This ensures the build always prioritizes custom config.
 */

const fs = require('fs');
const path = require('path');

const CUSTOM_CONFIG_PATH = path.join(__dirname, '../config/dashboards/custom-dashboard.json');
const DEFAULT_CONFIG_PATH = path.join(__dirname, '../config/dashboards/mvp-test.json');
const ACTIVE_CONFIG_PATH = path.join(__dirname, '../config/dashboards/active-dashboard.json');

console.log('🔍 Determining which config to embed...');

try {
  // Check if custom config exists
  if (fs.existsSync(CUSTOM_CONFIG_PATH)) {
    // Use custom config
    const customConfig = fs.readFileSync(CUSTOM_CONFIG_PATH, 'utf-8');
    fs.writeFileSync(ACTIVE_CONFIG_PATH, customConfig);
    console.log('✅ Using CUSTOM config for build');
    console.log(`   Source: ${CUSTOM_CONFIG_PATH}`);
  } else {
    // Use default config
    const defaultConfig = fs.readFileSync(DEFAULT_CONFIG_PATH, 'utf-8');
    fs.writeFileSync(ACTIVE_CONFIG_PATH, defaultConfig);
    console.log('ℹ️  Using DEFAULT config for build (custom not found)');
    console.log(`   Source: ${DEFAULT_CONFIG_PATH}`);
  }

  console.log(`   Output: ${ACTIVE_CONFIG_PATH}`);
  console.log('');
} catch (error) {
  console.error('❌ Error preparing config:', error.message);
  process.exit(1);
}

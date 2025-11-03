#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Get git commit count (build number)
  const buildNumber = execSync('git rev-list --count HEAD')
    .toString()
    .trim();

  // Get short git SHA
  const gitSha = execSync('git rev-parse --short HEAD')
    .toString()
    .trim();

  // Get current timestamp
  const buildTime = new Date().toISOString();

  const versionInfo = {
    buildNumber: parseInt(buildNumber, 10),
    gitSha,
    buildTime,
    version: `build #${buildNumber}`,
  };

  // Write to config directory
  const outputPath = path.join(__dirname, '../config/version.ts');
  const content = `// Auto-generated file - do not edit manually
// Generated at build time from git commit info

export const VERSION_INFO = ${JSON.stringify(versionInfo, null, 2)} as const;

export const getVersionString = () => VERSION_INFO.version;
export const getBuildNumber = () => VERSION_INFO.buildNumber;
export const getGitSha = () => VERSION_INFO.gitSha;
`;

  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`✅ Generated version info: ${versionInfo.version} (${gitSha})`);
} catch (error) {
  console.error('❌ Failed to generate version info:', error.message);

  // Fallback version info if git is not available
  const fallbackVersion = {
    buildNumber: 0,
    gitSha: 'unknown',
    buildTime: new Date().toISOString(),
    version: 'build #0',
  };

  const outputPath = path.join(__dirname, '../config/version.ts');
  const content = `// Auto-generated file - fallback version

export const VERSION_INFO = ${JSON.stringify(fallbackVersion, null, 2)} as const;

export const getVersionString = () => VERSION_INFO.version;
export const getBuildNumber = () => VERSION_INFO.buildNumber;
export const getGitSha = () => VERSION_INFO.gitSha;
`;

  fs.writeFileSync(outputPath, content, 'utf8');
  console.log('⚠️  Using fallback version info');
}

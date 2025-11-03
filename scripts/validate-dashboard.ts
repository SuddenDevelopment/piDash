#!/usr/bin/env tsx

/**
 * Validate dashboard JSON configurations
 * Usage: npx tsx scripts/validate-dashboard.ts <path-to-json>
 */

import fs from 'fs';
import path from 'path';
import { validateDashboardConfig } from '../lib/dashboard-validator';

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npx tsx scripts/validate-dashboard.ts <path-to-json>');
    console.error('Example: npx tsx scripts/validate-dashboard.ts config/dashboards/system-monitor.json');
    process.exit(1);
  }

  const filePath = args[0];
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: File not found: ${absolutePath}`);
    process.exit(1);
  }

  console.log(`Validating: ${absolutePath}\n`);

  try {
    const content = fs.readFileSync(absolutePath, 'utf-8');
    const config = JSON.parse(content);

    const result = validateDashboardConfig(config);

    if (result.valid) {
      console.log('✅ Configuration is valid!\n');
      console.log(`Pages: ${result.data.pages.length}`);
      console.log(`Initial Page: ${result.data.navigation.initialPage}`);
      console.log(`Data Sources: ${Object.keys(result.data.dataSources).length}`);
      console.log(`Global Events: ${result.data.globalEvents?.length || 0}`);

      console.log('\nPages:');
      result.data.pages.forEach((page, index) => {
        console.log(`  ${index + 1}. ${page.name} (${page.id})`);
        console.log(`     Panels: ${page.panels.length}`);
      });

      process.exit(0);
    } else {
      console.error('❌ Validation failed!\n');
      console.error(`Found ${result.errors.length} errors:\n`);

      result.errors.forEach((error, index) => {
        console.error(`${index + 1}. Path: ${error.path || 'root'}`);
        console.error(`   Error: ${error.message}`);
        console.error(`   Code: ${error.code}\n`);
      });

      process.exit(1);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('❌ Invalid JSON syntax:');
      console.error(error.message);
    } else if (error instanceof Error) {
      console.error('❌ Validation error:');
      console.error(error.message);
    } else {
      console.error('❌ Unknown error:', error);
    }
    process.exit(1);
  }
}

main();

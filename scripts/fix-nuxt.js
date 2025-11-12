#!/usr/bin/env node
// Quick fix script to ensure all required Nuxt files exist

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nuxtDir = path.join(__dirname, '..', '.nuxt');

// Ensure .nuxt directory exists
if (!fs.existsSync(nuxtDir)) {
  fs.mkdirSync(nuxtDir, { recursive: true });
}

// Ensure manifest directory exists
const manifestDir = path.join(nuxtDir, 'manifest', 'meta');
if (!fs.existsSync(manifestDir)) {
  fs.mkdirSync(manifestDir, { recursive: true });
}

// Create dev.json if it doesn't exist
const devJsonPath = path.join(manifestDir, 'dev.json');
if (!fs.existsSync(devJsonPath)) {
  fs.writeFileSync(devJsonPath, JSON.stringify({ buildId: 'dev', appId: 'MenuPika' }, null, 2));
  console.log('✅ Created .nuxt/manifest/meta/dev.json');
}

// Check if tsconfig files exist
const requiredFiles = [
  'tsconfig.app.json',
  'tsconfig.shared.json',
  'tsconfig.node.json'
];

let missing = [];
requiredFiles.forEach(file => {
  const filePath = path.join(nuxtDir, file);
  if (!fs.existsSync(filePath)) {
    missing.push(file);
  }
});

if (missing.length > 0) {
  console.log('⚠️  Missing files:', missing.join(', '));
  console.log('Run: npm run postinstall');
} else {
  console.log('✅ All required files exist');
}

console.log('✅ Fix script completed');


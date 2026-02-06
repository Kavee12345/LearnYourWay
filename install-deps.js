#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const projectRoot = __dirname;

console.log('📦 Installing project dependencies...\n');

try {
  console.log('[1/3] Installing mysql2 and dotenv in project root...');
  execSync('npm install mysql2 dotenv', { cwd: projectRoot, stdio: 'inherit' });

  console.log('\n[2/3] Installing backend dependencies...');
  execSync('npm install', { cwd: path.join(projectRoot, 'backend'), stdio: 'inherit' });

  console.log('\n[3/3] Installing frontend dependencies...');
  execSync('npm install', { cwd: path.join(projectRoot, 'frontend'), stdio: 'inherit' });

  console.log('\n✅ All dependencies installed!\n');
  console.log('Next step: Run "node setup-db.js" to setup the database\n');
} catch (err) {
  console.error('\n❌ Installation failed:', err.message);
  process.exit(1);
}

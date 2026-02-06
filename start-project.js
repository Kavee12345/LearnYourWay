#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const backendDir = path.join(projectRoot, 'backend');
const frontendDir = path.join(projectRoot, 'frontend');

console.log('🚀 Learn Your Way Educational Suite - Project Launcher\n');

/**
 * Run a command in a specific directory
 */
function runCommand(command, args, cwd, name) {
  return new Promise((resolve, reject) => {
    console.log(`📦 ${name}...`);
    
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    child.on('error', (err) => {
      console.error(`❌ ${name} failed:`, err.message);
      reject(err);
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${name} completed\n`);
        resolve();
      } else {
        reject(new Error(`${name} exited with code ${code}`));
      }
    });
  });
}

/**
 * Setup phase
 */
async function setup() {
  try {
    // 1. Install frontend dependencies
    await runCommand('npm', ['install'], frontendDir, 'Installing frontend dependencies');

    // 2. Setup database
    console.log('🗄️  Setting up database...');
    const setupDbScript = path.join(projectRoot, 'setup-db.js');
    await runCommand('node', [setupDbScript], projectRoot, 'Database setup');

    console.log('\n✨ Setup complete! Starting servers...\n');
    return true;
  } catch (err) {
    console.error('\n❌ Setup failed:', err.message);
    return false;
  }
}

/**
 * Start servers
 */
function startServers() {
  // Start backend
  console.log('🚀 Starting backend server...');
  const backend = spawn('npm', ['run', 'dev'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true
  });

  backend.on('error', (err) => {
    console.error('❌ Backend server error:', err.message);
  });

  // Start frontend
  console.log('🚀 Starting frontend server...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: frontendDir,
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (err) => {
    console.error('❌ Frontend server error:', err.message);
  });

  console.log('\n📍 Services will be available at:');
  console.log('   Backend:  http://localhost:5000');
  console.log('   Frontend: http://localhost:3000\n');

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });
}

/**
 * Main execution
 */
async function main() {
  const setupSuccess = await setup();
  if (setupSuccess) {
    startServers();
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

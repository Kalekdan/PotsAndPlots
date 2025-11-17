#!/usr/bin/env node

const { spawn } = require('child_process');

function checkPnpmInstalled() {
  return new Promise((resolve) => {
    const child = spawn('pnpm', ['--version'], { stdio: 'ignore' });
    child.on('close', (code) => {
      resolve(code === 0);
    });
    child.on('error', () => {
      resolve(false);
    });
  });
}

function runCommand(command, args, cwd = '.') {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      resolve(code);
    });
    
    child.on('error', (err) => {
      console.error(`Error running ${command}: ${err.message}`);
      resolve(1);
    });
  });
}

async function startCommand() {
  try {
    // Check if pnpm is installed
    const pnpmInstalled = await checkPnpmInstalled();
    if (!pnpmInstalled) {
      console.log('pnpm not found, installing pnpm globally...');
      const npmInstallCode = await runCommand('npm', ['install', '-g', 'pnpm']);
      if (npmInstallCode !== 0) {
        console.error('Failed to install pnpm');
        return npmInstallCode;
      }
    }
    
    // Run pnpm install
    console.log('Running pnpm install...');
    const installCode = await runCommand('pnpm', ['install']);
    if (installCode !== 0) {
      return installCode;
    }
    
    // Run pnpm start
    console.log('Starting development server...');
    const startCode = await runCommand('pnpm', ['start']);
    return startCode;
  } catch (error) {
    console.error('Failed to start development server');
    return 1;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command !== 'start') {
    console.error('Usage: potsandplots start');
    process.exit(1);
  }
  
  const exitCode = await startCommand();
  process.exit(exitCode);
}

if (require.main === module) {
  main();
}
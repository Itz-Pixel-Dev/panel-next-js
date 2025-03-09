#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the current directory
const rootDir = path.resolve(__dirname, '..');

// Clean up function
function cleanUp() {
  console.log("🧹 Cleaning up Prisma environment...");
  const paths = [
    path.join(rootDir, 'prisma', 'dev.db'),
    path.join(rootDir, 'prisma', 'dev.db-journal'),
    path.join(rootDir, 'prisma', 'migrations'),
    path.join(rootDir, 'node_modules', '.prisma')
  ];

  for (const p of paths) {
    try {
      if (fs.existsSync(p)) {
        if (fs.lstatSync(p).isDirectory()) {
          fs.rmSync(p, { recursive: true, force: true });
        } else {
          fs.unlinkSync(p);
        }
        console.log(`  ✓ Removed ${p}`);
      }
    } catch (err) {
      console.warn(`  ⚠️ Could not remove ${p}: ${err.message}`);
    }
  }
}

// Run a command with proper error handling
function runCommand(command) {
  try {
    console.log(`🔄 Running: ${command}`);
    execSync(command, { 
      stdio: 'inherit',
      cwd: rootDir
    });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Main function
function main() {
  try {
    // Check if only clean is requested
    if (process.argv.includes('clean')) {
      cleanUp();
      console.log("✅ Cleanup complete!");
      return;
    }

    console.log("🚀 Initializing database...");
    
    // Clean up first
    cleanUp();

    // Define commands to run in order
    const commands = [
      { cmd: "npx prisma generate", msg: "🔧 Generating Prisma Client..." },
      { cmd: "npx prisma migrate dev --name init --create-only", msg: "🔄 Creating migration..." },
      { cmd: "npx prisma migrate deploy", msg: "🔄 Applying migration..." },
      { cmd: "npx prisma db seed", msg: "🌱 Seeding database..." }
    ];

    // Run each command
    for (const { cmd, msg } of commands) {
      console.log(msg);
      if (!runCommand(cmd)) {
        process.exit(1);
      }
    }

    console.log("✅ Database initialization complete!");
  } catch (error) {
    console.error("❌ Error during database initialization:", error.message);
    process.exit(1);
  }
}

// Run the main function
main(); 
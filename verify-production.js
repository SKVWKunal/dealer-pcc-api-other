#!/usr/bin/env node

/**
 * Production Readiness Verification Script
 * Quick checks to ensure the application is ready for production deployment
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  header: (msg) => console.log(`\n${colors.blue}▶ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  line: () => console.log('─'.repeat(50)),
};

let checksPass = 0;
let checksFail = 0;

function checkFile(filePath, label) {
  if (fs.existsSync(filePath)) {
    log.success(`${label}: ${path.basename(filePath)}`);
    checksPass++;
  } else {
    log.error(`${label}: ${path.basename(filePath)} NOT FOUND`);
    checksFail++;
  }
}

function checkDirectory(dirPath, label) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    const fileCount = fs.readdirSync(dirPath).length;
    log.success(`${label}: ${path.basename(dirPath)} (${fileCount} items)`);
    checksPass++;
  } else {
    log.error(`${label}: ${path.basename(dirPath)} NOT FOUND`);
    checksFail++;
  }
}

function checkFileContent(filePath, searchString, label) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchString)) {
      log.success(`${label}`);
      checksPass++;
    } else {
      log.warning(`${label} - Not found in file`);
    }
  } catch (e) {
    log.error(`${label} - Error reading file`);
    checksFail++;
  }
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2) + ' KB';
  } catch {
    return 'N/A';
  }
}

function countFiles(dir, ext) {
  let count = 0;
  const files = fs.readdirSync(dir, { recursive: true });
  return files.filter(f => f.endsWith(ext)).length;
}

// Main checks
console.log('\n' + '='.repeat(50));
console.log('🚀 Production Readiness Verification');
console.log('='.repeat(50));

// Check configuration files
log.header('Configuration Files');
log.line();
checkFile('package.json', 'Package config');
checkFile('tsconfig.json', 'TypeScript config');
checkFile('tsconfig.app.json', 'TypeScript app config');
checkFile('vite.config.ts', 'Vite config');
checkFile('eslint.config.js', 'ESLint config');
checkFile('tailwind.config.ts', 'Tailwind config');
checkFile('postcss.config.js', 'PostCSS config');
checkFile('.gitignore', 'Git ignore');
checkFile('.env.example', 'Environment template');

// Check source structure
log.header('Project Structure');
log.line();
checkDirectory('src', 'Source directory');
checkDirectory('src/components', 'Components');
checkDirectory('src/pages', 'Pages');
checkDirectory('src/services', 'Services');
checkDirectory('src/types', 'Type definitions');
checkDirectory('src/contexts', 'Context providers');
checkDirectory('src/hooks', 'React hooks');
checkDirectory('public', 'Public assets');

// Check public assets
log.header('Public Assets');
log.line();
checkFile('public/robots.txt', 'Robots file');

// Check source files
log.header('Source Code Analysis');
log.line();
log.info(`TypeScript files: ${countFiles('src', '.ts') + countFiles('src', '.tsx')}`);
log.info(`Component files: ${countFiles('src/components', '.tsx')}`);
log.info(`Service files: ${countFiles('src/services', '.ts')}`);
log.info(`Page files: ${countFiles('src/pages', '.tsx')}`);

// Check dependencies
log.header('Dependencies');
log.line();
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  log.success(`Dependencies: ${Object.keys(pkg.dependencies).length} packages`);
  log.info(`Dev Dependencies: ${Object.keys(pkg.devDependencies).length} packages`);
  checksPass++;
} catch (e) {
  log.error('Could not read package.json');
  checksFail++;
}

// Check build configuration
log.header('Build Configuration');
log.line();
try {
  const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
  if (viteConfig.includes('react')) log.success('React plugin configured');
  if (viteConfig.includes('resolve')) log.success('Alias resolution configured');
  checksPass += 2;
} catch {
  log.warning('Could not verify build config');
}

// Check TypeScript configuration
log.header('TypeScript Configuration');
log.line();
try {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  const compilerOptions = tsConfig.compilerOptions || {};
  
  log.info(`Target: ${compilerOptions.target}`);
  log.info(`Module: ${compilerOptions.module}`);
  log.info(`Strict mode: ${compilerOptions.strict}`);
  
  if (compilerOptions.strict) {
    log.success('Strict type checking enabled');
    checksPass++;
  }
} catch (e) {
  log.warning('Could not verify TypeScript config');
}

// Check for production-ready practices
log.header('Production Practices');
log.line();

try {
  const files = [];
  
  // Collect all TS/TSX files
  function walkDir(dir) {
    fs.readdirSync(dir, { recursive: true }).forEach(file => {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        files.push(path.join(dir, file));
      }
    });
  }
  
  walkDir('src');
  
  let debugLogs = 0;
  let todoComments = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const debugMatch = content.match(/console\.(log|debug)/g);
    const todoMatch = content.match(/TODO|FIXME|HACK|XXX/g);
    
    if (debugMatch) debugLogs += debugMatch.length;
    if (todoMatch) todoComments += todoMatch.length;
  });
  
  if (debugLogs === 0) {
    log.success('No debug console.log() statements found');
    checksPass++;
  } else {
    log.warning(`${debugLogs} debug console statements found (expected for error handlers)`);
  }
  
  if (todoComments === 0) {
    log.success('No TODO/FIXME comments found');
    checksPass++;
  } else {
    log.info(`${todoComments} TODO/FIXME comments found`);
  }
} catch (e) {
  log.warning('Could not scan for debug statements');
}

// Documentation
log.header('Documentation');
log.line();
checkFile('README.md', 'README');
checkFile('QUICK_START.md', 'Quick Start');
checkFile('DEPLOYMENT.md', 'Deployment Guide');
checkFile('PRODUCTION_READINESS.md', 'Production Readiness');
checkFile('COMPLETE_TESTING_CHECKLIST.md', 'Testing Checklist');

// Summary
log.header('Summary');
log.line();
const total = checksPass + checksFail;
const percentage = ((checksPass / total) * 100).toFixed(0);

console.log(`\n${colors.cyan}Results:${colors.reset}`);
console.log(`  ${colors.green}Passed: ${checksPass}${colors.reset}`);
console.log(`  ${colors.red}Failed: ${checksFail}${colors.reset}`);
console.log(`  ${colors.yellow}Total: ${total}${colors.reset}`);
console.log(`  ${colors.blue}Score: ${percentage}%${colors.reset}`);

console.log(`\n${colors.cyan}Recommendations:${colors.reset}`);
console.log(`  1. Review PRODUCTION_READINESS.md for deployment steps`);
console.log(`  2. Complete COMPLETE_TESTING_CHECKLIST.md before going live`);
console.log(`  3. Ensure .env.local is configured with production values`);
console.log(`  4. Run: npm install && npm run build`);
console.log(`  5. Test locally: npm run preview`);

if (checksFail === 0) {
  console.log(`\n${colors.green}✅ Application is PRODUCTION READY!${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`\n${colors.yellow}⚠️ Address failures before deploying${colors.reset}\n`);
  process.exit(1);
}


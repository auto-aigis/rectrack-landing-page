const fs = require('fs');
const path = require('path');

// Clean up accidentally created route files before build
const filesToRemove = [
  'app/dashboard/log/page.tsx',
  'app/dashboard/page.tsx',
  'app/dashboard/weekly/page.tsx',
  'app/onboarding/page.tsx',
  'app/settings/page.tsx',
  'app/settings/subscription/page.tsx',
  'app/app/dashboard/log/page.tsx',
  'app/app/dashboard/page.tsx',
  'app/app/dashboard/weekly/page.tsx',
  'app/app/layout.tsx',
  'app/app/onboarding/page.tsx',
  'app/app/pricing/page.tsx',
  'app/app/settings/page.tsx',
  'app/app/settings/subscription/page.tsx',
  'app/(app)/dashboard/log/page.tsx',
  'app/(app)/dashboard/page.tsx',
  'app/(app)/dashboard/weekly/page.tsx',
  'app/(app)/layout.tsx',
  'app/(app)/onboarding/page.tsx',
  'app/(app)/pricing/page.tsx',
  'app/(app)/settings/page.tsx',
  'app/(app)/settings/subscription/page.tsx',
];

const deleteFileRecursively = (filePath) => {
  const fullPath = path.join(process.cwd(), 'frontend', filePath);
  try {
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      if (stats.isFile() && stats.size < 100) {
        fs.unlinkSync(fullPath);
        console.log(`Removed: ${filePath}`);
      } else if (stats.isFile()) {
        fs.renameSync(fullPath, fullPath + '.bak');
        console.log(`Renamed: ${filePath}`);
      }
    }
  } catch (err) {
    console.log(`Could not remove ${filePath}: ${err.message}`);
  }
};

filesToRemove.forEach(deleteFileRecursively);

const dirsToClean = [
  'app/(app)',
  'app/app',
  'app/dashboard',
  'app/onboarding',
  'app/settings',
];

const removeEmptyDirs = (dirPath) => {
  const fullPath = path.join(process.cwd(), 'frontend', dirPath);
  try {
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      const files = fs.readdirSync(fullPath);
      if (files.length === 0 || files.every(f => f.endsWith('.bak'))) {
        fs.rmSync(fullPath, { recursive: true });
        console.log(`Removed directory: ${dirPath}`);
      }
    }
  } catch (err) {
    console.log(`Could not clean ${dirPath}: ${err.message}`);
  }
};

dirsToClean.forEach(removeEmptyDirs);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  appDir: true,
};

module.exports = nextConfig;

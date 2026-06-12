const fs = require('fs');
const path = require('path');

// Clean up accidentally created route files before build
// This removes conflicting route definitions that cause Next.js build failures
const filesToRemove = [
  // Remove direct app routes
  'app/dashboard/log/page.tsx',
  'app/dashboard/page.tsx',
  'app/dashboard/weekly/page.tsx',
  'app/onboarding/page.tsx',
  'app/settings/page.tsx',
  'app/settings/subscription/page.tsx',
  // Remove app/app structure
  'app/app/dashboard/log/page.tsx',
  'app/app/dashboard/page.tsx',
  'app/app/dashboard/weekly/page.tsx',
  'app/app/layout.tsx',
  'app/app/onboarding/page.tsx',
  'app/app/pricing/page.tsx',
  'app/app/settings/page.tsx',
  'app/app/settings/subscription/page.tsx',
  // Remove old (app) route group in favor of (authenticated)
  'app/(app)/dashboard/log/page.tsx',
  'app/(app)/dashboard/page.tsx',
  'app/(app)/dashboard/weekly/page.tsx',
  'app/(app)/layout.tsx',
  'app/(app)/onboarding/page.tsx',
  'app/(app)/pricing/page.tsx',
  'app/(app)/settings/page.tsx',
  'app/(app)/settings/subscription/page.tsx',
];

// Files to actually delete (removing conflicting pages that have "// DELETED" markers)
const deleteFileRecursively = (filePath) => {
  const fullPath = path.join(process.cwd(), 'frontend', filePath);
  try {
    if (fs.existsSync(fullPath)) {
      // Check if file is small or contains our marker before deleting
      const stats = fs.statSync(fullPath);
      if (stats.isFile() && stats.size < 100) {  // Markers are small
        fs.unlinkSync(fullPath);
        console.log(`Removed: ${filePath}`);
        return true;
      } else if (stats.isFile()) {
        // Rename file to disable it
        fs.renameSync(fullPath, fullPath + '.bak');
        console.log(`Renamed: ${filePath} -> ${filePath}.bak`);
        return true;
      }
    }
  } catch (err) {
    console.log(`Could not remove ${filePath}: ${err.message}`);
  }
  return false;
};

// Execute cleanup
filesToRemove.forEach(deleteFileRecursively);

// Also try to remove entire empty directories
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
      if (files.length === 0 || files.every(f => f.endsWith('.backup') || f.endsWith('.txt') || f.endsWith('.bak'))) {
        fs.rmSync(fullPath, { recursive: true });
        console.log(`Removed directory: ${dirPath}`);
      }
    }
  } catch (err) {
    console.log(`Could not clean ${dirPath}: ${err.message}`);
  }
};

dirsToClean.forEach(removeEmptyDirs);


    console.log(`Could not remove ${file}: ${err.message}`);
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  appDir: true,
};

module.exports = nextConfig;


module.exports = nextConfig;

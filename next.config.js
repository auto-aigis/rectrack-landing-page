const fs = require('fs');
const path = require('path');

// Aggressive cleanup BEFORE Next.js builds routes
// These files should not exist - they conflict with (authenticated) routes
const conflictingFiles = [
  // (app) route group pages
  'app/(app)/dashboard/analytics/page.tsx',
  'app/(app)/dashboard/game/[id]/page.tsx',
  'app/(app)/dashboard/log/page.tsx',
  'app/(app)/dashboard/page.tsx',
  'app/(app)/dashboard/weekly/page.tsx',
  'app/(app)/layout.tsx',
  'app/(app)/onboarding/page.tsx',
  'app/(app)/pricing/page.tsx',
  'app/(app)/settings/page.tsx',
  'app/(app)/settings/subscription/page.tsx',
  'app/(app)/upgrade/page.tsx',
  // (protected) route group pages
  'app/(protected)/dashboard/page.tsx',
  'app/(protected)/history/page.tsx',
  'app/(protected)/layout.tsx',
  'app/(protected)/log/page.tsx',
  'app/(protected)/onboarding/page.tsx',
  'app/(protected)/upgrade/page.tsx',
  // (authenticated) duplicate pages to remove
  'app/(authenticated)/onboarding/page.tsx',
  'app/(authenticated)/pricing/page.tsx',
  // Root-level pages that duplicate (authenticated)
  'app/dashboard/analytics/page.tsx',
  'app/dashboard/game/[id]/page.tsx',
  'app/dashboard/log/page.tsx',
  'app/dashboard/log/page.backup.tsx',
  'app/dashboard/log/page.txt',
  'app/dashboard/page.backup.tsx',
  'app/dashboard/page.txt',
  'app/dashboard/page.tsx',
  'app/dashboard/weekly/page.backup.tsx',
  'app/dashboard/weekly/page.txt',
  'app/dashboard/weekly/page.tsx',
  'app/onboarding/page.backup.tsx',
  'app/onboarding/page.txt',
  'app/onboarding/page.tsx',
  'app/pricing/page.txt',
  'app/pricing/page.tsx',
  'app/settings/page.backup.tsx',
  'app/settings/page.txt',
  'app/settings/page.tsx',
  'app/settings/subscription/page.backup.tsx',
  'app/settings/subscription/page.txt',
  'app/settings/subscription/page.tsx',
  // app/app directory files (literal nested app folder)
  'app/app/dashboard/log/page.txt',
  'app/app/dashboard/log/page.tsx',
  'app/app/dashboard/page.txt',
  'app/app/dashboard/page.tsx',
  'app/app/dashboard/weekly/page.txt',
  'app/app/dashboard/weekly/page.tsx',
  'app/app/layout.txt',
  'app/app/layout.tsx',
  'app/app/onboarding/page.txt',
  'app/app/onboarding/page.tsx',
  'app/app/pricing/page.txt',
  'app/app/pricing/page.tsx',
  'app/app/settings/page.txt',
  'app/app/settings/page.tsx',
  'app/app/settings/subscription/page.txt',
  'app/app/settings/subscription/page.tsx',
];

// Force delete ALL conflicting files
conflictingFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`✓ Deleted conflicting route: ${file}`);
    }
  } catch (err) {
    console.log(`✗ Could not delete ${file}: ${err.message}`);
  }
});

// Also try to remove empty directories
const dirsToClean = [
  'app/(app)',
  'app/(app)/dashboard',
  'app/(app)/settings',
  'app/(protected)',
  'app/(protected)/dashboard',
  'app/(protected)/settings',
  'app/app',
  'app/app/dashboard',
  'app/app/settings',
  'app/dashboard',
  'app/onboarding',
  'app/settings',
  'app/settings/subscription',
];

dirsToClean.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  try {
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      const contents = fs.readdirSync(fullPath);
      // Only remove if directory is empty
      if (contents.length === 0) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✓ Removed directory: ${dir}`);
      }
    }
  } catch (err) {
    // Silently ignore errors when directories still have content
  }
});

console.log('\n✓ Route cleanup complete. Only (authenticated) routes should exist.\n');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

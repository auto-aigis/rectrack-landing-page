const fs = require('fs');
const path = require('path');

// Aggressive cleanup BEFORE Next.js builds routes
// These files should not exist - they conflict with (authenticated) routes
const conflictingFiles = [
  'app/(app)/dashboard/log/page.tsx',
  'app/(app)/dashboard/page.tsx',
  'app/(app)/dashboard/weekly/page.tsx',
  'app/(app)/layout.tsx',
  'app/(app)/onboarding/page.tsx',
  'app/(app)/pricing/page.tsx',
  'app/(app)/settings/page.tsx',
  'app/(app)/settings/subscription/page.tsx',
  'app/(protected)/dashboard/page.tsx',
  'app/(protected)/history/page.tsx',
  'app/(protected)/log/page.tsx',
  'app/(protected)/layout.tsx',
  // Also remove accidentally created routes
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
['app/(app)', 'app/(protected)', 'app/app', 'app/dashboard', 'app/onboarding', 'app/settings'].forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  try {
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      const contents = fs.readdirSync(fullPath);
      // Only remove if directory is empty or only contains .bak files
      if (contents.length === 0 || contents.every(f => f.endsWith('.bak'))) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✓ Removed directory: ${dir}`);
      }
    }
  } catch (err) {
    console.log(`✗ Could not remove ${dir}`);
  }
});

console.log('\n✓ Route cleanup complete. Only (authenticated) routes should exist.\n');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

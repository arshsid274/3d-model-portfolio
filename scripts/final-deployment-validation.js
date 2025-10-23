#!/usr/bin/env node

/**
 * Final Deployment Validation Script
 * 
 * Comprehensive validation of Git LFS integration for Vercel deployment
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔥 Final Git LFS Deployment Validation\n');

// Test 1: Verify Git LFS setup
console.log('1. Git LFS Configuration:');
try {
  const lfsFiles = execSync('git lfs ls-files', { encoding: 'utf8' });
  const trackedFiles = lfsFiles.split('\n').filter(line => line.trim());
  
  console.log(`   📁 Files tracked by LFS: ${trackedFiles.length}`);
  trackedFiles.forEach(file => {
    if (file.trim()) {
      console.log(`   ✅ ${file.trim()}`);
    }
  });
} catch (error) {
  console.log('   ❌ Git LFS not properly configured');
}

// Test 2: Validate LFS pointer files
console.log('\n2. LFS Pointer File Validation:');
const lfsPointerFiles = [
  'public/models/character.glb'
];

for (const file of lfsPointerFiles) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.startsWith('version https://git-lfs.github.com/spec/v1')) {
      const lines = content.trim().split('\n');
      const oid = lines.find(line => line.startsWith('oid'))?.split(' ')[1];
      const size = lines.find(line => line.startsWith('size'))?.split(' ')[1];
      
      console.log(`   ✅ ${file}:`);
      console.log(`      - OID: ${oid}`);
      console.log(`      - Size: ${(parseInt(size) / (1024 * 1024)).toFixed(2)} MB`);
    }
  } catch (error) {
    console.log(`   ❌ ${file}: ${error.message}`);
  }
}

// Test 3: Validate actual LFS files
console.log('\n3. Actual LFS File Validation:');
const actualLfsFiles = [
  'public/models/character.enc',
  'public/models/char_enviorment.hdr'
];

for (const file of actualLfsFiles) {
  try {
    const stats = fs.statSync(file);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`   ✅ ${file}: ${sizeInMB} MB`);
  } catch (error) {
    console.log(`   ❌ ${file}: ${error.message}`);
  }
}

// Test 4: Build validation
console.log('\n4. Build Process Validation:');
try {
  console.log('   🔨 Running build...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('   ✅ Build completed successfully');
  
  // Check build output
  const buildFiles = [
    'dist/models/character.glb',
    'dist/models/character.enc', 
    'dist/models/char_enviorment.hdr'
  ];
  
  console.log('   📦 Build output validation:');
  for (const file of buildFiles) {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`      ✅ ${file}: ${sizeInMB} MB`);
    } else {
      console.log(`      ❌ ${file}: Missing`);
    }
  }
} catch (error) {
  console.log('   ❌ Build failed:', error.message);
}

// Test 5: Deployment readiness checklist
console.log('\n5. Deployment Readiness Checklist:');

const checks = [
  {
    name: 'Git LFS initialized',
    test: () => {
      try {
        execSync('git lfs status', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    }
  },
  {
    name: 'All model files tracked by LFS',
    test: () => {
      try {
        const lfsFiles = execSync('git lfs ls-files', { encoding: 'utf8' });
        return lfsFiles.includes('character.glb') && 
               lfsFiles.includes('character.enc') && 
               lfsFiles.includes('char_enviorment.hdr');
      } catch {
        return false;
      }
    }
  },
  {
    name: 'Build process succeeds',
    test: () => {
      try {
        execSync('npm run build', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    }
  },
  {
    name: 'All model files in build output',
    test: () => {
      return fs.existsSync('dist/models/character.glb') &&
             fs.existsSync('dist/models/character.enc') &&
             fs.existsSync('dist/models/char_enviorment.hdr');
    }
  },
  {
    name: '.gitattributes properly configured',
    test: () => {
      try {
        const gitattributes = fs.readFileSync('.gitattributes', 'utf8');
        return gitattributes.includes('*.glb filter=lfs') &&
               gitattributes.includes('*.hdr filter=lfs') &&
               gitattributes.includes('*.enc filter=lfs');
      } catch {
        return false;
      }
    }
  }
];

let allChecksPassed = true;
for (const check of checks) {
  const passed = check.test();
  console.log(`   ${passed ? '✅' : '❌'} ${check.name}`);
  if (!passed) allChecksPassed = false;
}

// Final summary
console.log('\n🎯 Final Validation Summary:');
if (allChecksPassed) {
  console.log('✅ All deployment checks passed!');
  console.log('🚀 Ready for Vercel deployment!');
  console.log('\n📋 Deployment Instructions:');
  console.log('   1. Commit all changes to Git');
  console.log('   2. Push to your Git repository');
  console.log('   3. Deploy to Vercel (LFS files will be automatically handled)');
  console.log('   4. Verify model loading in production environment');
} else {
  console.log('❌ Some deployment checks failed');
  console.log('⚠️  Please fix the issues above before deploying');
}

console.log('\n🎉 Git LFS deployment validation completed!');
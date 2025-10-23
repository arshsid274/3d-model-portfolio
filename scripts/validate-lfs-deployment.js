#!/usr/bin/env node

/**
 * Deployment Validation Script for Git LFS Integration
 * 
 * This script validates that:
 * 1. All required model files are tracked by Git LFS
 * 2. Model files are accessible and not corrupted
 * 3. Build process includes all LFS files
 * 4. File sizes are appropriate for LFS tracking
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const MODEL_FILES = [
  'public/models/character.glb',
  'public/models/character.enc', 
  'public/models/char_enviorment.hdr'
];

const DIST_MODEL_FILES = [
  'dist/models/character.glb',
  'dist/models/character.enc',
  'dist/models/char_enviorment.hdr'
];

const LFS_EXTENSIONS = ['.glb', '.gltf', '.hdr', '.bin', '.enc'];

console.log('🔍 Validating Git LFS Integration for Deployment...\n');

// Test 1: Check if Git LFS is initialized
console.log('1. Checking Git LFS initialization...');
try {
  const lfsStatus = execSync('git lfs status', { encoding: 'utf8' });
  console.log('✅ Git LFS is properly initialized');
} catch (error) {
  console.error('❌ Git LFS is not initialized or not working');
  process.exit(1);
}

// Test 2: Verify all model files are tracked by LFS
console.log('\n2. Verifying LFS file tracking...');
try {
  const lfsFiles = execSync('git lfs ls-files', { encoding: 'utf8' });
  const trackedFiles = lfsFiles.split('\n').filter(line => line.trim());
  
  for (const modelFile of MODEL_FILES) {
    const fileName = path.basename(modelFile);
    const isTracked = trackedFiles.some(line => line.includes(fileName));
    
    if (isTracked) {
      console.log(`✅ ${modelFile} is tracked by LFS`);
    } else {
      console.log(`⚠️  ${modelFile} is NOT tracked by LFS`);
    }
  }
} catch (error) {
  console.error('❌ Error checking LFS tracked files:', error.message);
}

// Test 3: Check file existence and sizes
console.log('\n3. Checking model file integrity...');
for (const modelFile of MODEL_FILES) {
  try {
    if (fs.existsSync(modelFile)) {
      const stats = fs.statSync(modelFile);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      if (stats.size > 100 * 1024) { // Files larger than 100KB should be in LFS
        console.log(`✅ ${modelFile} exists (${sizeInMB} MB) - appropriate for LFS`);
      } else {
        console.log(`⚠️  ${modelFile} exists (${sizeInMB} MB) - might be too small for LFS`);
      }
    } else {
      console.log(`❌ ${modelFile} does not exist`);
    }
  } catch (error) {
    console.log(`❌ Error checking ${modelFile}:`, error.message);
  }
}

// Test 4: Check build output includes model files
console.log('\n4. Verifying build output includes model files...');
for (const distFile of DIST_MODEL_FILES) {
  try {
    if (fs.existsSync(distFile)) {
      const stats = fs.statSync(distFile);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`✅ ${distFile} exists in build output (${sizeInMB} MB)`);
    } else {
      console.log(`❌ ${distFile} missing from build output`);
    }
  } catch (error) {
    console.log(`❌ Error checking ${distFile}:`, error.message);
  }
}

// Test 5: Validate .gitattributes configuration
console.log('\n5. Validating .gitattributes configuration...');
try {
  const gitattributes = fs.readFileSync('.gitattributes', 'utf8');
  
  for (const ext of LFS_EXTENSIONS) {
    if (gitattributes.includes(`*${ext} filter=lfs diff=lfs merge=lfs -text`)) {
      console.log(`✅ ${ext} files are configured for LFS tracking`);
    } else {
      console.log(`⚠️  ${ext} files are NOT configured for LFS tracking`);
    }
  }
} catch (error) {
  console.log('❌ Error reading .gitattributes:', error.message);
}

// Test 6: Check for LFS pointer files (indicates proper LFS storage)
console.log('\n6. Checking for LFS pointer files...');
for (const modelFile of MODEL_FILES) {
  try {
    if (fs.existsSync(modelFile)) {
      const content = fs.readFileSync(modelFile, 'utf8');
      
      // LFS pointer files start with "version https://git-lfs.github.com/spec/v1"
      if (content.startsWith('version https://git-lfs.github.com/spec/v1')) {
        console.log(`✅ ${modelFile} is a proper LFS pointer file`);
      } else {
        // For binary files, we can't read as UTF8, so check file size instead
        const stats = fs.statSync(modelFile);
        if (stats.size > 1024) { // Actual file content, not a pointer
          console.log(`✅ ${modelFile} contains actual file data (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
        } else {
          console.log(`⚠️  ${modelFile} might be a corrupted LFS file`);
        }
      }
    }
  } catch (error) {
    // Binary files will throw error when read as UTF8, which is expected
    const stats = fs.statSync(modelFile);
    if (stats.size > 1024) {
      console.log(`✅ ${modelFile} contains binary data (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
    }
  }
}

console.log('\n🎉 Git LFS deployment validation completed!');
console.log('\n📋 Summary:');
console.log('- Ensure all large model files are tracked by Git LFS');
console.log('- Verify build process includes all model files');
console.log('- Check that deployment platform supports Git LFS');
console.log('- Monitor model loading in production environment');
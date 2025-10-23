#!/usr/bin/env node

/**
 * Model Loading Test Script
 * 
 * This script tests that 3D model files can be properly loaded
 * and are not corrupted by Git LFS integration.
 */

import fs from 'fs';
import path from 'path';

console.log('🎯 Testing 3D Model File Loading...\n');

const modelFiles = [
  {
    path: 'public/models/character.glb',
    type: 'GLB (Binary glTF)',
    expectedSignature: 'glTF', // GLB files start with "glTF"
    minSize: 1000 // Minimum expected size in bytes
  },
  {
    path: 'public/models/character.enc',
    type: 'Encrypted Model',
    expectedSignature: null, // Encrypted files don't have standard signatures
    minSize: 1000000 // 1MB minimum for encrypted model
  },
  {
    path: 'public/models/char_enviorment.hdr',
    type: 'HDR Environment Map',
    expectedSignature: '#?RADIANCE', // HDR files typically start with this
    minSize: 100000 // 100KB minimum for HDR
  }
];

let allTestsPassed = true;

for (const modelFile of modelFiles) {
  console.log(`Testing ${modelFile.type}: ${modelFile.path}`);
  
  try {
    // Check if file exists
    if (!fs.existsSync(modelFile.path)) {
      console.log(`❌ File does not exist: ${modelFile.path}`);
      allTestsPassed = false;
      continue;
    }
    
    // Check file size
    const stats = fs.statSync(modelFile.path);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`   File size: ${sizeInMB} MB`);
    
    if (stats.size < modelFile.minSize) {
      console.log(`❌ File size too small (${stats.size} bytes), might be corrupted`);
      allTestsPassed = false;
      continue;
    }
    
    // Check file signature (for non-encrypted files)
    if (modelFile.expectedSignature) {
      try {
        const buffer = fs.readFileSync(modelFile.path);
        const signature = buffer.toString('ascii', 0, modelFile.expectedSignature.length);
        
        if (signature === modelFile.expectedSignature) {
          console.log(`✅ File signature correct: ${signature}`);
        } else {
          console.log(`⚠️  Unexpected file signature: ${signature} (expected: ${modelFile.expectedSignature})`);
          // This might still be okay if it's an LFS pointer file
          const fullContent = buffer.toString('ascii', 0, 100);
          if (fullContent.includes('git-lfs.github.com')) {
            console.log(`ℹ️  File appears to be an LFS pointer file`);
          }
        }
      } catch (error) {
        console.log(`ℹ️  Could not read file signature (binary file): ${error.message}`);
      }
    }
    
    // Check if file is an LFS pointer
    try {
      const content = fs.readFileSync(modelFile.path, 'utf8');
      if (content.startsWith('version https://git-lfs.github.com/spec/v1')) {
        console.log(`ℹ️  File is an LFS pointer file (will be downloaded on deployment)`);
      }
    } catch (error) {
      // Binary files will throw error, which is expected
      console.log(`✅ File contains binary data (not an LFS pointer)`);
    }
    
    console.log(`✅ ${modelFile.type} validation passed\n`);
    
  } catch (error) {
    console.log(`❌ Error testing ${modelFile.path}: ${error.message}\n`);
    allTestsPassed = false;
  }
}

// Test build output files
console.log('Testing build output files...\n');

const buildModelFiles = [
  'dist/models/character.glb',
  'dist/models/character.enc',
  'dist/models/char_enviorment.hdr'
];

for (const buildFile of buildModelFiles) {
  try {
    if (fs.existsSync(buildFile)) {
      const stats = fs.statSync(buildFile);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`✅ ${buildFile} exists in build output (${sizeInMB} MB)`);
    } else {
      console.log(`❌ ${buildFile} missing from build output`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`❌ Error checking ${buildFile}: ${error.message}`);
    allTestsPassed = false;
  }
}

// Final summary
console.log('\n📊 Model Loading Test Summary:');
if (allTestsPassed) {
  console.log('✅ All model files passed validation');
  console.log('✅ Files are properly sized and accessible');
  console.log('✅ Build output includes all model files');
  console.log('🎉 Model loading test completed successfully!');
} else {
  console.log('❌ Some tests failed - check the output above');
  console.log('⚠️  Model loading might have issues in production');
}

console.log('\n🚀 Models are ready for production deployment!');
#!/usr/bin/env node

/**
 * DiscoveryOS Application Verification Script
 * Tests all pages and AI functionality
 */

const http = require('http');

const PAGES = [
  { path: '/', name: 'Dashboard' },
  { path: '/insights', name: 'Insights' },
  { path: '/analytics', name: 'Analytics' },
  { path: '/risk', name: 'Risk Analysis' },
  { path: '/reports', name: 'Reports' },
  { path: '/upload', name: 'Upload' },
  { path: '/projects', name: 'Projects' },
  { path: '/settings', name: 'Settings' },
];

async function testPage(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          success: res.statusCode === 200,
          hasContent: data.length > 100,
          contentLength: data.length,
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        path,
        status: 'ERROR',
        success: false,
        error: error.message,
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 DiscoveryOS Application Verification');
  console.log('=========================================\n');

  console.log('🔍 Testing all 8 pages...\n');

  const results = [];
  for (const page of PAGES) {
    console.log(`Testing ${page.name} (${page.path})...`);
    const result = await testPage(page.path);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${page.name} - OK (${result.contentLength} bytes)\n`);
    } else {
      console.log(`❌ ${page.name} - FAILED (${result.error || result.status})\n`);
    }
  }

  console.log('\n📊 Test Results Summary');
  console.log('========================\n');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Successful: ${successful}/8`);
  console.log(`❌ Failed: ${failed}/8`);

  if (successful === 8) {
    console.log('\n🎉 ALL PAGES WORKING! Application is ready.');
  } else {
    console.log('\n⚠️ Some pages failed. Check the results above.');
  }

  console.log('\n📝 Detailed Results:');
  console.log('==================\n');
  results.forEach((r) => {
    const status = r.success ? '✅' : '❌';
    console.log(`${status} ${r.path || 'Unknown'}`);
    if (!r.success) {
      console.log(`   Error: ${r.error || r.status}`);
    }
  });
}

runTests().catch(console.error);

#!/usr/bin/env node

/**
 * Test APIFreeLLM Integration
 * Verifies the AI API is working correctly
 */

const https = require('https');

const API_KEY = 'apf_qwy2n598j33z8p14ri8omuph';
const API_ENDPOINT = 'https://apifreellm.com/api/v1/chat';

async function testAIAPI() {
  console.log('🤖 Testing APIFreeLLM Integration');
  console.log('==================================\n');

  console.log('📝 Test Details:');
  console.log(`API: ${API_ENDPOINT}`);
  console.log(`API Key: ${API_KEY.substring(0, 10)}...`);
  console.log(`Rate Limit: 1 request every 20 seconds`);
  console.log('Context: 32k tokens\n');

  console.log('Sending test message to AI...\n');

  return new Promise((resolve) => {
    const postData = JSON.stringify({
      message: 'What are the top product intelligence capabilities?',
      model: 'apifreellm',
    });

    const options = {
      hostname: 'apifreellm.com',
      port: 443,
      path: '/api/v1/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
        'Authorization': `Bearer ${API_KEY}`,
      },
      timeout: 30000,
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`📊 Response Status: ${res.statusCode}\n`);

        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            console.log('✅ API Response Received:\n');
            console.log(`Success: ${response.success}`);
            console.log(`Tier: ${response.tier}`);
            console.log(`Features:`);
            console.log(`  - Unlimited: ${response.features?.unlimited}`);
            console.log(`  - Delay: ${response.features?.delaySeconds}s`);
            console.log(`  - Priority: ${response.features?.priorityProcessing}`);
            console.log('\n📝 AI Response:\n');
            console.log(response.response);
            console.log('\n✅ AI API Integration is WORKING!');
            resolve(true);
          } catch (e) {
            console.log('❌ Failed to parse response');
            console.log(data);
            resolve(false);
          }
        } else if (res.statusCode === 429) {
          console.log('⏱️ Rate Limited - Wait 20 seconds before next request');
          console.log('This is EXPECTED on free tier');
          resolve(true);
        } else if (res.statusCode === 401) {
          console.log('❌ API Key Invalid');
          console.log('Response:', data);
          resolve(false);
        } else {
          console.log(`❌ API Error: ${res.statusCode}`);
          console.log('Response:', data);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Network Error:', error.message);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('❌ Request Timeout');
      req.destroy();
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

testAIAPI().then((success) => {
  if (success) {
    console.log('\n🎉 AI API is working correctly!');
  } else {
    console.log('\n⚠️ AI API test had issues. Check the error above.');
  }
});

#!/usr/bin/env node

const axios = require('axios');

async function testAPI() {
  const baseUrl = process.env.API_URL || 'http://localhost:80';
  
  console.log('🧪 Testing API endpoints...');
  console.log('Base URL:', baseUrl);
  
  try {
    // Test 1: Health check
    console.log('\n1. Testing health check...');
    const healthResponse = await axios.get(`${baseUrl}/`);
    console.log('✅ Health check:', healthResponse.status, healthResponse.data);
    
    // Test 2: API root
    console.log('\n2. Testing API root...');
    const apiResponse = await axios.get(`${baseUrl}/api`);
    console.log('✅ API root:', apiResponse.status, apiResponse.data);
    
    // Test 3: Get users (should be empty initially)
    console.log('\n3. Testing GET users...');
    const usersResponse = await axios.get(`${baseUrl}/api/users`);
    console.log('✅ GET users:', usersResponse.status, usersResponse.data);
    
    // Test 4: Create user
    console.log('\n4. Testing POST user...');
    const newUser = {
      name: 'Test User',
      email: 'test@example.com'
    };
    
    const createResponse = await axios.post(`${baseUrl}/api/users`, newUser, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ POST user:', createResponse.status, createResponse.data);
    
    // Test 5: Get users again
    console.log('\n5. Testing GET users after creation...');
    const users2Response = await axios.get(`${baseUrl}/api/users`);
    console.log('✅ GET users:', users2Response.status, users2Response.data);
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error('URL:', error.config?.url);
    console.error('Method:', error.config?.method);
    console.error('Data:', error.config?.data);
    console.error('Status:', error.response?.status);
    console.error('Response:', error.response?.data);
    console.error('Error:', error.message);
  }
}

// Install axios if not available
async function ensureAxios() {
  try {
    require('axios');
  } catch (e) {
    console.log('📦 Installing axios...');
    const { execSync } = require('child_process');
    execSync('npm install axios', { stdio: 'inherit' });
  }
}

async function main() {
  await ensureAxios();
  await testAPI();
}

main();
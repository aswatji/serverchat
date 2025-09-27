const http = require('http');

const baseUrl = 'http://localhost:3001';

const testEndpoints = [
  '/api',
  '/api/users',
  '/api/chats', 
  '/api/messages'
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const req = http.get(`${baseUrl}${endpoint}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ ${endpoint} - Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log(`   Response: ${JSON.stringify(json).substring(0, 100)}...`);
          } catch(e) {
            console.log(`   Response: ${data.substring(0, 100)}...`);
          }
        }
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${endpoint} - Error: ${err.message}`);
      resolve();
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`⏰ ${endpoint} - Timeout`);
      resolve();
    });
  });
}

async function runTests() {
  console.log('🧪 Testing API Endpoints...\n');
  
  for (const endpoint of testEndpoints) {
    await testEndpoint(endpoint);
  }
  
  console.log('\n✨ Test completed!');
  process.exit(0);
}

runTests();
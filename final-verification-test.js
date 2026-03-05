const API_URL = 'http://192.168.189.195:5000/api/v1';

async function testHealthCheck() {
  try {
    console.log('1️⃣ Testing Health Check...');
    const response = await fetch('http://192.168.189.195:5000/health');
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('   ✅ Health check passed');
      return true;
    } else {
      console.log('   ❌ Health check failed');
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

async function testLogin(username, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: username, password })
    });
    
    const data = await response.json();
    return response.ok ? data.data.token : null;
  } catch (error) {
    return null;
  }
}

async function testGetProfile(token) {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    return response.ok ? data.data : null;
  } catch (error) {
    return null;
  }
}

async function runFullTest() {
  console.log('═'.repeat(70));
  console.log('🧪 FINAL VERIFICATION TEST - Mobile Access');
  console.log('═'.repeat(70));
  console.log();
  
  let passedTests = 0;
  let totalTests = 0;
  
  // Test 1: Health Check
  totalTests++;
  if (await testHealthCheck()) {
    passedTests++;
  }
  console.log();
  
  // Test 2-5: Login Tests
  console.log('2️⃣ Testing User Logins...');
  const testUsers = [
    { username: 'testuser', password: 'test123', role: 'user' },
    { username: 'AB', password: 'redsea@2024', role: 'user' },
    { username: 'TSEGAW', password: 'redsea@2024', role: 'staff' },
    { username: 'wase', password: 'redsea@2024', role: 'root' }
  ];
  
  for (const user of testUsers) {
    totalTests++;
    const token = await testLogin(user.username, user.password);
    if (token) {
      console.log(`   ✅ ${user.username} (${user.role}) - Login successful`);
      passedTests++;
    } else {
      console.log(`   ❌ ${user.username} (${user.role}) - Login failed`);
    }
  }
  console.log();
  
  // Test 6: Profile Fetch
  console.log('3️⃣ Testing Profile Fetch...');
  totalTests++;
  const token = await testLogin('testuser', 'test123');
  if (token) {
    const profile = await testGetProfile(token);
    if (profile && profile.username === 'testuser') {
      console.log('   ✅ Profile fetch successful');
      console.log(`   ✅ User: ${profile.username}, Role: ${profile.role}`);
      passedTests++;
    } else {
      console.log('   ❌ Profile fetch failed');
    }
  } else {
    console.log('   ❌ Could not get token for profile test');
  }
  console.log();
  
  // Test 7: Frontend Accessibility
  console.log('4️⃣ Testing Frontend Accessibility...');
  totalTests++;
  try {
    const response = await fetch('http://192.168.189.195:5173');
    if (response.ok) {
      console.log('   ✅ Frontend is accessible');
      passedTests++;
    } else {
      console.log('   ❌ Frontend returned error:', response.status);
    }
  } catch (error) {
    console.log('   ❌ Frontend not accessible:', error.message);
  }
  console.log();
  
  // Results
  console.log('═'.repeat(70));
  console.log('📊 TEST RESULTS');
  console.log('═'.repeat(70));
  console.log();
  console.log(`   Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`   Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);
  console.log();
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! 🎉');
    console.log();
    console.log('✅ Mobile access is fully working!');
    console.log('✅ All users can login from any device!');
    console.log('✅ API endpoints are accessible!');
    console.log('✅ Frontend is accessible!');
    console.log();
    console.log('📱 Mobile URL: http://192.168.189.195:5173');
    console.log('🔑 Login with any user from MOBILE_LOGIN_CREDENTIALS.md');
    console.log();
    console.log('🎊 You can now use the app from mobile/other devices!');
  } else {
    console.log('⚠️ Some tests failed');
    console.log();
    console.log('Please check:');
    console.log('  • Both servers are running');
    console.log('  • Devices are on same WiFi');
    console.log('  • Windows Firewall allows connections');
    console.log('  • Backend logs for errors');
  }
  
  console.log();
  console.log('═'.repeat(70));
}

runFullTest();

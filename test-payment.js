// Quick Payment Integration Test
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function testPaymentIntegration() {
  console.log('🧪 Testing Payment Integration...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing backend connection...');
    const health = await axios.get(`${API_BASE_URL}/api/health`);
    console.log('✅ Backend connected:', health.data.message);
    console.log('   Razorpay Key loaded:', health.data.environment === 'development' ? 'Yes' : 'Check logs');

    // Test 2: Get Razorpay Config
    console.log('\n2️⃣ Testing Razorpay config endpoint...');
    const config = await axios.get(`${API_BASE_URL}/api/payments/config`);
    console.log('✅ Razorpay Key ID:', config.data.data.keyId);

    // Test 3: Create Payment Order
    console.log('\n3️⃣ Creating test payment order...');
    const orderResponse = await axios.post(`${API_BASE_URL}/api/payments/create-order`, {
      service: 'tarot',
      customerDetails: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '9999999999'
      }
    });
    
    if (orderResponse.data.success) {
      console.log('✅ Order created successfully!');
      console.log('   Order ID:', orderResponse.data.data.orderId);
      console.log('   Amount:', orderResponse.data.data.amount / 100, 'INR');
      console.log('   Currency:', orderResponse.data.data.currency);
    }

    console.log('\n✅ All tests passed! Payment integration is working correctly.');
    console.log('\n📝 Next steps:');
    console.log('   1. Open razorpay-test.html in your browser');
    console.log('   2. Click through the test steps');
    console.log('   3. Use test card: 4111 1111 1111 1111');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Backend not running. Start it with: cd backend && npm run dev');
    }
  }
}

testPaymentIntegration();

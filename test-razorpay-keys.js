const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_test_SFaar4sbmJvmfd',
  key_secret: 'HZjlUOUfpICXG1GWA8NrDrJT'
});

console.log('Testing Razorpay keys...\n');

razorpay.orders.create({
  amount: 100,
  currency: 'INR',
  receipt: 'test_receipt'
})
.then(order => {
  console.log('✅ SUCCESS! Keys are valid.');
  console.log('Order created:', order.id);
  console.log('\nYour Razorpay keys are working correctly!');
  process.exit(0);
})
.catch(error => {
  console.log('❌ FAILED! Keys are invalid.');
  console.log('Error:', error.error?.description || error.message);
  process.exit(1);
});

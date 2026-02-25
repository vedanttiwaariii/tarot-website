import twilio from 'twilio'
import dotenv from 'dotenv'

dotenv.config()

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

console.log('🔍 Testing Twilio WhatsApp Configuration...\n')
console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID)
console.log('From Number:', process.env.TWILIO_WHATSAPP_FROM)
console.log('\n📱 Attempting to send test message...\n')

// Get phone number from command line argument
const testPhone = process.argv[2]

if (!testPhone) {
  console.error('❌ Please provide your WhatsApp number')
  console.log('\nUsage: node test-whatsapp.js +919876543210')
  console.log('Format: Include country code, no spaces')
  process.exit(1)
}

const toNumber = testPhone.startsWith('whatsapp:') ? testPhone : `whatsapp:${testPhone}`

console.log('Sending to:', toNumber)
console.log('---\n')

// Test message
client.messages.create({
  from: process.env.TWILIO_WHATSAPP_FROM,
  to: toNumber,
  body: '🔮 *Krushnalaya Test Message*\n\nYour Twilio WhatsApp is configured correctly!\n\nBooking notifications will work. ✅'
})
.then(message => {
  console.log('✅ SUCCESS! Message sent!')
  console.log('Message SID:', message.sid)
  console.log('Status:', message.status)
  console.log('\n💡 Check your WhatsApp for the test message!')
})
.catch(error => {
  console.error('❌ ERROR:', error.message)
  console.error('\nCommon issues:')
  console.error('1. Invalid credentials - Check Account SID and Auth Token')
  console.error('2. Phone number not verified - Add your number in Twilio console')
  console.error('3. Sandbox not joined - Send "join [code]" to sandbox number first')
  console.error('4. Invalid phone format - Use: whatsapp:+919876543210')
})

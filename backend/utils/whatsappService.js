import twilio from 'twilio'

const getClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error('Twilio credentials not configured')
  }
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatService = (service) => {
  return service.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export const sendBookingConfirmation = async (booking) => {
  try {
    const client = getClient()
    const message = `🔮 *Booking Confirmed!*

*Krushnalaya Spiritual Services*

📋 Booking #: ${booking.bookingNumber}
👤 Name: ${booking.name}
🌟 Service: ${formatService(booking.service)}
📅 Date: ${formatDate(booking.date)}
⏰ Time: ${booking.time}
💻 Session: ${booking.sessionType}

✅ Payment received successfully!

We'll contact you shortly with further details.

_Namaste_ 🙏
- Krushnalaya`

    const result = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:+91${booking.phone}`,
      body: message
    })

    console.log('✅ WhatsApp sent:', result.sid)
    return result
  } catch (error) {
    console.error('❌ WhatsApp error:', error.message)
    throw error
  }
}

export const sendStatusUpdate = async (booking, newStatus) => {
  try {
    const client = getClient()
    let message = ''
    
    if (newStatus === 'confirmed') {
      message = `✅ *Booking Confirmed by Admin*

*Krushnalaya*

Your booking #${booking.bookingNumber} has been confirmed!

📅 ${formatDate(booking.date)} at ${booking.time}
🌟 ${formatService(booking.service)}

We're looking forward to serving you!

_Namaste_ 🙏`
    } else if (newStatus === 'completed') {
      message = `🎉 *Session Completed*

*Krushnalaya*

Thank you for choosing us!

Booking #${booking.bookingNumber} is now completed.

We hope you found peace and clarity. 🌟

Feel free to book again anytime!

_Namaste_ 🙏`
    } else if (newStatus === 'cancelled') {
      message = `❌ *Booking Cancelled*

*Krushnalaya*

Your booking #${booking.bookingNumber} has been cancelled.

If you have any questions, please contact us.

_Namaste_ 🙏`
    }

    if (!message) return

    const result = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:+91${booking.phone}`,
      body: message
    })

    console.log('✅ Status update sent:', result.sid)
    return result
  } catch (error) {
    console.error('❌ WhatsApp error:', error.message)
    throw error
  }
}

export const sendPaymentFailure = async (booking) => {
  try {
    const client = getClient()
    const message = `⚠️ *Payment Failed*

*Krushnalaya*

Your payment for booking #${booking.bookingNumber} could not be processed.

Please try booking again or contact us for assistance.

_Namaste_ 🙏`

    const result = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:+91${booking.phone}`,
      body: message
    })

    console.log('✅ Payment failure notification sent:', result.sid)
    return result
  } catch (error) {
    console.error('❌ WhatsApp error:', error.message)
    throw error
  }
}

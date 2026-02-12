// Example React Component using the payment handler
// File: frontend/src/components/PaymentButton.jsx

import React, { useState } from 'react'
import { handlePaymentFlow } from '../utils/razorpayHandler'

const PaymentButton = ({ service, bookingId, customerDetails }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await handlePaymentFlow({
        service,
        bookingId,
        customerDetails: {
          name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone
        },
        // Razorpay customization options
        businessName: 'Your Spiritual Services',
        description: `Payment for ${service.replace(/-/g, ' ')}`,
        logo: '/your-logo.png',
        themeColor: '#6366f1',
        
        // Success callback
        onSuccess: (data) => {
          console.log('Payment completed:', data)
          setSuccess(true)
          // Redirect or show success message
          // window.location.href = `/booking/success/${data.bookingId}`
        },
        
        // Failure callback
        onFailure: (error) => {
          console.error('Payment failed:', error)
          setError(error.description || error.message || 'Payment failed')
        }
      })

      console.log('Payment flow completed:', result)

    } catch (err) {
      console.error('Payment error:', err)
      setError(err.description || err.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="payment-container">
      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <p>✅ Payment successful! Your booking is confirmed.</p>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading || success}
        className="btn-primary"
      >
        {loading ? 'Processing...' : success ? 'Payment Complete' : 'Pay Now'}
      </button>

      {loading && (
        <div className="payment-info">
          <p>Please complete the payment in the Razorpay window...</p>
        </div>
      )}
    </div>
  )
}

export default PaymentButton
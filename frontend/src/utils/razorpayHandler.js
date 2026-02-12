// Frontend Payment Handler - Add this to your React component
// File: frontend/src/utils/razorpayHandler.js

import { API_BASE_URL } from '../config/api.js'

/**
 * Initialize and open Razorpay payment modal
 * @param {Object} orderData - Data from backend create-order API
 * @param {Object} options - Additional options for Razorpay
 * @returns {Promise} - Resolves on successful payment, rejects on failure
 */
export const initiateRazorpayPayment = (orderData, options = {}) => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay script is loaded
    if (typeof window.Razorpay === 'undefined') {
      reject(new Error('Razorpay SDK not loaded. Please check your internet connection.'))
      return
    }

    const {
      orderId,
      amount,
      currency,
      keyId,
      prefill = {},
      notes = {}
    } = orderData

    // Razorpay options
    const razorpayOptions = {
      key: keyId, // CRITICAL: Must be key_id from Razorpay dashboard
      amount: amount, // Amount in paise
      currency: currency,
      name: options.businessName || 'Spiritual Services',
      description: options.description || 'Payment for services',
      image: options.logo || '/logo.png', // Your logo URL
      order_id: orderId, // CRITICAL: Order ID from backend
      
      // Pre-fill customer details
      prefill: {
        name: prefill.name || options.customerName || '',
        email: prefill.email || options.customerEmail || '',
        contact: prefill.phone || options.customerPhone || ''
      },

      // Notes
      notes: {
        ...notes,
        ...options.notes
      },

      // Theme customization
      theme: {
        color: options.themeColor || '#3399cc'
      },

      // Modal configuration
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed by user')
          reject(new Error('Payment cancelled by user'))
        },
        // Prevents accidental closure
        escape: false,
        backdropclose: false
      },

      // Success handler
      handler: function(response) {
        console.log('✅ Payment successful:', response)
        resolve({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        })
      }
    }

    try {
      // Create Razorpay instance
      const razorpay = new window.Razorpay(razorpayOptions)

      // Handle payment failure
      razorpay.on('payment.failed', function(response) {
        console.error('❌ Payment failed:', response.error)
        reject({
          code: response.error.code,
          description: response.error.description,
          source: response.error.source,
          step: response.error.step,
          reason: response.error.reason,
          orderId: response.error.metadata.order_id,
          paymentId: response.error.metadata.payment_id
        })
      })

      // Open the payment modal
      razorpay.open()
      console.log('💳 Razorpay modal opened')

    } catch (error) {
      console.error('❌ Error initializing Razorpay:', error)
      reject(error)
    }
  })
}

/**
 * Complete payment flow - Create order, pay, and verify
 * @param {Object} paymentData - Payment details
 * @returns {Promise} - Resolves with verification response
 */
export const handlePaymentFlow = async (paymentData) => {
  try {
    const {
      service,
      bookingId,
      customerDetails,
      onSuccess,
      onFailure,
      ...razorpayOptions
    } = paymentData

    // Step 1: Create order on backend
    console.log('📝 Creating payment order...')
    const createOrderResponse = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if required
        // 'Authorization': `Bearer ${yourAuthToken}`
      },
      body: JSON.stringify({
        service,
        bookingId,
        customerDetails
      })
    })

    const orderData = await createOrderResponse.json()

    if (!orderData.success) {
      throw new Error(orderData.message || 'Failed to create order')
    }

    console.log('✅ Order created:', orderData.data.orderId)

    // Step 2: Open Razorpay modal and process payment
    console.log('💳 Opening Razorpay payment modal...')
    const paymentResponse = await initiateRazorpayPayment(
      orderData.data,
      {
        customerName: customerDetails?.name,
        customerEmail: customerDetails?.email,
        customerPhone: customerDetails?.phone,
        ...razorpayOptions
      }
    )

    // Step 3: Verify payment on backend
    console.log('🔐 Verifying payment...')
    const verifyResponse = await fetch(`${API_BASE_URL}/api/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if required
        // 'Authorization': `Bearer ${yourAuthToken}`
      },
      body: JSON.stringify({
        ...paymentResponse,
        bookingId
      })
    })

    const verificationData = await verifyResponse.json()

    if (!verificationData.success) {
      throw new Error(verificationData.message || 'Payment verification failed')
    }

    console.log('✅ Payment verified successfully')

    // Call success callback
    if (onSuccess) {
      onSuccess(verificationData.data)
    }

    return verificationData

  } catch (error) {
    console.error('❌ Payment flow error:', error)

    // Report failure to backend
    if (paymentData.bookingId) {
      try {
        await fetch(`${API_BASE_URL}/api/payments/failure`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: paymentData.bookingId,
            error: {
              description: error.message || 'Payment failed'
            }
          })
        })
      } catch (reportError) {
        console.error('Failed to report payment failure:', reportError)
      }
    }

    // Call failure callback
    if (paymentData.onFailure) {
      paymentData.onFailure(error)
    }

    throw error
  }
}
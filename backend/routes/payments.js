import express from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { body, validationResult } from 'express-validator'
import rateLimit from 'express-rate-limit'
import Booking from '../models/Booking.js'

const router = express.Router()

// Rate limiter for payment routes
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: {
    success: false,
    message: 'Too many payment attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured')
  }
  
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}

// Service prices in paise (multiply by 100)
const servicePrices = {
  'tarot': 110000, // ₹1,100
  'reiki': 155100, // ₹1,551
  'water-divination': 2100000, // ₹21,000
  'spiritual-consultation': 250000, // ₹2,500
  'group-session': 80000 // ₹800
}

// Validation middleware for create order
const validateCreateOrder = [
  body('service')
    .notEmpty()
    .withMessage('Service is required')
    .isIn(Object.keys(servicePrices))
    .withMessage('Invalid service selected'),
  body('bookingId')
    .optional()
    .isMongoId()
    .withMessage('Invalid booking ID format'),
  body('customerDetails')
    .optional()
    .isObject()
    .withMessage('Customer details must be an object'),
  body('customerDetails.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('customerDetails.email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('customerDetails.phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid Indian phone number')
]

// Validation middleware for verify payment
const validateVerifyPayment = [
  body('razorpay_order_id')
    .notEmpty()
    .withMessage('Order ID is required'),
  body('razorpay_payment_id')
    .notEmpty()
    .withMessage('Payment ID is required'),
  body('razorpay_signature')
    .notEmpty()
    .withMessage('Signature is required'),
  body('bookingId')
    .optional()
    .isMongoId()
    .withMessage('Invalid booking ID format')
]

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Public (add protect middleware for authenticated routes)
router.post('/create-order', paymentLimiter, validateCreateOrder, async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { service, bookingId, customerDetails } = req.body

    // Get amount for the service
    const amount = servicePrices[service]
    
    // If bookingId is provided, verify it exists and is not already paid
    if (bookingId) {
      const booking = await Booking.findById(bookingId)
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        })
      }

      if (booking.paymentStatus === 'COMPLETED') {
        return res.status(400).json({
          success: false,
          message: 'Payment already completed for this booking'
        })
      }

      // Update booking to PENDING
      booking.paymentStatus = 'PENDING'
      await booking.save()
    }
    
    try {
      const razorpay = getRazorpayInstance()
      
      const options = {
        amount, // Amount in paise
        currency: 'INR',
        receipt: `receipt_${bookingId || Date.now()}`,
        notes: {
          service,
          bookingId: bookingId || '',
          serviceName: service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }
      }

      console.log('Creating Razorpay order with options:', options)
      const order = await razorpay.orders.create(options)
      console.log('✅ Razorpay order created successfully:', order.id)

      // Return order details with key_id for frontend
      res.status(200).json({
        success: true,
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: process.env.RAZORPAY_KEY_ID, // Public key - safe to expose
          // Additional data for Razorpay checkout options
          prefill: customerDetails || {},
          notes: options.notes
        }
      })
    } catch (razorpayError) {
      console.error('❌ Razorpay API error:', {
        message: razorpayError.message,
        statusCode: razorpayError.statusCode,
        error: razorpayError.error
      })
      
      // Revert booking status if it was updated
      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          paymentStatus: 'FAILED'
        })
      }

      return res.status(500).json({
        success: false,
        message: 'Unable to create payment order. Please try again.',
        ...(process.env.NODE_ENV === 'development' && { 
          details: razorpayError.message 
        })
      })
    }

  } catch (error) {
    console.error('❌ Payment order creation error:', error)
    next(error)
  }
})

// @desc    Verify payment signature
// @route   POST /api/payments/verify
// @access  Public
router.post('/verify', paymentLimiter, validateVerifyPayment, async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      bookingId 
    } = req.body

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    const isSignatureValid = expectedSignature === razorpay_signature

    if (!isSignatureValid) {
      console.error('❌ Payment signature verification failed')
      
      // Update booking status to failed
      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          paymentStatus: 'FAILED'
        })
      }

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.'
      })
    }

    console.log('✅ Payment signature verified successfully')

    // Update booking with payment details
    let updatedBooking = null
    if (bookingId) {
      const booking = await Booking.findById(bookingId)
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        })
      }

      // Prevent duplicate payment processing
      if (booking.paymentStatus === 'COMPLETED' && booking.paymentId) {
        return res.status(200).json({
          success: true,
          message: 'Payment already verified',
          data: {
            paymentId: booking.paymentId,
            orderId: booking.orderId,
            bookingId: booking._id
          }
        })
      }

      booking.paymentStatus = 'COMPLETED'
      booking.paymentId = razorpay_payment_id
      booking.orderId = razorpay_order_id
      booking.paidAt = new Date()
      updatedBooking = await booking.save()

      console.log('✅ Booking updated with payment details:', bookingId)
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        bookingId: updatedBooking?._id || null
      }
    })

  } catch (error) {
    console.error('❌ Payment verification error:', error)
    
    // Update booking to failed on error
    if (req.body.bookingId) {
      try {
        await Booking.findByIdAndUpdate(req.body.bookingId, {
          paymentStatus: 'FAILED'
        })
      } catch (updateError) {
        console.error('Failed to update booking status:', updateError)
      }
    }
    
    next(error)
  }
})

// @desc    Handle payment failure
// @route   POST /api/payments/failure
// @access  Public
router.post('/failure', async (req, res, next) => {
  try {
    const { orderId, bookingId, error } = req.body

    console.log('❌ Payment failed:', { orderId, bookingId, error })

    // Update booking status to failed
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'FAILED',
        orderId: orderId || null,
        failureReason: error?.description || 'Payment failed'
      })
    }

    res.status(200).json({
      success: false,
      message: error?.description || 'Payment failed. Please try again.'
    })

  } catch (error) {
    console.error('❌ Payment failure handler error:', error)
    next(error)
  }
})

// @desc    Razorpay webhook handler
// @route   POST /api/payments/webhook
// @access  Public (verified via signature)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('❌ Webhook secret not configured')
    return res.status(500).json({ error: 'Webhook not configured' })
  }

  const signature = req.headers['x-razorpay-signature']

  try {
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex')

    if (expectedSignature !== signature) {
      console.error('❌ Invalid webhook signature')
      return res.status(400).json({ error: 'Invalid signature' })
    }

    const event = req.body.event
    const paymentEntity = req.body.payload.payment.entity

    console.log('📥 Webhook received:', event)

    // Handle different events
    switch (event) {
      case 'payment.captured':
        await Booking.findOneAndUpdate(
          { orderId: paymentEntity.order_id },
          { 
            paymentStatus: 'COMPLETED',
            paymentId: paymentEntity.id,
            paidAt: new Date()
          }
        )
        console.log('✅ Payment captured via webhook:', paymentEntity.id)
        break

      case 'payment.failed':
        await Booking.findOneAndUpdate(
          { orderId: paymentEntity.order_id },
          { 
            paymentStatus: 'FAILED',
            failureReason: paymentEntity.error_description
          }
        )
        console.log('❌ Payment failed via webhook:', paymentEntity.id)
        break

      default:
        console.log('ℹ️ Unhandled webhook event:', event)
    }

    res.json({ status: 'ok' })
  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

// @desc    Get Razorpay key (for frontend initialization)
// @route   GET /api/payments/config
// @access  Public
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      keyId: process.env.RAZORPAY_KEY_ID
    }
  })
})

export default router
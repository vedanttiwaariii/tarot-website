import express from 'express'
import rateLimit from 'express-rate-limit'
import Contact from '../models/Contact.js'
import { validate, contactSchema } from '../middleware/validation.js'
import { authenticateAdmin } from '../middleware/auth.js'

const router = express.Router()

// Rate limiting for contact form
const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 contact form submissions per windowMs
  message: {
    success: false,
    message: "Too many contact form submissions, please try again later."
  }
})

// Rate limiting for admin contact operations
const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 admin operations per windowMs
  message: {
    success: false,
    message: "Too many admin requests, please try again later."
  }
})

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', contactRateLimit, validate(contactSchema), async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message
    })

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: contact._id,
        name: contact.name,
        subject: contact.subject
      }
    })

  } catch (error) {
    next(error)
  }
})

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private (Admin)
router.get('/', adminRateLimit, authenticateAdmin, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    
    const filter = {}
    if (status) filter.status = status

    const messages = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v')

    const total = await Contact.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    next(error)
  }
})

export default router
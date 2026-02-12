import express from 'express'
import rateLimit from 'express-rate-limit'
import AccessCode from '../models/AccessCode.js'
import { authenticateAdmin } from '../middleware/auth.js'
import { validate, accessCodeSchema, validateAccessCodeSchema } from '../middleware/validation.js'

const router = express.Router()

// Rate limiting for access code validation (public)
const validateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 validation attempts per windowMs
  message: {
    success: false,
    message: "Too many validation attempts, please try again later."
  }
})

// Rate limiting for admin access code operations
const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 admin operations per windowMs
  message: {
    success: false,
    message: "Too many admin requests, please try again later."
  }
})

// @desc    Validate access code
// @route   POST /api/access-codes/validate
// @access  Public
router.post('/validate', validateRateLimit, validate(validateAccessCodeSchema), async (req, res, next) => {
  try {
    const { code, userIdentifier } = req.body

    const accessCode = await AccessCode.findOne({ 
      code: code.toUpperCase() 
    })

    if (!accessCode) {
      return res.status(404).json({
        success: false,
        message: 'Invalid access code'
      })
    }

    const validation = accessCode.isValid(userIdentifier)
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.reason
      })
    }

    res.status(200).json({
      success: true,
      message: 'Access code is valid',
      data: {
        code: accessCode.code,
        remainingUses: accessCode.maxUses - accessCode.usedCount
      }
    })

  } catch (error) {
    next(error)
  }
})

// @desc    Create access code (Admin)
// @route   POST /api/access-codes
// @access  Private (Admin)
router.post('/', adminRateLimit, authenticateAdmin, validate(accessCodeSchema), async (req, res, next) => {
  try {
    const { code, expiresAt, maxUses, allowedUser } = req.body

    const accessCode = await AccessCode.create({
      code: code.toUpperCase(),
      expiresAt: new Date(expiresAt),
      maxUses,
      allowedUser: allowedUser?.toLowerCase()
    })

    res.status(201).json({
      success: true,
      message: 'Access code created successfully',
      data: accessCode
    })

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Access code already exists'
      })
    }
    next(error)
  }
})

// @desc    Get all access codes (Admin)
// @route   GET /api/access-codes
// @access  Private (Admin)
router.get('/', adminRateLimit, authenticateAdmin, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    
    const filter = {}
    if (status) filter.status = status

    const accessCodes = await AccessCode.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await AccessCode.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: accessCodes,
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

// @desc    Update access code status (Admin)
// @route   PUT /api/access-codes/:id
// @access  Private (Admin)
router.put('/:id', adminRateLimit, authenticateAdmin, async (req, res, next) => {
  try {
    const { status } = req.body
    
    if (!['active', 'disabled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active or disabled'
      })
    }

    const accessCode = await AccessCode.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!accessCode) {
      return res.status(404).json({
        success: false,
        message: 'Access code not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Access code updated successfully',
      data: accessCode
    })

  } catch (error) {
    next(error)
  }
})

export default router
import express from 'express'
import { body, validationResult } from 'express-validator'
import Service from '../models/Service.js'
import { authenticateAdmin } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ displayOrder: 1 })
    res.json({ success: true, data: services })
  } catch (error) {
    next(error)
  }
})

// @desc    Get single service
// @route   GET /api/services/:serviceType
// @access  Public
router.get('/:serviceType', async (req, res, next) => {
  try {
    const service = await Service.findOne({ serviceType: req.params.serviceType, isActive: true })
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' })
    }
    res.json({ success: true, data: service })
  } catch (error) {
    next(error)
  }
})

// @desc    Update service content
// @route   PUT /api/services/:serviceType
// @access  Admin
router.put('/:serviceType', authenticateAdmin, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('shortDescription').optional().trim().isLength({ max: 200 }).withMessage('Short description max 200 chars'),
  body('fullDescription').optional().trim().notEmpty().withMessage('Full description cannot be empty'),
  body('features').optional().isArray().withMessage('Features must be an array'),
  body('duration').optional().trim(),
  body('isActive').optional().isBoolean()
], async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }

  try {
    const service = await Service.findOneAndUpdate(
      { serviceType: req.params.serviceType },
      req.body,
      { new: true, runValidators: true }
    )

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' })
    }

    res.json({ success: true, message: 'Service updated successfully', data: service })
  } catch (error) {
    next(error)
  }
})

// @desc    Get all services (including inactive) - Admin only
// @route   GET /api/services/admin/all
// @access  Admin
router.get('/admin/all', authenticateAdmin, async (req, res, next) => {
  try {
    const services = await Service.find().sort({ displayOrder: 1 })
    res.json({ success: true, data: services })
  } catch (error) {
    next(error)
  }
})

export default router

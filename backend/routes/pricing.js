import express from 'express';
import { body, validationResult } from 'express-validator';
import ServicePricing from '../models/ServicePricing.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all service pricing
// @route   GET /api/pricing
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const pricing = await ServicePricing.find({ isActive: true });
    res.json({ success: true, data: pricing });
  } catch (error) {
    next(error);
  }
});

// @desc    Update service pricing
// @route   PUT /api/pricing/:serviceId
// @access  Private (Admin)
router.put('/:serviceId', authenticateAdmin, [
  body('price').isNumeric().withMessage('Price must be a number'),
  body('name').optional().trim()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { price, name, originalPrice, specialEvent, validUntil } = req.body;
    
    let pricing = await ServicePricing.findOne({ serviceId: req.params.serviceId });
    
    if (pricing) {
      pricing.price = price;
      if (name) pricing.name = name;
      if (originalPrice !== undefined) pricing.originalPrice = originalPrice;
      if (specialEvent !== undefined) pricing.specialEvent = specialEvent;
      if (validUntil !== undefined) pricing.validUntil = validUntil;
      await pricing.save();
    } else {
      pricing = await ServicePricing.create({
        serviceId: req.params.serviceId,
        name: name || req.params.serviceId,
        price,
        originalPrice,
        specialEvent,
        validUntil
      });
    }
    
    res.json({ success: true, data: pricing });
  } catch (error) {
    next(error);
  }
});

// @desc    Set special event pricing
// @route   POST /api/pricing/special-event
// @access  Private (Admin)
router.post('/special-event', authenticateAdmin, [
  body('serviceId').notEmpty().withMessage('Service ID is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('specialEvent').notEmpty().withMessage('Event name is required')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { serviceId, price, specialEvent, validUntil } = req.body;
    
    const pricing = await ServicePricing.findOne({ serviceId });
    if (!pricing) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    pricing.originalPrice = pricing.price;
    pricing.price = price;
    pricing.specialEvent = specialEvent;
    pricing.validUntil = validUntil || null;
    await pricing.save();
    
    res.json({ success: true, data: pricing });
  } catch (error) {
    next(error);
  }
});

// @desc    Remove special event pricing
// @route   DELETE /api/pricing/special-event/:serviceId
// @access  Private (Admin)
router.delete('/special-event/:serviceId', authenticateAdmin, async (req, res, next) => {
  try {
    const pricing = await ServicePricing.findOne({ serviceId: req.params.serviceId });
    if (!pricing) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (pricing.originalPrice) {
      pricing.price = pricing.originalPrice;
    }
    pricing.originalPrice = null;
    pricing.specialEvent = null;
    pricing.validUntil = null;
    await pricing.save();
    
    res.json({ success: true, data: pricing });
  } catch (error) {
    next(error);
  }
});

export default router;

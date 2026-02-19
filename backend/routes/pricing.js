import express from 'express'
import Pricing from '../models/Pricing.js'
import { authenticateAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get all pricing
router.get('/', async (req, res) => {
  try {
    const pricing = await Pricing.find()
    res.json({ success: true, data: pricing })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update pricing (Admin only)
router.put('/:service', authenticateAdmin, async (req, res) => {
  try {
    const { basePrice, discount, saleActive, saleLabel } = req.body
    
    let pricing = await Pricing.findOne({ service: req.params.service })
    
    if (!pricing) {
      pricing = new Pricing({
        service: req.params.service,
        basePrice: basePrice || 0
      })
    }
    
    if (basePrice !== undefined) pricing.basePrice = basePrice
    if (discount !== undefined) pricing.discount = discount
    if (saleActive !== undefined) pricing.saleActive = saleActive
    if (saleLabel !== undefined) pricing.saleLabel = saleLabel
    
    await pricing.save()
    
    res.json({ success: true, data: pricing })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Initialize default prices
router.post('/initialize', authenticateAdmin, async (req, res) => {
  try {
    const defaults = [
      { service: 'tarot', basePrice: 110000 },
      { service: 'reiki', basePrice: 155100 },
      { service: 'water-divination', basePrice: 2100000 },
      { service: 'spiritual-consultation', basePrice: 250000 }
    ]
    
    for (const def of defaults) {
      await Pricing.findOneAndUpdate(
        { service: def.service },
        { ...def, currentPrice: def.basePrice },
        { upsert: true, new: true }
      )
    }
    
    const pricing = await Pricing.find()
    res.json({ success: true, data: pricing })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router

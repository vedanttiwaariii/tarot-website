import express from 'express';
import { body, validationResult } from 'express-validator';
import Content from '../models/Content.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all content sections
// @route   GET /api/content
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const content = await Content.find();
    const contentMap = {};
    content.forEach(item => {
      contentMap[item.sectionId] = item.content;
    });
    res.json({ success: true, data: contentMap });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single content section
// @route   GET /api/content/:sectionId
// @access  Public
router.get('/:sectionId', async (req, res, next) => {
  try {
    const content = await Content.findOne({ sectionId: req.params.sectionId });
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
});

// @desc    Update content section
// @route   PUT /api/content/:sectionId
// @access  Private (Admin)
router.put('/:sectionId', authenticateAdmin, [
  body('content').notEmpty().withMessage('Content is required')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { content, type } = req.body;
    
    let contentDoc = await Content.findOne({ sectionId: req.params.sectionId });
    
    if (contentDoc) {
      contentDoc.content = content;
      if (type) contentDoc.type = type;
      contentDoc.updatedBy = req.user?.email || 'admin';
      await contentDoc.save();
    } else {
      contentDoc = await Content.create({
        sectionId: req.params.sectionId,
        type: type || 'text',
        content,
        updatedBy: req.user?.email || 'admin'
      });
    }
    
    res.json({ success: true, data: contentDoc });
  } catch (error) {
    next(error);
  }
});

// @desc    Bulk update content sections
// @route   POST /api/content/bulk-update
// @access  Private (Admin)
router.post('/bulk-update', authenticateAdmin, async (req, res, next) => {
  try {
    const { sections } = req.body;
    
    if (!sections || !Array.isArray(sections)) {
      return res.status(400).json({ success: false, message: 'Invalid sections data' });
    }

    const updates = sections.map(section => 
      Content.findOneAndUpdate(
        { sectionId: section.sectionId },
        { 
          content: section.content, 
          type: section.type || 'text',
          updatedBy: req.user?.email || 'admin'
        },
        { upsert: true, new: true }
      )
    );

    await Promise.all(updates);
    res.json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

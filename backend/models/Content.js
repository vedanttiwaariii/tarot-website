import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'richtext', 'list', 'object'],
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  updatedBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

const Content = mongoose.model('Content', contentSchema);
export default Content;

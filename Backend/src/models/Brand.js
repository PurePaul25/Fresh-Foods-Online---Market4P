import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    unique: true,
    trim: true
  },
  logo: {
    type: String,
    default: null
  },
  description: {
    type: String,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
brandSchema.index({ is_active: 1 });

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
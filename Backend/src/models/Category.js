import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  image: {
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
categorySchema.index({ is_active: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  }],
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, 'Brand is required']
  },
  rating_average: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  is_active: {
    type: Boolean,
    default: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for filtering and sorting
productSchema.index({ category_id: 1, is_active: 1 });
productSchema.index({ brand_id: 1, is_active: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating_average: -1 });
productSchema.index({ deletedAt: 1 });

// Virtual for review count
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product_id'
});

const Product = mongoose.model('Product', productSchema);

export default Product;
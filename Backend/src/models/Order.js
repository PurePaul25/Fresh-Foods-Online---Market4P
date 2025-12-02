import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  items: [{
    product_name: {
      type: String,
      required: true
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  shipping_address: {
    street: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
    phone: String
  },
  payment_method: {
    type: String,
    enum: ['cash_on_delivery', 'credit_card', 'debit_card', 'paypal', 'bank_transfer'],
    default: 'cash_on_delivery'
  },
  total_price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for queries
orderSchema.index({ user_id: 1, created_at: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ created_at: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
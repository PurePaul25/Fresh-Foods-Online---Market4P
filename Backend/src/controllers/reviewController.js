import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';

/**
 * POST /products/:id/reviews - Create product review
 * Only allowed if user has purchased and received the product
 */
export const createReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { rating, comment } = req.body;

    // Check if product exists
    const product = await Product.findOne({ 
      _id: productId, 
      is_active: true, 
      deletedAt: null 
    });
    
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Check if user has purchased and received this product
    const order = await Order.findOne({
      user_id: userId,
      'items.product_id': productId,
      status: 'delivered'
    });

    if (!order) {
      throw new ApiError(403, 'You can only review products you have purchased and received');
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user_id: userId,
      product_id: productId
    });

    if (existingReview) {
      throw new ApiError(400, 'You have already reviewed this product');
    }

    // Create review
    const review = await Review.create({
      user_id: userId,
      product_id: productId,
      rating,
      comment
    });

    // Recalculate product rating average
    const reviews = await Review.find({ product_id: productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    product.rating_average = Math.round(avgRating * 10) / 10; // Round to 1 decimal
    await product.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user_id', 'name email');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /products/:id/reviews - Get all reviews for a product
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ product_id: productId })
        .populate('user_id', 'name')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ product_id: productId })
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};
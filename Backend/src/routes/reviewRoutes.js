import express from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get reviews for a product (public)
router.get('/:id/reviews', getProductReviews);

// Create review (authenticated users only)
router.post('/:id/reviews', authenticate, createReview);

export default router;
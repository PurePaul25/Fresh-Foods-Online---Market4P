import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { uploadMultiple } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  uploadMultiple,
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  uploadMultiple,
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  deleteProduct
);

export default router;
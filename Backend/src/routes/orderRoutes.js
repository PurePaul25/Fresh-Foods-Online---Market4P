import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// User routes
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getUserOrders);

// Admin routes
router.get('/admin/all', authenticate, authorize(['admin']), getAllOrders);
router.put('/:id/status', authenticate, authorize(['admin']), updateOrderStatus);

export default router;
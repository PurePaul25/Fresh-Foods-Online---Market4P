import express from 'express';
import { getDashboardStats, getRevenueAnalytics } from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorize(['admin']));

router.get('/stats', getDashboardStats);
router.get('/revenue', getRevenueAnalytics);

export default router;
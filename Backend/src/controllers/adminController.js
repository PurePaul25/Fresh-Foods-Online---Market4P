import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

/**
 * GET /admin/stats - Get admin dashboard statistics
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    // Get current date and first day of current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Total Revenue (all delivered orders)
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total_price' } } }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // 2. Total Orders
    const totalOrders = await Order.countDocuments();

    // 3. Top 5 Best-Selling Products
    const bestSellingProducts = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'shipping', 'delivered'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product_id',
          productName: { $first: '$items.product_name' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          productName: 1,
          totalQuantity: 1,
          totalRevenue: 1
        }
      }
    ]);

    // 4. New Users This Month
    const User = mongoose.model('User');
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: firstDayOfMonth }
    });

    // 5. Additional Stats
    const [pendingOrders, lowStockProducts] = await Promise.all([
      Order.countDocuments({ status: 'pending' }),
      Product.countDocuments({ stock: { $lt: 10 }, is_active: true, deletedAt: null })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        newUsersThisMonth,
        lowStockProducts,
        bestSellingProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /admin/revenue - Get revenue analytics
 */
export const getRevenueAnalytics = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query; // 'week', 'month', 'year'

    let groupBy;
    let dateRange = new Date();

    switch (period) {
      case 'week':
        dateRange.setDate(dateRange.getDate() - 7);
        groupBy = { $dayOfMonth: '$created_at' };
        break;
      case 'year':
        dateRange.setFullYear(dateRange.getFullYear() - 1);
        groupBy = { $month: '$created_at' };
        break;
      case 'month':
      default:
        dateRange.setMonth(dateRange.getMonth() - 1);
        groupBy = { $dayOfMonth: '$created_at' };
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          created_at: { $gte: dateRange }
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$total_price' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period,
        analytics: revenueData
      }
    });
  } catch (error) {
    next(error);
  }
};
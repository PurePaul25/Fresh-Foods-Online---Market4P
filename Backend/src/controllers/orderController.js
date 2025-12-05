import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { getPagination, formatPaginatedResponse } from "../utils/pagination.js";

/**
 * POST /orders - Create new order (User)
 * Uses MongoDB transaction to ensure data consistency
 */
export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { shipping_address, payment_method } = req.body;

    // Check if user is banned
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (user.isBanned) {
      throw new ApiError(
        403,
        `Tài khoản của bạn đã bị chặn. Lý do: ${
          user.bannedReason || "Không có lý do cụ thể"
        }. Bạn không thể tiếp tục mua hàng.`
      );
    }

    // Get user's cart
    const cart = await Cart.findOne({ user_id: userId })
      .populate("items.product_id")
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    // Validate stock and prepare order items
    const orderItems = [];
    let totalPrice = 0;

    for (const item of cart.items) {
      const product = item.product_id;

      // Check if product exists and is active
      if (!product || !product.is_active || product.deletedAt) {
        throw new ApiError(
          400,
          `Product ${product?.name || "unknown"} is not available`
        );
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for ${product.name}. Available: ${product.stock}`
        );
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save({ session });

      // Add to order items
      orderItems.push({
        product_id: product._id,
        product_name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      totalPrice += product.price * item.quantity;
    }

    // Create order
    const order = await Order.create(
      [
        {
          user_id: userId,
          items: orderItems,
          shipping_address,
          payment_method,
          total_price: totalPrice,
          status: "pending",
        },
      ],
      { session }
    );

    // Clear cart
    cart.items = [];
    await cart.save({ session });

    // Commit transaction
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order[0],
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

/**
 * GET /orders - Get user's order history
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page, limit, status } = req.query;

    const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

    const filter = { user_id: userId };
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ created_at: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
    ]);

    const response = formatPaginatedResponse(orders, total, pageNum, limitNum);

    res.status(200).json({
      success: true,
      ...response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /admin/orders - Get all orders (Admin)
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;

    const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

    const filter = {};
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user_id", "name email")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    const response = formatPaginatedResponse(orders, total, pageNum, limitNum);

    res.status(200).json({
      success: true,
      ...response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /admin/orders/:id/status - Update order status (Admin)
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "shipping",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      throw new ApiError(
        400,
        `Invalid status. Valid statuses: ${validStatuses.join(", ")}`
      );
    }

    const order = await Order.findById(id);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

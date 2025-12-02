import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';

/**
 * GET /cart - Get user's cart
 */
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user_id: userId })
      .populate('items.product_id', 'name price images stock is_active');

    if (!cart) {
      cart = await Cart.create({ user_id: userId, items: [] });
    }

    // Filter out inactive products
    cart.items = cart.items.filter(item => 
      item.product_id && item.product_id.is_active
    );

    // Calculate total
    const total = cart.items.reduce((sum, item) => 
      sum + (item.product_id.price * item.quantity), 0
    );

    res.status(200).json({
      success: true,
      data: {
        cart,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /cart/add - Add item to cart
 */
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    // Validate product
    const product = await Product.findOne({ 
      _id: product_id, 
      is_active: true, 
      deletedAt: null 
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    if (product.stock < quantity) {
      throw new ApiError(400, `Only ${product.stock} items available in stock`);
    }

    // Get or create cart
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      cart = await Cart.create({ user_id: userId, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product_id.toString() === product_id
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        throw new ApiError(400, `Cannot add more. Only ${product.stock} items available`);
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({ product_id, quantity });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ user_id: userId })
      .populate('items.product_id', 'name price images');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /cart/update - Update cart item quantity
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    if (quantity < 1) {
      throw new ApiError(400, 'Quantity must be at least 1');
    }

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      item => item.product_id.toString() === product_id
    );

    if (itemIndex === -1) {
      throw new ApiError(404, 'Item not found in cart');
    }

    // Check stock
    const product = await Product.findById(product_id);
    if (quantity > product.stock) {
      throw new ApiError(400, `Only ${product.stock} items available`);
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ user_id: userId })
      .populate('items.product_id', 'name price images');

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /cart/remove - Remove item from cart
 */
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    cart.items = cart.items.filter(
      item => item.product_id.toString() !== product_id
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user_id: userId })
      .populate('items.product_id', 'name price images');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /cart/clear - Clear entire cart
 */
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    next(error);
  }
};
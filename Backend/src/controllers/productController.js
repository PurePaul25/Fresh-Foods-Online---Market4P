import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import ApiError from '../utils/ApiError.js';
import { getPagination, formatPaginatedResponse } from '../utils/pagination.js';
import { uploadToCloudinary, deleteMultipleFromCloudinary } from '../config/cloudinary.js';

/**
 * GET /products - Get all products with filtering and pagination
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const { page, limit, category, brand, minPrice, maxPrice, minRating, search, status, minDiscount, maxDiscount } = req.query;

    const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

    // Build filter query
    const filter = { is_active: true, deletedAt: null };

    if (category) filter.category_id = category;
    if (brand) filter.brand_id = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (minRating) filter.rating_average = { $gte: parseFloat(minRating) };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) filter.status = status;
    if (minDiscount || maxDiscount) {
      filter.discount = {};
      if (minDiscount) filter.discount.$gte = parseFloat(minDiscount);
      if (maxDiscount) filter.discount.$lte = parseFloat(maxDiscount);
    }


    // Execute query with pagination
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category_id', 'name')
        .populate('brand_id', 'name logo')
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      Product.countDocuments(filter)
    ]);

    const response = formatPaginatedResponse(products, total, pageNum, limitNum);

    res.status(200).json({
      success: true,
      ...response
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /products/:id - Get single product by ID
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      is_active: true,
      deletedAt: null
    })
      .populate('category_id', 'name image')
      .populate('brand_id', 'name logo');

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /products - Create new product (Admin only)
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, stock, category_id, brand_id, status, discount } = req.body;

    // Validate category and brand exist
    const [category, brand] = await Promise.all([
      Category.findById(category_id),
      Brand.findById(brand_id)
    ]);

    if (!category) throw new ApiError(404, 'Category not found');
    if (!brand) throw new ApiError(404, 'Brand not found');

    // Upload images to Cloudinary
    const images = [];
    if (req.files && req.files.length > 0) {
      // console.log('Files:', req.files);
      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer, 'ecommerce/products')
      );
      const uploadResults = await Promise.all(uploadPromises);
      images.push(...uploadResults);
    }

    // Create product
    const product = await Product.create({
      name,
      price,
      description,
      stock,
      category_id,
      brand_id,
      images,
      status,
      discount
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('category_id', 'name')
      .populate('brand_id', 'name logo');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    next(error);
  }
};

/**
 * PUT /products/:id - Update product (Admin only)
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findOne({ _id: id, deletedAt: null });
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Validate category and brand if provided
    if (updateData.category_id) {
      const category = await Category.findById(updateData.category_id);
      if (!category) throw new ApiError(404, 'Category not found');
    }
    if (updateData.brand_id) {
      const brand = await Brand.findById(updateData.brand_id);
      if (!brand) throw new ApiError(404, 'Brand not found');
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const oldImageIds = product.images.map(img => img.public_id);
      if (oldImageIds.length > 0) {
        await deleteMultipleFromCloudinary(oldImageIds);
      }

      const uploadResults = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer, 'ecommerce/products'))
      );

      updateData.images = uploadResults;
    }


    // Update product
    Object.assign(product, updateData);
    await product.save();

    const updatedProduct = await Product.findById(id)
      .populate('category_id', 'name')
      .populate('brand_id', 'name logo');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /products/:id - Soft delete product (Admin only)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm sản phẩm
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Lấy danh sách public_id của ảnh
    const publicIds = product.images?.map(img => img.public_id) || [];

    // Xóa ảnh Cloudinary
    if (publicIds.length > 0) {
      await deleteMultipleFromCloudinary(publicIds);
    }

    // Xóa sản phẩm khỏi MongoDB
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted permanently (DB + Cloudinary)'
    });
  } catch (error) {
    next(error);
  }
};
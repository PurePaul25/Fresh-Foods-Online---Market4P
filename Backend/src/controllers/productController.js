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
    let {
      name,
      price,
      description,
      stock,
      category_id,
      brand_id,
      status,
      discount,
      // Hỗ trợ frontend gửi tên thay vì id
      category,
      brand
    } = req.body;

    // Chuẩn hóa / tạo Category nếu frontend chỉ gửi tên
    let categoryDoc = null;
    if (category_id) {
      categoryDoc = await Category.findById(category_id);
    } else if (category) {
      categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        // Tự tạo Category mới nếu chưa tồn tại
        categoryDoc = await Category.create({ name: category });
      }
      category_id = categoryDoc._id;
    }

    // Chuẩn hóa / tạo Brand nếu frontend chỉ gửi tên
    let brandDoc = null;
    if (brand_id) {
      brandDoc = await Brand.findById(brand_id);
    } else if (brand) {
      brandDoc = await Brand.findOne({ name: brand });
      if (!brandDoc) {
        // Tự tạo Brand mới nếu chưa tồn tại
        brandDoc = await Brand.create({ name: brand });
      }
      brand_id = brandDoc._id;
    }

    if (!categoryDoc) throw new ApiError(404, 'Category not found');
    if (!brandDoc) throw new ApiError(404, 'Brand not found');

    // Upload images (ưu tiên Cloudinary; nếu lỗi thì fallback sang base64 nội bộ)
    const images = [];
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map(file =>
          uploadToCloudinary(file.buffer, 'ecommerce/products')
        );
        const uploadResults = await Promise.all(uploadPromises);
        images.push(...uploadResults);
      } catch (err) {
        // Nếu Cloudinary lỗi (ví dụ thiếu api_key), fallback sang lưu base64 để ảnh vẫn hiển thị được
        console.error(
          'Image upload to Cloudinary failed, falling back to base64 URLs:',
          err.message || err
        );
        req.files.forEach((file) => {
          images.push({
            url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
            public_id: 'local-base64'
          });
        });
      }
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
    const updateData = { ...req.body };

    const product = await Product.findOne({ _id: id, deletedAt: null });
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Chuẩn hóa / tạo Category nếu frontend chỉ gửi tên
    if (!updateData.category_id && updateData.category) {
      let foundCategory = await Category.findOne({ name: updateData.category });
      if (!foundCategory) {
        foundCategory = await Category.create({ name: updateData.category });
      }
      updateData.category_id = foundCategory._id;
    }

    // Chuẩn hóa / tạo Brand nếu frontend chỉ gửi tên
    if (!updateData.brand_id && updateData.brand) {
      let foundBrand = await Brand.findOne({ name: updateData.brand });
      if (!foundBrand) {
        foundBrand = await Brand.create({ name: updateData.brand });
      }
      updateData.brand_id = foundBrand._id;
    }

    // Validate category and brand if provided (phòng trường hợp gửi sai id)
    if (updateData.category_id) {
      const category = await Category.findById(updateData.category_id);
      if (!category) throw new ApiError(404, 'Category not found');
    }
    if (updateData.brand_id) {
      const brand = await Brand.findById(updateData.brand_id);
      if (!brand) throw new ApiError(404, 'Brand not found');
    }

    // Không lưu thừa các field hiển thị bên ngoài
    delete updateData.category;
    delete updateData.brand;

    // Handle new image uploads (ưu tiên Cloudinary, fallback base64)
    if (req.files && req.files.length > 0) {
      try {
        const oldImageIds = product.images.map(img => img.public_id);
        if (oldImageIds.length > 0) {
          await deleteMultipleFromCloudinary(oldImageIds);
        }

        const uploadResults = await Promise.all(
          req.files.map(file => uploadToCloudinary(file.buffer, 'ecommerce/products'))
        );

        updateData.images = uploadResults;
      } catch (err) {
        console.error(
          'Image upload to Cloudinary failed on update, falling back to base64 URLs:',
          err.message || err
        );
        updateData.images = req.files.map((file) => ({
          url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          public_id: 'local-base64'
        }));
      }
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

    // Xóa ảnh Cloudinary (nếu đã cấu hình); nếu Cloudinary lỗi thì chỉ log và tiếp tục xóa sản phẩm
    if (publicIds.length > 0) {
      try {
        await deleteMultipleFromCloudinary(publicIds);
      } catch (err) {
        console.error(
          'Failed to delete images from Cloudinary, continuing to delete product only:',
          err.message || err
        );
      }
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
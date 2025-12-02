import { z } from 'zod';

// Product validation
export const createProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  price: z.number().positive('Price must be positive'),
  description: z.string().optional(),
  stock: z.number().int().nonnegative('Stock cannot be negative').default(0),
  category_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
  brand_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid brand ID')
});

export const updateProductSchema = createProductSchema.partial();

// Order validation
export const createOrderSchema = z.object({
  shipping_address: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postal_code: z.string().min(3, 'Postal code is required'),
    country: z.string().min(2, 'Country is required'),
    phone: z.string().regex(/^[0-9+\-\s()]+$/, 'Invalid phone number')
  }),
  payment_method: z.enum(['cash_on_delivery', 'credit_card', 'debit_card', 'paypal', 'bank_transfer'])
});

// Review validation
export const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').optional()
});

// Cart validation
export const addToCartSchema = z.object({
  product_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be positive').default(1)
});

export const updateCartSchema = z.object({
  product_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be positive')
});

// Brand validation
export const createBrandSchema = z.object({
  name: z.string().min(2, 'Brand name must be at least 2 characters'),
  description: z.string().optional()
});

// Category validation
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional()
});
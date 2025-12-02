// middlewares/validationMiddleware.js
import { ZodError } from 'zod';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware factory to validate request body using Zod schema
 * @param {ZodSchema} schema - Zod validation schema
 */
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // Parse and validate request body
      const validatedData = await schema.parseAsync(req.body);
      
      // Replace req.body with validated data
      req.body = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return next(new ApiError(400, JSON.stringify(errorMessages)));
      }
      next(error);
    }
  };
};
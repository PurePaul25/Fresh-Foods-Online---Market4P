import ApiError from '../utils/ApiError.js';

/**
 * Middleware to authorize user based on role
 * @param {Array} allowedRoles - Array of allowed roles ['admin', 'user']
 */
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ApiError(403, 'Access denied. Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
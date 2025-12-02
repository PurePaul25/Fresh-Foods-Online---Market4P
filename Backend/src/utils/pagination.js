/**
 * Helper function to calculate pagination
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @returns {Object} - { skip, limit, page }
 */
export const getPagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  return {
    skip,
    limit: limitNum,
    page: pageNum
  };
};

/**
 * Format pagination response
 * @param {Array} data - Data array
 * @param {Number} total - Total count
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @returns {Object} - Formatted response with pagination info
 */
export const formatPaginatedResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};
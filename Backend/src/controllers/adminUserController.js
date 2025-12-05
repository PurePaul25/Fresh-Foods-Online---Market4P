import User from '../models/User.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import { getPagination, formatPaginatedResponse } from '../utils/pagination.js';

/**
 * GET /api/admin/users - Get all users with pagination and search
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const { page, limit, search, role, isBanned } = req.query;

        const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

        // Build filter query
        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (role) {
            filter.role = role;
        }

        if (isBanned !== undefined) {
            filter.isBanned = isBanned === 'true';
        }

        // Execute query
        const [users, total] = await Promise.all([
            User.find(filter)
                .select('-password -resetPasswordToken -resetPasswordExpire')
                .populate('bannedBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            User.countDocuments(filter)
        ]);

        const response = formatPaginatedResponse(users, total, pageNum, limitNum);

        res.status(200).json({
            success: true,
            ...response
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/admin/users/:id - Get single user details
 */
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select('-password')
            .populate('bannedBy', 'name email');

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Get user statistics
        const [totalOrders, totalSpent] = await Promise.all([
            Order.countDocuments({ user_id: id }),
            Order.aggregate([
                { $match: { user_id: user._id, status: 'delivered' } },
                { $group: { _id: null, total: { $sum: '$total_price' } } }
            ])
        ]);

        res.status(200).json({
            success: true,
            data: {
                user,
                statistics: {
                    totalOrders,
                    totalSpent: totalSpent[0]?.total || 0
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/admin/users/:id/ban - Ban a user
 */
export const banUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const adminId = req.user.id;

        // Validate reason
        if (!reason || reason.trim().length === 0) {
            throw new ApiError(400, 'Ban reason is required');
        }

        // Find user
        const user = await User.findById(id);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Prevent banning admin accounts
        // if (user.role === 'admin') {
        //     throw new ApiError(403, 'Cannot ban admin accounts');
        // }

        if (user._id.toString() === adminId) {
            throw new ApiError(403, 'You cannot ban yourself');
        }

        // Prevent banning yourself
        if (user._id.toString() === adminId) {
            throw new ApiError(403, 'You cannot ban yourself');
        }

        // Check if already banned
        if (user.isBanned) {
            throw new ApiError(400, `User is already banned. Reason: ${user.bannedReason}`);
        }

        // Ban the user
        user.isBanned = true;
        user.bannedReason = reason.trim();
        user.bannedAt = new Date();
        user.bannedBy = adminId;

        await user.save();

        // Get updated user with populated bannedBy
        const updatedUser = await User.findById(id)
            .select('-password')
            .populate('bannedBy', 'name email');

        res.status(200).json({
            success: true,
            message: 'User has been banned successfully',
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/admin/users/:id/unban - Unban a user
 */
export const unbanUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find user
        const user = await User.findById(id);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Check if user is banned
        if (!user.isBanned) {
            throw new ApiError(400, 'User is not currently banned');
        }

        // Unban the user
        user.isBanned = false;
        user.bannedReason = null;
        user.bannedAt = null;
        user.bannedBy = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'User has been unbanned successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/admin/users/:id - Permanently delete a user
 */
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        // Find user
        const user = await User.findById(id);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Prevent deleting admin accounts
        if (user.role === 'admin') {
            throw new ApiError(403, 'Cannot delete admin accounts');
        }

        // Prevent deleting yourself
        if (user._id.toString() === adminId) {
            throw new ApiError(403, 'You cannot delete yourself');
        }

        // HARD DELETE - Permanently remove from database
        await User.findByIdAndDelete(id);

        // Optional: You might want to handle related data
        // For example, anonymize orders instead of deleting them
        // await Order.updateMany(
        //   { user_id: id },
        //   { $set: { user_id: null, userName: 'Deleted User' } }
        // );

        res.status(200).json({
            success: true,
            message: 'User has been permanently deleted',
            data: {
                deletedUserId: id,
                deletedUserEmail: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/admin/users/:id/role - Change user role
 */
export const changeUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const adminId = req.user.id;

        // Validate role
        if (!['user', 'admin'].includes(role)) {
            throw new ApiError(400, 'Invalid role. Must be "user" or "admin"');
        }

        // Find user
        const user = await User.findById(id);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Prevent changing your own role
        if (user._id.toString() === adminId) {
            throw new ApiError(403, 'You cannot change your own role');
        }

        // Update role
        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User role updated to ${role}`,
            data: user
        });
    } catch (error) {
        next(error);
    }
};


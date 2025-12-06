// backend/controllers/notificationController.js
import Notification from "../models/Notification.js"

// @desc    Get user notifications with filter and pagination
// @route   GET /api/notification
// @access  Private
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user._id
        const { type = "all", page = 1, limit = 10 } = req.query

        let filter

        if (type === "all") {
            // Lấy cả thông báo riêng của user VÀ tất cả broadcast
            filter = {
                $or: [{ recipient_id: userId }, { type: "broadcast" }],
            }
        } else if (type === "broadcast") {
            // Chỉ lấy broadcast (tất cả users đều thấy)
            filter = { type: "broadcast" }
        } else {
            // Các loại khác chỉ lấy của user hiện tại
            filter = {
                recipient_id: userId,
                type: type,
            }
        }

        // Calculate pagination
        const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)
        const total = await Notification.countDocuments(filter)
        const pages = Math.ceil(total / Number.parseInt(limit))

        // Fetch notifications
        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 }) // Newest first
            .skip(skip)
            .limit(Number.parseInt(limit))

        res.status(200).json({
            success: true,
            data: notifications,
            pagination: {
                page: Number.parseInt(page),
                limit: Number.parseInt(limit),
                pages,
                total,
            },
        })
    } catch (error) {
        console.error("Error fetching notifications:", error)
        res.status(500).json({
            success: false,
            message: "Không thể tải thông báo",
            error: error.message,
        })
    }
}

// @desc    Get unread notifications count
// @route   GET /api/notification/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id

        const unreadCount = await Notification.countDocuments({
            $or: [
                { recipient_id: userId, isRead: false },
                { type: "broadcast", isRead: false },
            ],
        })

        res.status(200).json({
            success: true,
            count: unreadCount,
        })
    } catch (error) {
        console.error("Error getting unread count:", error)
        res.status(500).json({
            success: false,
            message: "Không thể đếm thông báo chưa đọc",
            error: error.message,
        })
    }
}

// @desc    Mark notification as read
// @route   PATCH /api/notification/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const notification = await Notification.findOneAndUpdate(
            {
                _id: id,
                $or: [{ recipient_id: userId }, { type: "broadcast" }],
            },
            { isRead: true, updatedAt: new Date() },
            { new: true },
        )

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thông báo",
            })
        }

        res.status(200).json({
            success: true,
            message: "Đã đánh dấu là đã đọc",
            data: notification,
        })
    } catch (error) {
        console.error("Error marking notification as read:", error)
        res.status(500).json({
            success: false,
            message: "Không thể đánh dấu thông báo",
            error: error.message,
        })
    }
}

// @desc    Mark all notifications as read
// @route   PATCH /api/notification/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id

        const result = await Notification.updateMany(
            {
                isRead: false,
                $or: [{ recipient_id: userId }, { type: "broadcast" }],
            },
            { isRead: true, updatedAt: new Date() },
        )

        res.status(200).json({
            success: true,
            message: "Đã đánh dấu tất cả là đã đọc",
            modifiedCount: result.modifiedCount,
        })
    } catch (error) {
        console.error("Error marking all as read:", error)
        res.status(500).json({
            success: false,
            message: "Không thể đánh dấu tất cả",
            error: error.message,
        })
    }
}

// @desc    Delete single notification
// @route   DELETE /api/notification/:id
// @access  Private
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        // Lưu ý: Broadcast khi xóa sẽ xóa cho tất cả users
        const notification = await Notification.findOneAndDelete({
            _id: id,
            $or: [{ recipient_id: userId }, { type: "broadcast" }],
        })

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thông báo",
            })
        }

        res.status(200).json({
            success: true,
            message: "Đã xóa thông báo",
        })
    } catch (error) {
        console.error("Error deleting notification:", error)
        res.status(500).json({
            success: false,
            message: "Không thể xóa thông báo",
            error: error.message,
        })
    }
}

// @desc    Delete all notifications
// @route   DELETE /api/notification
// @access  Private
export const deleteAllNotifications = async (req, res) => {
    try {
        const userId = req.user._id

        // Vì broadcast là chung cho tất cả users
        const result = await Notification.deleteMany({
            recipient_id: userId,
            type: { $ne: "broadcast" }, // Không xóa broadcast
        })

        res.status(200).json({
            success: true,
            message: "Đã xóa tất cả thông báo cá nhân",
            deletedCount: result.deletedCount,
        })
    } catch (error) {
        console.error("Error deleting all notifications:", error)
        res.status(500).json({
            success: false,
            message: "Không thể xóa tất cả thông báo",
            error: error.message,
        })
    }
}

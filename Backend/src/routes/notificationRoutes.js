import express from "express"
import {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    getUnreadCount,
} from "../controllers/notificationController.js"
import { protectedRoute } from "../middlewares/authMiddleware.js"

const router = express.Router()

// All routes are protected - user must be authenticated
router.use(protectedRoute)

// GET /api/notification - Get user's notifications with filters and pagination
router.get("/", getUserNotifications)

// GET /api/notification/unread-count - Get unread notifications count
router.get("/unread-count", getUnreadCount)

// PATCH /api/notification/:id/read - Mark single notification as read
router.patch("/:id/read", markAsRead)

// PATCH /api/notification/read-all - Mark all notifications as read
router.patch("/read-all", markAllAsRead)

// DELETE /api/notification/:id - Delete single notification
router.delete("/:id", deleteNotification)

// DELETE /api/notification - Delete all notifications
router.delete("/", deleteAllNotifications)

export default router

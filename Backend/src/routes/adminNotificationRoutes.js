import express from "express";
import {
    getAdminNotifications,
    broadcastNotification,
    updateBroadcast,
    deleteBroadcast,
    getBroadcastHistory
} from "../controllers/adminNotificationController.js";
import { protectedRoute, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protectedRoute);
router.use(adminOnly);

// GET admin notifications
router.get("/", getAdminNotifications);

// POST broadcast new notification
router.post("/broadcast", broadcastNotification);

// PUT update broadcast
router.put("/broadcast/:id", updateBroadcast);

// DELETE broadcast
router.delete("/broadcast/:id", deleteBroadcast);

// GET broadcast history
router.get("/broadcast-history", getBroadcastHistory);

export default router;

// backend/models/Notification.js
import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["broadcast", "order_placed", "order_confirmed", "order_shipped", "order_delivered", "order_cancelled"],
        },
        recipient_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        sender_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        idempotencyKey: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    {
        timestamps: true,
    },
)

// Compound indexes for efficient queries
notificationSchema.index({ recipient_id: 1, createdAt: -1 })
notificationSchema.index({ recipient_id: 1, isRead: 1 })
notificationSchema.index({ recipient_id: 1, type: 1 })
// Index for broadcast queries
notificationSchema.index({ type: 1, createdAt: -1 })

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification

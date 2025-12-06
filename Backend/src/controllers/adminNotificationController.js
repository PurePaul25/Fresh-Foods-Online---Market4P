import Notification from "../models/notificationModel.js";

export const getAdminNotifications = async (req, res) => {
    const { type, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (type !== "all") filter.type = type;

    const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json({ notifications });
};

export const broadcastNotification = async (req, res) => {
    const { title, message, type } = req.body;

    const notification = await Notification.create({
        title,
        message,
        type,
        isBroadcast: true,
    });

    res.json({ success: true, notification });
};

export const updateBroadcast = async (req, res) => {
    const { id } = req.params;

    const updated = await Notification.findByIdAndUpdate(id, req.body, {
        new: true,
    });

    res.json({ success: true, updated });
};

export const deleteBroadcast = async (req, res) => {
    const { id } = req.params;

    await Notification.findByIdAndDelete(id);

    res.json({ success: true });
};

export const getBroadcastHistory = async (req, res) => {
    const history = await Notification.find({ isBroadcast: true }).sort({
        createdAt: -1,
    });

    res.json({ history });
};

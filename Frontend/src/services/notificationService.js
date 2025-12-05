import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const notificationAPI = `${API_URL}/notifications`;

// Helper function để lấy headers với token
const getAuthHeaders = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
        return {
            "Content-Type": "application/json",
        };
    }

    const userData = JSON.parse(userStr);
    const token = userData?.accessToken;

    return {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
    };
};

// Lấy thông báo của user
export const fetchUserNotifications = async (
    filterType = "all",
    page = 1,
    limit = 10
) => {
    try {
        const response = await axios.get(`${notificationAPI}/user`, {
            params: { filterType, page, limit },
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user notifications:", error);
        throw error;
    }
};

// Lấy thông báo inbox của admin
export const fetchAdminNotifications = async (
    filterType = "all",
    page = 1,
    limit = 10
) => {
    try {
        const response = await axios.get(`${notificationAPI}/admin`, {
            params: { filterType, page, limit },
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch admin notifications:", error);
        throw error;
    }
};

// Lấy số thông báo chưa đọc
export const fetchUnreadCount = async () => {
    try {
        const response = await axios.get(`${notificationAPI}/unread-count`, {
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch unread count:", error);
        throw error;
    }
};

// Đánh dấu thông báo là đã đọc
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await axios.put(
            `${notificationAPI}/${notificationId}/read`,
            {},
            {
                headers: getAuthHeaders(),
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to mark notification as read:", error);
        throw error;
    }
};

// Đánh dấu tất cả thông báo là đã đọc
export const markAllNotificationsAsRead = async () => {
    try {
        const response = await axios.put(
            `${notificationAPI}/read-all`,
            {},
            {
                headers: getAuthHeaders(),
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
        throw error;
    }
};

// Xóa thông báo
export const deleteSingleNotification = async (notificationId) => {
    try {
        const response = await axios.delete(
            `${notificationAPI}/${notificationId}`,
            {
                headers: getAuthHeaders(),
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to delete notification:", error);
        throw error;
    }
};

// Xóa broadcast
export const deleteBroadcast = async (idempotencyKey) => {
    try {
        const response = await axios.delete(
            `${notificationAPI}/broadcast/${idempotencyKey}`,
            {
                headers: getAuthHeaders(),
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to delete broadcast:", error);
        throw error;
    }
};

// Xóa tất cả thông báo
export const deleteAllNotifications = async () => {
    try {
        const response = await axios.delete(`${notificationAPI}/all`, {
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Failed to delete all notifications:", error);
        throw error;
    }
};

// Gửi thông báo broadcast cho tất cả user
export const sendBroadcastNotification = async (
    title,
    message,
    priority = "medium",
    requestId = null
) => {
    try {
        const response = await axios.post(
            `${notificationAPI}/broadcast`,
            {
                title,
                message,
                priority,
                ...(requestId && { idempotencyKey: requestId }), // Include idempotency key if provided
            },
            {
                headers: getAuthHeaders(),
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to send broadcast notification:", error);
        throw error;
    }
};

// Lấy lịch sử broadcast thông báo
export const fetchBroadcastHistory = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(`${notificationAPI}/broadcast-history`, {
            params: { page, limit },
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch broadcast history:", error);
        throw error;
    }
};

// Cập nhật thông báo broadcast
export const updateBroadcast = async (
    idempotencyKey,
    title,
    message,
    priority
) => {
    try {
        const response = await axios.put(
            `${notificationAPI}/broadcast/${idempotencyKey}`,
            { title, message, priority },
            {
                headers: getAuthHeaders(),
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to update broadcast notification:", error);
        throw error;
    }
};

// Cập nhật một thông báo đơn lẻ
export const updateSingleNotification = async (
    notificationId,
    title,
    message,
    priority
) => {
    try {
        const response = await axios.put(
            `${notificationAPI}/${notificationId}`,
            { title, message, priority },
            {
                headers: getAuthHeaders(),
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to update single notification:", error);
        throw error;
    }
};

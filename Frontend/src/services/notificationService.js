// ================================
// Base API Config
// ================================
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://fresh-foods-online-market4p.onrender.com";

const getAuthToken = () => {
  // Check multiple possible token storage keys
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt");
  return token;
};

const fetchAPI = async (url, options = {}) => {
  try {
    const fullUrl = `${API_URL}${url}`;
    const token = getAuthToken();

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, {
      method: "GET",
      credentials: "include", // Still send cookies as backup
      headers,
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        status: response.status,
        message: data.message || "Có lỗi xảy ra",
      };
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      error: true,
      message: error.message || "Không thể kết nối đến server",
    };
  }
};

// ================================
// User Notification APIs
// ================================

// Fetch list notifications
export const fetchUserNotifications = async (
  type = "all",
  page = 1,
  limit = 10
) => {
  try {
    const params = new URLSearchParams({
      type,
      page: String(page),
      limit: String(limit),
    });
    return await fetchAPI(`/api/notification?${params}`);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Get unread notification count
export const getUnreadCount = async () => {
  try {
    return await fetchAPI("/api/notification/unread-count");
  } catch (error) {
    console.error("Error getting unread count:", error);
    throw error;
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    return await fetchAPI(`/api/notification/${notificationId}/read`, {
      method: "PATCH",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    return await fetchAPI("/api/notification/read-all", {
      method: "PATCH",
    });
  } catch (error) {
    console.error("Error marking all as read:", error);
    throw error;
  }
};

// Delete a single notification
export const deleteSingleNotification = async (notificationId) => {
  try {
    return await fetchAPI(`/api/notification/${notificationId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Alias for backward compatibility
export const deleteNotification = deleteSingleNotification;

// Delete all notifications
export const deleteAllNotifications = async () => {
  try {
    return await fetchAPI("/api/notification", {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    throw error;
  }
};

// ================================
// Admin Notification APIs
// ================================

// Fetch admin notification list
export const fetchAdminNotifications = async (
  type = "all",
  page = 1,
  limit = 10
) => {
  const params = new URLSearchParams({
    type,
    page: String(page),
    limit: String(limit),
  });
  return await fetchAPI(`/api/notification/admin?${params}`);
};

// Send broadcast notification
export const sendBroadcastNotification = async (
  title,
  message,
  priority = "medium",
  idempotencyKey = null
) => {
  const body = { title, message, priority };
  if (idempotencyKey) {
    body.idempotencyKey = idempotencyKey;
  }
  return await fetchAPI(`/api/notification/broadcast`, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

// Update broadcast notification
export const updateBroadcast = async (
  id,
  title,
  message,
  priority = "medium"
) => {
  return await fetchAPI(`/api/notification/broadcast/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, message, priority }),
  });
};

// Delete broadcast notification
export const deleteBroadcast = async (id) => {
  return await fetchAPI(`/api/notification/broadcast/${id}`, {
    method: "DELETE",
  });
};

// Fetch broadcast history
export const fetchBroadcastHistory = async (page = 1, limit = 50) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return await fetchAPI(`/api/notification/broadcast-history?${params}`);
};

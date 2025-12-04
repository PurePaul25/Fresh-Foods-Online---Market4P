import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Bell,
  Package,
  CheckCheck,
  Truck,
  PartyPopper,
  XCircle,
  Trash2,
  MailCheck,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";
import {
  fetchUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteSingleNotification,
  deleteAllNotifications,
} from "../../services/notificationService";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const limit = 10;

  // Tải thông báo
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchUserNotifications(filterType, page, limit);

      if (response.success) {
        setNotifications(response.data);
        setPagination(response.pagination);
      } else {
        toast.error("Không thể tải thông báo");
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast.error("Lỗi khi tải thông báo");
    } finally {
      setLoading(false);
    }
  }, [filterType, page]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Đánh dấu là đã đọc
  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await markNotificationAsRead(notificationId);

      if (response.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        toast.success("Đã đánh dấu là đã đọc");
      }
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Không thể đánh dấu");
    }
  };

  // Đánh dấu tất cả là đã đọc
  const handleMarkAllAsRead = async () => {
    try {
      const response = await markAllNotificationsAsRead();

      if (response.success) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true }))
        );
        toast.success("Đã đánh dấu tất cả");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Không thể đánh dấu tất cả");
    }
  };

  // Xóa thông báo
  const handleDeleteSingleNotification = async (notificationId) => {
    try {
      const response = await deleteSingleNotification(notificationId);

      if (response.success) {
        setNotifications((prev) =>
          prev.filter((notif) => notif._id !== notificationId)
        );
        toast.success("Đã xóa thông báo");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Không thể xóa thông báo");
    }
  };

  // Xóa tất cả
  const handleDeleteAll = async () => {
    if (window.confirm("Bạn có chắc muốn xóa tất cả thông báo?")) {
      try {
        const response = await deleteAllNotifications();

        if (response.success) {
          setNotifications([]);
          toast.success("Đã xóa tất cả thông báo");
        }
      } catch (error) {
        console.error("Error deleting all notifications:", error);
        toast.error("Không thể xóa tất cả");
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "broadcast":
        return <Bell className="text-yellow-500" />;
      case "order_placed":
        return <Package className="text-blue-500" />;
      case "order_confirmed":
        return <CheckCheck className="text-green-500" />;
      case "order_shipped":
        return <Truck className="text-purple-500" />;
      case "order_delivered":
        return <PartyPopper className="text-teal-500" />;
      case "order_cancelled":
        return <XCircle className="text-red-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-30 pb-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Hộp thư thông báo
            </h1>
            <p className="text-gray-500">
              Theo dõi cập nhật đơn hàng và các thông báo quan trọng từ Market4P
            </p>
          </motion.div>

          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 flex flex-wrap gap-2"
          >
            {[
              { value: "all", label: "Tất cả" },
              { value: "broadcast", label: "Chung" },
              { value: "order_placed", label: "Đặt hàng" },
              { value: "order_confirmed", label: "Xác nhận" },
              { value: "order_shipped", label: "Đang giao" },
              { value: "order_delivered", label: "Đã giao" },
              { value: "order_cancelled", label: "Hủy" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setFilterType(filter.value);
                  setPage(1);
                }}
                className={`px-4 py-2 text-sm cursor-pointer font-medium rounded-full transition-colors duration-200 ${
                  filterType === filter.value
                    ? "bg-amber-500 text-white shadow"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 flex justify-end gap-3"
          >
            <button
              onClick={handleMarkAllAsRead}
              disabled={notifications.length === 0}
              className="flex items-center gap-2 cursor-pointer duration-200 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              <MailCheck size={16} /> Đánh dấu tất cả đã đọc
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={notifications.length === 0}
              className="flex items-center gap-2 cursor-pointer duration-200 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 size={16} /> Xóa tất cả
            </button>
          </motion.div>

          {/* Notifications List */}
          <div className="space-y-4">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="inline-block">
                  <div className="animate-spin">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">Đang tải thông báo...</p>
              </motion.div>
            ) : notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300"
              >
                <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-700 text-lg mt-4 font-medium">
                  Bạn không có thông báo nào
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Tất cả các thông báo sẽ hiển thị ở đây
                </p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification._id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative group p-4 rounded-lg border transition-all duration-300 shadow-sm ${
                      notification.isRead
                        ? "bg-white border-gray-200"
                        : "bg-amber-50/50 border-amber-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="text-2xl mt-1 shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full border">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-semibold text-gray-800">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="shrink-0 w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                              locale: vi,
                            }
                          )}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="shrink-0 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-1.5 rounded-full text-gray-400 hover:bg-green-100 hover:text-green-600 transition-colors"
                            title="Đánh dấu đã đọc"
                          >
                            <MailCheck size={16} />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteSingleNotification(notification._id)
                          }
                          className="p-1.5 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                          title="Xóa thông báo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex justify-between items-center"
            >
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex items-center gap-2 cursor-pointer duration-200 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
                Trang trước
              </button>

              <span className="text-sm text-gray-600">
                Trang <span className="font-semibold">{pagination.page}</span> /{" "}
                <span className="font-semibold">{pagination.pages}</span>
              </span>

              <button
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
                className="flex items-center gap-2 cursor-pointer duration-200 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Trang sau
                <ChevronRight size={16} />
              </button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Notifications;

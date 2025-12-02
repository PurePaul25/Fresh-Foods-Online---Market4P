import React, { useState, useEffect, useMemo } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../Layout/notificationApi";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Bell,
  Package,
  Users,
  BarChart3,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  Trash2,
  Megaphone,
  SendHorizonal,
  Edit,
  Eye,
  Save,
} from "lucide-react";
import Spinner from "../Layout/Spinner";
import toast from "react-hot-toast";
import ConfirmationModal from "../Layout/ConfirmationModal";
import AnnouncementDetailModal from "./AnnouncementDetailModal";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

// --- Dữ liệu giả lập cho Lịch sử gửi thông báo ---
const initialSentAnnouncements = [
  {
    id: "ANNOUNCE001",
    title: "🎉 Khuyến mãi Black Friday - Giảm đến 50%!",
    message:
      "Đừng bỏ lỡ cơ hội mua sắm trái cây tươi ngon với giá cực sốc trong dịp Black Friday. Áp dụng từ 24/11 đến 26/11.",
    sentAt: "2025-11-23T10:00:00Z",
    sentBy: "Admin",
  },
  {
    id: "ANNOUNCE002",
    title: "📢 Thông báo bảo trì hệ thống",
    message:
      "Hệ thống sẽ được bảo trì vào lúc 2h sáng ngày 20/11 để nâng cấp. Xin cảm ơn.",
    sentAt: "2025-11-19T15:30:00Z",
    sentBy: "Admin",
  },
];

function AllNotifications() {
  const [allNotifications, setAllNotifications] = useState([]);
  const [sentAnnouncements, setSentAnnouncements] = useState(
    initialSentAnnouncements
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const [filterType, setFilterType] = useState("all"); // 'all', 'order', 'customer', etc.
  const itemsPerPage = 7; // Số lượng thông báo mỗi trang
  const [activeTab, setActiveTab] = useState("system"); // 'system' hoặc 'broadcast'
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
  });
  const [isDeleteAnnouncementModalOpen, setDeleteAnnouncementModalOpen] =
    useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  useEffect(() => {
    // Chỉ fetch khi ở tab "system"
    if (activeTab !== "system") {
      return;
    }
    setLoading(true);
    fetchNotifications()
      .then((data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setAllNotifications(sortedData);
      })
      .catch((err) => console.error("Failed to fetch notifications:", err))
      .finally(() => {
        setLoading(false);
      });
  }, [activeTab]); // Thêm activeTab vào dependency array

  const handleNotificationClick = (notificationId) => {
    const notification = allNotifications.find((n) => n.id === notificationId);

    if (notification && !notification.read) {
      const updatedNotifications = allNotifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      setAllNotifications(updatedNotifications);

      markNotificationAsRead(notificationId).catch((err) => {
        console.error("Failed to mark notification as read:", err);
        setAllNotifications(allNotifications); // Khôi phục nếu lỗi
      });
    }
  };

  const handleMarkAllAsRead = () => {
    setMarkingAsRead(true);
    markAllNotificationsAsRead()
      .then((updatedNotifications) => {
        // Sắp xếp lại vì API trả về mảng không theo thứ tự timestamp
        const sortedData = updatedNotifications.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setAllNotifications(sortedData);
      })
      .catch((err) => console.error("Failed to mark all as read:", err))
      .finally(() => setMarkingAsRead(false));
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleDeleteNotification = (notificationId) => {
    // Cập nhật UI trước để có hiệu ứng mượt mà
    const updatedNotifications = allNotifications.filter(
      (n) => n.id !== notificationId
    );
    setAllNotifications(updatedNotifications);

    // Gọi API giả
    deleteNotification(notificationId).catch((err) => {
      console.error("Failed to delete notification:", err);
      // Nếu lỗi, có thể khôi phục lại state (tùy vào yêu cầu)
    });
  };

  const handleDeleteAll = () => {
    setAllNotifications([]);
    deleteAllNotifications().catch((err) => {
      console.error("Failed to delete all notifications:", err);
    });
  };
  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "customer":
        return <Users className="w-5 h-5 text-green-500" />;
      case "report":
        return <BarChart3 className="w-5 h-5 text-purple-500" />;
      case "inventory":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const notificationCounts = useMemo(() => {
    return {
      all: allNotifications.length,
      order: allNotifications.filter((n) => n.type === "order").length,
      customer: allNotifications.filter((n) => n.type === "customer").length,
      inventory: allNotifications.filter((n) => n.type === "inventory").length,
      report: allNotifications.filter((n) => n.type === "report").length,
    };
  }, [allNotifications]);

  const handleAnnouncementChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.message) {
      toast.error("Vui lòng nhập cả tiêu đề và nội dung thông báo.");
      return;
    }

    // Giả lập việc gửi API
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        if (editingAnnouncement) {
          // Chế độ chỉnh sửa
          setSentAnnouncements((prev) =>
            prev.map((item) =>
              item.id === editingAnnouncement.id
                ? {
                    ...item,
                    title: newAnnouncement.title,
                    message: newAnnouncement.message,
                  }
                : item
            )
          );
        } else {
          // Chế độ thêm mới
          const newSentItem = {
            id: `ANNOUNCE${Date.now()}`,
            title: newAnnouncement.title,
            message: newAnnouncement.message,
            sentAt: new Date().toISOString(),
            sentBy: "Admin",
          };
          setSentAnnouncements((prev) => [newSentItem, ...prev]);
        }

        // Reset form và state
        setNewAnnouncement({ title: "", message: "" });
        setEditingAnnouncement(null);
        resolve();
      }, 1000);
    });

    toast.promise(promise, {
      loading: "Đang gửi thông báo...",
      success: editingAnnouncement
        ? "Thông báo đã được cập nhật!"
        : "Thông báo đã được gửi thành công!",
      error: "Gửi thông báo thất bại.",
    });
  };

  const handleDeleteAnnouncementClick = (announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteAnnouncementModalOpen(true);
  };

  const handleConfirmDeleteAnnouncement = () => {
    if (announcementToDelete) {
      setSentAnnouncements((prev) =>
        prev.filter((item) => item.id !== announcementToDelete.id)
      );
      toast.success(
        `Đã xóa thông báo: "${announcementToDelete.title.substring(0, 20)}..."`
      );
      setDeleteAnnouncementModalOpen(false);
      setAnnouncementToDelete(null);
    }
  };

  const handleEditAnnouncementClick = (announcement) => {
    setEditingAnnouncement(announcement);
    setNewAnnouncement({
      title: announcement.title,
      message: announcement.message,
    });
    // Có thể thêm logic cuộn lên đầu trang để người dùng thấy form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewDetailClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDetailModalOpen(true);
  };

  const filterOptions = [
    { value: "all", label: "Tất cả", icon: <Bell size={16} /> },
    { value: "order", label: "Đơn hàng", icon: <Package size={16} /> },
    { value: "customer", label: "Khách hàng", icon: <Users size={16} /> },
    { value: "inventory", label: "Kho", icon: <AlertCircle size={16} /> },
    { value: "report", label: "Báo cáo", icon: <BarChart3 size={16} /> },
  ];

  // Lọc thông báo trước khi phân trang
  const filteredNotifications =
    filterType === "all"
      ? allNotifications
      : allNotifications.filter((n) => n.type === filterType);

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = filteredNotifications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const hasUnread = allNotifications.some((n) => !n.read);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-6">
      <ConfirmationModal
        isOpen={isDeleteAnnouncementModalOpen}
        onClose={() => setDeleteAnnouncementModalOpen(false)}
        onConfirm={handleConfirmDeleteAnnouncement}
        title="Xác nhận xóa thông báo"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn thông báo "${announcementToDelete?.title}" không?`}
        confirmText="Xóa"
      />
      <AnnouncementDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        announcement={selectedAnnouncement}
      />
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center cursor-pointer gap-2 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "system"
              ? "border-b-2 border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <Bell size={18} />
          Thông báo hệ thống
        </button>
        <button
          onClick={() => setActiveTab("broadcast")}
          className={`flex items-center cursor-pointer gap-2 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "broadcast"
              ? "border-b-2 border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <Megaphone size={18} />
          Gửi thông báo chung
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "system" && (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Hộp thư đến
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={!hasUnread || markingAsRead}
                    className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors duration-200"
                  >
                    {markingAsRead ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <CheckCheck size={16} />
                    )}
                    <span>Đã đọc tất cả</span>
                  </button>
                  <button
                    onClick={handleDeleteAll}
                    disabled={allNotifications.length === 0}
                    className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                    <span>Xóa tất cả</span>
                  </button>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={`relative flex items-center cursor-pointer gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
                      filterType === option.value
                        ? "bg-amber-500 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                    <span
                      className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                        filterType === option.value
                          ? "bg-white/20 text-white"
                          : "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-100"
                      }`}
                    >
                      {notificationCounts[option.value]}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {currentNotifications.length > 0 ? (
                    currentNotifications.map((notif) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          x: -50,
                          transition: { duration: 0.3 },
                        }}
                        key={notif.id}
                        className={`relative group flex items-start gap-4 p-4 rounded-lg border transition-colors duration-200 ${
                          notif.read
                            ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                            : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        <div
                          onClick={() => handleNotificationClick(notif.id)}
                          className={`grow flex items-start gap-4 ${
                            !notif.read ? "cursor-pointer" : ""
                          }`}
                        >
                          <div className="shrink-0 mt-1">
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="grow">
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(notif.timestamp), {
                                addSuffix: true,
                                locale: vi,
                              })}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteNotification(notif.id)}
                          className="absolute top-2 right-2 p-1 rounded-full cursor-pointer text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      {filterType === "all"
                        ? "Bạn không có thông báo nào."
                        : `Không có thông báo nào thuộc loại "${filterType}".`}
                    </p>
                  )}
                </AnimatePresence>
              </div>

              {/* Component Phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center cursor-pointer px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Trang trước
                  </button>

                  <div className="text-sm text-gray-700 dark:text-gray-400">
                    Trang <span className="font-semibold">{currentPage}</span>{" "}
                    trên <span className="font-semibold">{totalPages}</span>
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center cursor-pointer px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Trang sau
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "broadcast" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form gửi thông báo */}
              <div
                className={`bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-all duration-300 ${
                  editingAnnouncement ? "ring-2 ring-amber-500" : ""
                }`}
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  {editingAnnouncement
                    ? "Chỉnh sửa thông báo"
                    : "Soạn thông báo mới"}
                </h2>
                <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                  <div>
                    <label
                      htmlFor="announcement-title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Tiêu đề
                    </label>
                    <input
                      id="announcement-title"
                      name="title"
                      type="text"
                      value={newAnnouncement.title}
                      onChange={handleAnnouncementChange}
                      className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Ví dụ: Sự kiện khuyến mãi cuối tuần"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="announcement-message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Nội dung
                    </label>
                    <textarea
                      id="announcement-message"
                      name="message"
                      rows="5"
                      value={newAnnouncement.message}
                      onChange={handleAnnouncementChange}
                      className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Nhập nội dung bạn muốn gửi đến tất cả người dùng..."
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-3">
                    {editingAnnouncement && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAnnouncement(null);
                          setNewAnnouncement({ title: "", message: "" });
                        }}
                        className="px-4 py-2 text-sm font-medium cursor-pointer duration-200 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                      >
                        Hủy
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex items-center cursor-pointer gap-2 px-6 py-2 text-sm font-medium duration-200 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {editingAnnouncement ? (
                        <Save size={16} />
                      ) : (
                        <SendHorizonal size={16} />
                      )}
                      {editingAnnouncement ? "Lưu thay đổi" : "Gửi đi"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Lịch sử gửi */}
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Lịch sử đã gửi
                </h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {sentAnnouncements.map((item) => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{
                          opacity: 0,
                          x: 50,
                          transition: { duration: 0.2 },
                        }}
                        className="relative group p-3 border-l-4 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 rounded-r-md"
                      >
                        <div className="pr-8">
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
                            {item.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Gửi bởi {item.sentBy} •{" "}
                            {formatDistanceToNow(new Date(item.sentAt), {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </p>
                        </div>
                        <button
                          onClick={() => handleViewDetailClick(item)}
                          className="absolute top-2 right-[72px] p-1.5 rounded-full cursor-pointer duration-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditAnnouncementClick(item)}
                          className="absolute top-2 right-10 p-1.5 rounded-full cursor-pointer duration-200 text-gray-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAnnouncementClick(item)}
                          className="absolute top-2 right-2 p-1.5 rounded-full cursor-pointer duration-200 text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default AllNotifications;

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  fetchAdminNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteSingleNotification,
  deleteAllNotifications,
  sendBroadcastNotification,
  fetchBroadcastHistory,
  updateBroadcast,
  deleteBroadcast,
} from "../../../services/notificationService.js";
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
const initialSentAnnouncements = [];

function AllNotifications() {
  // Track pending broadcast request with unique ID
  const pendingBroadcastRef = useRef(null);
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
    priority: "medium",
  });
  const [isDeleteAnnouncementModalOpen, setDeleteAnnouncementModalOpen] =
    useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Flag để prevent double submit

  useEffect(() => {
    // Chỉ fetch khi ở tab "system"
    if (activeTab !== "system") {
      return;
    }
    loadNotifications();
  }, [activeTab, currentPage, filterType]);

  useEffect(() => {
    // Load broadcast history khi tab chuyển sang "broadcast"
    if (activeTab === "broadcast") {
      loadBroadcastHistory();
    }
  }, [activeTab]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetchAdminNotifications(
        filterType,
        currentPage,
        itemsPerPage
      );
      if (response.success) {
        setAllNotifications(response.data);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      toast.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const loadBroadcastHistory = async () => {
    setLoading(true);
    try {
      const response = await fetchBroadcastHistory(1, 50);
      if (response.success) {
        setSentAnnouncements(response.data);
      }
    } catch (error) {
      console.error("Failed to load broadcast history:", error);
      toast.error("Không thể tải lịch sử gửi thông báo");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notificationId) => {
    const notification = allNotifications.find((n) => n._id === notificationId);

    if (notification && !notification.isRead) {
      markNotificationAsRead(notificationId)
        .then(() => {
          const updatedNotifications = allNotifications.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          );
          setAllNotifications(updatedNotifications);
        })
        .catch((err) => {
          console.error("Failed to mark notification as read:", err);
        });
    }
  };

  const handleMarkAllAsRead = () => {
    setMarkingAsRead(true);
    markAllNotificationsAsRead()
      .then(() => {
        const updatedNotifications = allNotifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        setAllNotifications(updatedNotifications);
        toast.success("Đã đánh dấu tất cả là đã đọc");
      })
      .catch((err) => {
        console.error("Failed to mark all as read:", err);
        toast.error("Không thể đánh dấu tất cả là đã đọc");
      })
      .finally(() => setMarkingAsRead(false));
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleDeleteSingleNotification = (notificationId) => {
    // Cập nhật UI trước để có hiệu ứng mượt mà
    const updatedNotifications = allNotifications.filter(
      (n) => n._id !== notificationId
    );
    setAllNotifications(updatedNotifications);

    // Gọi API
    deleteSingleNotification(notificationId)
      .then(() => {
        toast.success("Thông báo đã được xóa");
      })
      .catch((err) => {
        console.error("Failed to delete notification:", err);
        toast.error("Không thể xóa thông báo");
        // Khôi phục lại nếu lỗi
        loadNotifications();
      });
  };

  const handleDeleteAll = () => {
    deleteAllNotifications()
      .then(() => {
        setAllNotifications([]);
        toast.success("Đã xóa tất cả thông báo");
      })
      .catch((err) => {
        console.error("Failed to delete all notifications:", err);
        toast.error("Không thể xóa tất cả thông báo");
      });
  };
  const getNotificationIcon = (type) => {
    switch (type) {
      case "order_placed":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "order_confirmed":
        return <CheckCheck className="w-5 h-5 text-green-500" />;
      case "order_shipped":
        return <Megaphone className="w-5 h-5 text-purple-500" />;
      case "order_delivered":
        return <CheckCheck className="w-5 h-5 text-green-600" />;
      case "order_cancelled":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "broadcast":
        return <Bell className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const notificationCounts = useMemo(() => {
    return {
      all: allNotifications.length,
      order_placed: allNotifications.filter((n) => n.type === "order_placed")
        .length,
      order_confirmed: allNotifications.filter(
        (n) => n.type === "order_confirmed"
      ).length,
      order_shipped: allNotifications.filter((n) => n.type === "order_shipped")
        .length,
      order_delivered: allNotifications.filter(
        (n) => n.type === "order_delivered"
      ).length,
      order_cancelled: allNotifications.filter(
        (n) => n.type === "order_cancelled"
      ).length,
    };
  }, [allNotifications]);

  const handleAnnouncementChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAnnouncement = (e) => {
    e.preventDefault();

    // Prevent double submission - check if request already pending
    if (isSubmitting || isSending || pendingBroadcastRef.current) {
      console.warn(
        "Request already in progress, ignoring duplicate submission"
      );
      return;
    }

    if (!newAnnouncement.title || !newAnnouncement.message) {
      toast.error("Vui lòng nhập cả tiêu đề và nội dung thông báo.");
      return;
    }

    // Generate unique request ID
    const requestId = `broadcast_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    pendingBroadcastRef.current = requestId;

    setIsSubmitting(true);
    setIsSending(true);

    // Gửi thông báo broadcast qua API
    sendBroadcastNotification(
      newAnnouncement.title,
      newAnnouncement.message,
      newAnnouncement.priority,
      requestId // Pass requestId to backend
    )
      .then((response) => {
        if (response.success) {
          toast.success(`Thông báo đã được gửi cho tất cả người dùng!`);
          // Tải lại lịch sử để đảm bảo dữ liệu mới nhất
          loadBroadcastHistory();

          // Reset form
          setNewAnnouncement({ title: "", message: "", priority: "medium" });
          setEditingAnnouncement(null);
        } else {
          // Hiển thị lỗi từ server nếu có
          toast.error(
            response.message || "Không thể gửi thông báo (lỗi không xác định)."
          );
        }
      })
      .catch((error) => {
        console.error("Failed to send broadcast:", error);
        toast.error("Không thể gửi thông báo");
      })
      .finally(() => {
        // Clear pending request
        pendingBroadcastRef.current = null;
        setIsSending(false);
        setIsSubmitting(false);
      });
  };

  const handleDeleteAnnouncementClick = (announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteAnnouncementModalOpen(true);
  };

  const handleConfirmDeleteAnnouncement = async () => {
    if (announcementToDelete) {
      try {
        // Delete from API and MongoDB
        await deleteBroadcast(announcementToDelete._id);

        setSentAnnouncements((prev) =>
          prev.filter((item) => item._id !== announcementToDelete._id)
        );
        toast.success(
          `Đã xóa thông báo: "${announcementToDelete.title.substring(
            0,
            20
          )}..."`
        );
        setDeleteAnnouncementModalOpen(false);
        setAnnouncementToDelete(null);
      } catch (error) {
        console.error("Failed to delete announcement:", error);
        toast.error("Không thể xóa thông báo");
      }
    }
  };

  const handleEditAnnouncementClick = (announcement) => {
    // Populate form with announcement data for editing
    setNewAnnouncement({
      title: announcement.title,
      message: announcement.message,
      priority: announcement.priority || "medium",
    });
    setEditingAnnouncement(announcement);
    // Scroll to form
    document
      .querySelector(".broadcast-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingAnnouncement(null);
    setNewAnnouncement({ title: "", message: "", priority: "medium" });
  };

  const handleSaveEditAnnouncement = async (e) => {
    e.preventDefault();

    if (!editingAnnouncement || !editingAnnouncement._id) {
      toast.error("Không tìm thấy thông báo để chỉnh sửa");
      return;
    }

    if (!newAnnouncement.title || !newAnnouncement.message) {
      toast.error("Vui lòng nhập cả tiêu đề và nội dung thông báo.");
      return;
    }

    setIsSending(true);

    try {
      const response = await updateBroadcast(
        editingAnnouncement._id, // The _id from broadcast history is the idempotencyKey
        newAnnouncement.title,
        newAnnouncement.message,
        newAnnouncement.priority
      );

      if (response.success) {
        // Update in local state
        setSentAnnouncements((prev) =>
          prev.map((item) =>
            item._id === editingAnnouncement._id
              ? {
                  ...item,
                  title: newAnnouncement.title,
                  message: newAnnouncement.message,
                  priority: newAnnouncement.priority,
                }
              : item
          )
        );

        toast.success("Thông báo đã được cập nhật!");
        setEditingAnnouncement(null);
        setNewAnnouncement({ title: "", message: "", priority: "medium" });
      } else {
        toast.error(response.message || "Không thể cập nhật thông báo");
      }
    } catch (error) {
      console.error("Failed to update announcement:", error);
      toast.error(
        error.response?.data?.message || "Không thể cập nhật thông báo"
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleViewDetailClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDetailModalOpen(true);
  };

  const filterOptions = [
    { value: "all", label: "Tất cả", icon: <Bell size={16} /> },
    {
      value: "order_placed",
      label: "Đơn đặt",
      icon: <Package size={16} />,
    },
    {
      value: "order_confirmed",
      label: "Xác nhận",
      icon: <CheckCheck size={16} />,
    },
    {
      value: "order_shipped",
      label: "Đang giao",
      icon: <Megaphone size={16} />,
    },
    {
      value: "order_delivered",
      label: "Đã giao",
      icon: <CheckCheck size={16} />,
    },
    {
      value: "order_cancelled",
      label: "Hủy",
      icon: <AlertCircle size={16} />,
    },
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
  const hasUnread = allNotifications.some((n) => !n.isRead);

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
                        key={notif._id}
                        className={`relative group flex items-start gap-4 p-4 rounded-lg border transition-colors duration-200 ${
                          notif.isRead
                            ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                            : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        <div
                          onClick={() => handleNotificationClick(notif._id)}
                          className={`grow flex items-start gap-4 ${
                            !notif.isRead ? "cursor-pointer" : ""
                          }`}
                        >
                          <div className="shrink-0 mt-1">
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="grow">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {notif.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(notif.createdAt), {
                                addSuffix: true,
                                locale: vi,
                              })}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleDeleteSingleNotification(notif._id)
                          }
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
              <div className="broadcast-form bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  {editingAnnouncement
                    ? "Chỉnh sửa thông báo"
                    : "Soạn thông báo mới"}
                </h2>
                <form
                  onSubmit={
                    editingAnnouncement
                      ? handleSaveEditAnnouncement
                      : handleSaveAnnouncement
                  }
                  className="space-y-4"
                >
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
                  <div>
                    <label
                      htmlFor="announcement-priority"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Độ ưu tiên
                    </label>
                    <select
                      id="announcement-priority"
                      name="priority"
                      value={newAnnouncement.priority}
                      onChange={handleAnnouncementChange}
                      className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="low">Thấp</option>
                      <option value="medium">Trung bình</option>
                      <option value="high">Cao</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3">
                    {editingAnnouncement && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isSending}
                        className="px-6 py-2 text-sm font-medium duration-200 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      >
                        Hủy
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSending || isSubmitting}
                      className="flex items-center cursor-pointer gap-2 px-6 py-2 text-sm font-medium duration-200 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : editingAnnouncement ? (
                        <Save size={16} />
                      ) : (
                        <SendHorizonal size={16} />
                      )}
                      {isSending
                        ? "Đang xử lý..."
                        : editingAnnouncement
                        ? "Cập nhật"
                        : "Gửi đi"}
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
                    {sentAnnouncements.length > 0 ? (
                      sentAnnouncements.map((item) => (
                        <motion.div
                          layout
                          key={item._id}
                          initial={{ opacity: 0, y: -20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{
                            opacity: 0,
                            x: 50,
                            transition: { duration: 0.2 },
                          }}
                          className="relative group p-3 border-l-4 border-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-r-md"
                        >
                          <div className="pr-8">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
                              {item.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              Gửi bởi {item.sender_id?.displayName || "Admin"} •{" "}
                              {formatDistanceToNow(new Date(item.createdAt), {
                                addSuffix: true,
                                locale: vi,
                              })}
                            </p>
                          </div>
                          <button
                            onClick={() => handleViewDetailClick(item)}
                            className="absolute top-2 right-[120px] p-1.5 rounded-full cursor-pointer duration-200 text-gray-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 opacity-0 group-hover:opacity-100 transition-all"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditAnnouncementClick(item)}
                            className="absolute top-2 right-[72px] p-1.5 rounded-full cursor-pointer duration-200 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/50 opacity-0 group-hover:opacity-100 transition-all"
                            title="Chỉnh sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncementClick(item)}
                            className="absolute top-2 right-2 p-1.5 rounded-full cursor-pointer duration-200 text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 opacity-0 group-hover:opacity-100 transition-all"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        Chưa có thông báo nào được gửi
                      </p>
                    )}
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

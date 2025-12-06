import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Package,
  Users,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchNotifications, markNotificationAsRead } from "./notificationApi";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import adminAvatar from "../../../assets/images/admin-avatar.jpg";
import ConfirmationModal from "./ConfirmationModal";

// Tạo một đối tượng để ánh xạ từ đường dẫn sang tiêu đề
const routeTitles = {
  "/admin/dashboard": "Bảng điều khiển",
  "/admin/dashboard/products": "Tất cả thực phẩm",
  "/admin/dashboard/products/add": "Thêm thực phẩm",
  "/admin/dashboard/orders": "Đơn hàng",
  "/admin/dashboard/customers": "Khách hàng",
  "/admin/dashboard/inventory": "Kho",
  "/admin/dashboard/coupons": "Phiếu giảm giá",
  "/admin/dashboard/notifications": "Tất cả thông báo",
  "/admin/dashboard/profile": "Hồ sơ của tôi",
  "/admin/dashboard/settings": "Cài đặt",
};

// Custom hook để xử lý click bên ngoài
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

function AdminHeader({ isSidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Bảng điều khiển");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [hasFetchedNotifications, setHasFetchedNotifications] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const notificationRef = useRef(null);
  useClickOutside(notificationRef, () => setNotificationOpen(false));
  const profileRef = useRef(null);
  useClickOutside(profileRef, () => setProfileOpen(false));

  // Sử dụng useEffect để cập nhật tiêu đề mỗi khi đường dẫn thay đổi
  useEffect(() => {
    let currentTitle = "Bảng điều khiển";
    if (location.pathname.startsWith("/admin/dashboard/products/edit/")) {
      currentTitle = "Chỉnh sửa sản phẩm";
    } else if (location.pathname.startsWith("/admin/dashboard/customers/")) {
      currentTitle = "Chi tiết khách hàng";
    } else {
      currentTitle = routeTitles[location.pathname] || "Bảng điều khiển";
    }
    setTitle(currentTitle);
  }, [location.pathname]);

  // Lấy thông báo khi mở dropdown
  useEffect(() => {
    if (isNotificationOpen && !hasFetchedNotifications) {
      setLoadingNotifications(true);
      fetchNotifications()
        .then((data) => {
          setNotifications(data);
          setHasFetchedNotifications(true);
        })
        .catch((err) => console.error("Failed to fetch notifications:", err))
        .finally(() => {
          setLoadingNotifications(false);
        });
    }
  }, [isNotificationOpen, hasFetchedNotifications]);

  const handleNotificationClick = (notificationId) => {
    // Tìm thông báo trong state hiện tại
    const notification = notifications.find((n) => n.id === notificationId);

    // Nếu thông báo tồn tại và chưa được đọc
    if (notification && !notification.read) {
      // Cập nhật giao diện ngay lập tức để có trải nghiệm người dùng tốt hơn
      const updatedNotifications = notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifications);

      // Gọi API giả để cập nhật trạng thái ở "backend"
      markNotificationAsRead(notificationId).catch((err) => {
        console.error("Failed to mark notification as read:", err);
        // Có thể khôi phục lại trạng thái cũ nếu API thất bại
        setNotifications(notifications);
      });
    }
    // Bạn có thể thêm logic điều hướng ở đây nếu cần
    // navigate(`/admin/dashboard/orders/${notification.orderId}`);
  };

  const getNotificationIcon = (type) => {
    const iconProps = { className: "w-5 h-5" };
    switch (type) {
      case "order":
        return <Package {...iconProps} />;
      case "customer":
        return <Users {...iconProps} />;
      case "report":
        return <BarChart3 {...iconProps} />;
      case "inventory":
        return <AlertCircle {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const handleLogout = () => {
    setProfileOpen(false);
    setLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    // Đóng modal
    setLogoutModalOpen(false);
    // Thực hiện đăng xuất
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    // Lưu thông báo vào sessionStorage để hiển thị sau khi navigate
    sessionStorage.setItem("logoutSuccessMessage", "Đăng xuất thành công!");
    // Chuyển hướng về trang chủ sau khi đăng xuất
    navigate("/", { replace: true });
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      e.preventDefault();
      navigate(
        `/admin/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn kết thúc phiên làm việc này không?"
        confirmText="Đăng xuất"
      />
      <header className="bg-white shadow-sm p-4 z-10">
        <div className="flex justify-between items-center w-full">
          {/* Left Side */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Hamburger Menu */}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="text-gray-600 cursor-pointer hover:text-amber-600 transition-colors duration-300 focus:outline-none relative w-6 h-6"
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={isSidebarOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  {isSidebarOpen ? (
                    <PanelLeftClose size={26} />
                  ) : (
                    <PanelLeftOpen size={26} />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
            {/* Page Title */}
            <h2 className="hidden md:block text-xl font-semibold text-gray-800">
              {title}
            </h2>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search Bar */}
            <div className="relative hidden sm:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="text-gray-400" size={20} />
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full max-w-xs py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            {/* Notification Menu */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!isNotificationOpen)}
                className="relative p-2 cursor-pointer rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-300"
              >
                <Bell size={20} />
                {/* Số lượng thông báo chưa đọc */}
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col"
                  >
                    <div className="p-3 font-semibold text-gray-800 border-b border-gray-200">
                      Thông báo ({notifications.filter((n) => !n.read).length})
                    </div>
                    <div className="flex-1 max-h-80 overflow-y-auto custom-scrollbar">
                      {loadingNotifications ? (
                        <div className="flex justify-center items-center h-24">
                          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <a
                            onClick={(e) => {
                              e.preventDefault();
                              handleNotificationClick(notif.id);
                            }}
                            key={notif.id}
                            href="#"
                            className="flex items-center gap-4 px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                          >
                            <div className="relative shrink-0">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                                  !notif.read ? "bg-amber-500" : "bg-gray-300"
                                }`}
                              >
                                <div
                                  className={
                                    !notif.read ? "text-white" : "text-gray-600"
                                  }
                                >
                                  {getNotificationIcon(notif.type)}
                                </div>
                              </div>
                              {!notif.read && (
                                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-white"></span>
                              )}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`text-gray-800 ${
                                  !notif.read ? "font-semibold" : "font-normal"
                                }`}
                              >
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDistanceToNow(
                                  new Date(notif.timestamp),
                                  {
                                    addSuffix: true,
                                    locale: vi, // Thêm locale tiếng Việt
                                  }
                                )}
                              </p>
                            </div>
                          </a>
                        ))
                      ) : (
                        <p className="text-center text-sm text-gray-500 py-4">
                          Không có thông báo mới.
                        </p>
                      )}
                    </div>
                    <div className="border-t border-gray-200">
                      <button
                        onClick={() =>
                          navigate("/admin/dashboard/notifications")
                        }
                        className="w-full text-center py-2.5 text-sm cursor-pointer rounded-b-lg font-medium text-amber-600 hover:bg-gray-100 transition-colors duration-200"
                      >
                        Xem tất cả thông báo
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!isProfileOpen)}
                className="flex items-center cursor-pointer focus:ring-1 focus:ring-gray-500 rounded-lg gap-2 focus:outline-none"
              >
                <img
                  src={adminAvatar}
                  alt="Admin Avatar"
                  className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="hidden lg:flex items-center text-sm font-medium text-gray-600 transition-colors duration-300">
                  <span>Admin</span>
                  <ChevronDown
                    size={16}
                    className={`ml-1 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200"
                  >
                    <NavLink
                      to="/admin/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                    >
                      <User size={16} /> Hồ sơ
                    </NavLink>
                    <NavLink
                      to="/admin/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                    >
                      <Settings size={16} /> Cài đặt
                    </NavLink>
                    <button // Thêm border-t để phân tách
                      onClick={handleLogout}
                      className="w-full flex items-center cursor-pointer gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors duration-300"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default AdminHeader;

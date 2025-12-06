"use client";

import { NavLink, useNavigate } from "react-router-dom";
import {
  Store,
  ShoppingCart,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { fetchUserNotifications } from "../services/notificationService"; // Giả sử service này tồn tại
import userAvatar from "../assets/images/userAvatar.png"; // 1. Import ảnh avatar

function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [user, setUser] = useState(null);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setLoadingNotifications(true);
    try {
      // Lấy 5 thông báo mới nhất
      const response = await fetchUserNotifications("all", 1, 5);
      if (response && Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        // Giả lập dữ liệu nếu API không trả về đúng định dạng
        console.warn(
          "No notifications returned or in wrong format, using mock data."
        );
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]); // Xóa thông báo cũ nếu có lỗi
    } finally {
      setLoadingNotifications(false);
    }
  }, [user]);

  // Auto-refresh notifications every 30 seconds when user is logged in
  useEffect(() => {
    // Khóa cuộn trang khi menu mobile mở
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    if (user) {
      // Load immediately on login
      loadNotifications();
      // Poll every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isMobileMenuOpen]);

  // Load user info from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user"); // Xóa dữ liệu lỗi
      }
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    setShowUserMenu(false);
    // Xóa thông tin user trong state & localStorage
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    // Lưu thông báo vào sessionStorage để hiển thị sau khi navigate
    sessionStorage.setItem("logoutSuccessMessage", "Đăng xuất thành công!");
    setMobileMenuOpen(false); // Đóng menu mobile sau khi logout
    // Điều hướng về trang chủ sau khi đăng xuất
    navigate("/", { replace: true });
  };

  const handleLoginClick = () => {
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.search.value;
    setMobileMenuOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/about", label: "Giới thiệu" },
    { to: "/contact", label: "Liên hệ" },
    { to: "/shop", label: "Cửa hàng" },
    { to: "/checkout", label: "Thanh toán" },
  ];

  return (
    <header className="fixed z-50 left-0 right-0 font-semibold text-white bg-[#051922] shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center px-4 sm:px-10 py-4">
        <NavLink
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex gap-x-0.5 items-center text-amber-600 group cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          <div className="transition-transform duration-300 group-hover:rotate-12">
            <Store size={37} />
          </div>
          <div className="-mt-0.5">
            <h2 className="text-lg font-bold">Market4P</h2>
            <h3 className="text-[0.7rem] -mt-1.5">Fresh Foods Online</h3>
          </div>
        </NavLink>

        <nav className="hidden lg:flex gap-x-4 items-center justify-around">
          {navLinks.map((item) => (
            <div key={item.to} className="relative group">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `transition-colors block px-4 py-3  duration-300 ${
                    isActive ? "text-amber-600" : "hover:text-amber-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex gap-x-4 items-center">
          {/* Search */}
          <NavLink
            to="/search"
            className="p-2 hover:text-amber-600 hover:cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-12"
          >
            <Search size={22} />
          </NavLink>

          {/* Cart */}
          <NavLink
            to="/cart"
            className="p-2 hover:text-amber-600 hover:cursor-pointer transition-all duration-300 hover:scale-110 relative group"
          >
            <ShoppingCart size={22} />
          </NavLink>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="p-2 hover:text-amber-600 hover:cursor-pointer transition-all duration-300 hover:scale-110 relative"
            >
              <Bell
                size={22}
                className={showNotifications ? "text-amber-600" : ""}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 border border-gray-100">
                <div className="bg-linear-to-r from-amber-500 to-amber-600 px-4 py-3">
                  <h3 className="text-white font-bold">Thông báo</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {loadingNotifications ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <div className="inline-block animate-spin">
                        <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                      </div>
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className={`px-4 py-3 border-b border-gray-100 hover:bg-amber-50 transition-colors duration-200 cursor-pointer ${
                          !notif.isRead ? "bg-amber-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {!notif.isRead && (
                            <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></span>
                          )}
                          <div className={!notif.isRead ? "" : "ml-5"}>
                            <p className="text-gray-800 text-sm font-medium">
                              {notif.title}
                            </p>
                            <p className="text-gray-600 text-xs mt-1">
                              {notif.message}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              {new Date(notif.createdAt).toLocaleString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500">
                      Không có thông báo nào
                    </div>
                  )}
                </div>
                <div className="p-3 text-center border-t border-gray-100">
                  <NavLink
                    to="/notifications"
                    className="text-amber-600 text-sm font-medium hover:underline"
                  >
                    Xem tất cả thông báo
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar & Name */}
          <div className="relative">
            {user ? (
              // Đã đăng nhập - hiển thị avatar, tên, và dropdown menu
              <>
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center cursor-pointer gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={userAvatar} // 2. Sử dụng ảnh đã import
                    alt={user.displayName || "Avatar"}
                    className="w-8 h-8 rounded-full object-cover border-2 border-amber-500"
                  />
                  <span className="text-sm max-w-24 truncate">
                    {user.displayName || user.name || "User"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 border border-gray-100 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-linear-to-r from-amber-500 to-amber-600">
                      <div className="text-white font-bold truncate">
                        {user.displayName || user.name || "User"}
                      </div>
                      <p className="text-amber-100 text-xs">Người dùng</p>
                    </div>
                    <div className="py-2">
                      {[
                        { label: "Tài khoản của tôi", to: "/account" },
                        { label: "Đơn hàng", to: "/orders" },
                        { label: "Địa chỉ giao hàng", to: "/addresses" },
                        { label: "Thông báo", to: "/notifications" },
                      ].map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200 text-sm"
                          onClick={() => setShowUserMenu(false)}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex cursor-pointer items-center gap-2 text-left px-4 py-2 text-red-500 hover:bg-red-50 transition-colors duration-200 text-sm font-medium"
                      >
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Chưa đăng nhập - hiển thị nút Đăng nhập
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 rounded-lg cursor-pointer bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all duration-300 hover:scale-105"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <div className="lg:hidden flex items-center gap-1 sm:gap-3">
          <NavLink
            to="/cart"
            className="p-2 hover:text-amber-600 hover:cursor-pointer transition-all duration-300 hover:scale-110 relative group"
          >
            <ShoppingCart size={22} />
          </NavLink>

          {/* Notification Bell for Mobile (only when logged in) */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="p-2 hover:text-amber-600 hover:cursor-pointer transition-all duration-300 hover:scale-110 relative"
              >
                <Bell
                  size={22}
                  className={showNotifications ? "text-amber-600" : ""}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>
              {/* Notification Dropdown (re-used from desktop) */}
              {showNotifications && (
                <div className="absolute -right-10 mt-2 w-72 max-w-[90vw] bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 border border-gray-100 z-50">
                  <div className="bg-linear-to-r from-amber-500 to-amber-600 px-4 py-3">
                    <h3 className="text-white font-bold">Thông báo</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <div className="inline-block animate-spin">
                          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                        </div>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-amber-50 transition-colors duration-200 cursor-pointer ${
                            !notif.isRead ? "bg-amber-50/50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {!notif.isRead && (
                              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></span>
                            )}
                            <div className={!notif.isRead ? "" : "ml-5"}>
                              <p className="text-gray-800 text-sm font-medium">
                                {notif.title}
                              </p>
                              <p className="text-gray-600 text-xs mt-1">
                                {notif.message}
                              </p>
                              <p className="text-gray-400 text-xs mt-1">
                                {new Date(notif.createdAt).toLocaleString(
                                  "vi-VN"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        Không có thông báo nào
                      </div>
                    )}
                  </div>
                  <div className="p-3 text-center border-t border-gray-100">
                    <NavLink
                      to="/notifications"
                      className="text-amber-600 text-sm font-medium hover:underline"
                    >
                      Xem tất cả thông báo
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Avatar/Login for Mobile */}
          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center cursor-pointer"
                >
                  <img
                    src={user.avatar || userAvatar}
                    alt={user.displayName || "Avatar"}
                    className="w-8 h-8 rounded-full object-cover border-2 border-amber-500"
                  />
                </button>
                {/* User Dropdown Menu (re-used from desktop) */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 border border-gray-100 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-linear-to-r from-amber-500 to-amber-600">
                      <div className="text-white font-bold truncate">
                        {user.displayName || user.name || "User"}
                      </div>
                      <p className="text-amber-100 text-xs">Người dùng</p>
                    </div>
                    <div className="py-2">
                      {[
                        { label: "Tài khoản của tôi", to: "/account" },
                        { label: "Đơn hàng", to: "/orders" },
                        { label: "Địa chỉ giao hàng", to: "/addresses" },
                        { label: "Thông báo", to: "/notifications" },
                      ].map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200 text-sm"
                          onClick={() => setShowUserMenu(false)}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex cursor-pointer items-center gap-2 text-left px-4 py-2 text-red-500 hover:bg-red-50 transition-colors duration-200 text-sm font-medium"
                      >
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="relative h-6 w-6 p-2 text-white transition-colors hover:text-amber-600"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={isMobileMenuOpen ? "x" : "menu"}
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 top-[77px] bg-[#051922]/80 backdrop-blur-sm p-6 flex flex-col z-40"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="bg-[#051922] rounded-2xl p-6 flex flex-col h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Search */}
              <form onSubmit={handleMobileSearch} className="relative mb-6">
                <input
                  type="search"
                  name="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full bg-white/10 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </form>

              <nav className="flex flex-col gap-y-2 mb-8">
                {navLinks.map((item, index) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-lg py-3 px-4 rounded-lg transition-colors duration-300 ${
                        isActive
                          ? "text-amber-500 bg-white/10 font-bold"
                          : "hover:bg-white/10"
                      }`
                    }
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {/* Nút đăng nhập ở cuối menu mobile nếu chưa đăng nhập */}
              {!user && (
                <div className="mt-auto border-t border-white/20 pt-6">
                  <button
                    onClick={handleLoginClick}
                    className="w-full py-3 rounded-lg cursor-pointer bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Đăng nhập
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(showNotifications || showUserMenu) && (
        <div
          // Tăng z-index để lớp phủ này nằm trên menu mobile
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
}

export default Navbar;

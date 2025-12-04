"use client";

import { NavLink, useNavigate } from "react-router-dom";
import {
  Store,
  ShoppingCart,
  Search,
  Bell,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import UserInfor from "../components/common/UserInfor";
import { fetchUserNotifications } from "../services/notificationService";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [user, setUser] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  // Auto-refresh notifications every 30 seconds when user is logged in
  useEffect(() => {
    if (!user) return;

    // Load immediately on login
    loadNotifications();

    // Poll every 30 seconds
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  // Load user info from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Nếu có avatarUrl, sử dụng; nếu không dùng placeholder
        setUserAvatar(parsedUser.avatarUrl || "/placeholder.svg");
        // Auto load notifications khi user login
        loadNotifications();
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const loadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      // Lấy tất cả notifications (filterType = "all")
      const response = await fetchUserNotifications("all", 1, 5);
      if (response.success) {
        console.log("Notifications loaded:", response.data);
        setNotifications(response.data);
      } else {
        console.warn("No notifications returned");
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    setShowUserMenu(false);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <main className="fixed z-50 left-0 right-0 flex justify-between items-center px-10 py-4 font-semibold text-white bg-[#051922] shadow-lg transition-all duration-300">
      <div className="flex gap-x-0.5 items-center text-amber-600 group cursor-pointer transition-transform duration-300 hover:scale-105">
        <div className="transition-transform duration-300 group-hover:rotate-12">
          <Store size={37} />
        </div>
        <div className="-mt-0.5">
          <h2 className="text-lg font-bold">Market4P</h2>
          <h3 className="text-[0.7rem] -mt-1.5">Fresh Foods Online</h3>
        </div>
      </div>

      <nav className="flex gap-x-4 items-center justify-around">
        {[
          { to: "/", label: "Trang chủ" },
          { to: "/about", label: "Giới thiệu" },
          { to: "/contact", label: "Liên hệ" },
          { to: "/checkout", label: "Thanh toán" },
          { to: "/shop", label: "Cửa hàng" },
        ].map((item) => (
          <div key={item.to} className="px-4 py-3 relative group">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `transition-colors duration-300 ${
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

      <div className="flex gap-x-4 items-center">
        {/* Search */}
        <div className="p-2 hover:text-amber-600 hover:cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-12">
          <Search size={22} />
        </div>

        {/* Cart */}
        <NavLink
          to="/cart"
          className="p-2 hover:text-amber-600 hover:cursor-pointer transition-all duration-300 hover:scale-110 relative group"
        >
          <ShoppingCart size={22} />
          <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
            3
          </span>
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
                            {new Date(notif.createdAt).toLocaleString("vi-VN")}
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <img
                  src={userAvatar}
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
                      className="w-full flex items-center gap-2 text-left px-4 py-2 text-red-500 hover:bg-red-50 transition-colors duration-200 text-sm font-medium"
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
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all duration-300 hover:scale-105"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </main>
  );
}

export default Navbar;

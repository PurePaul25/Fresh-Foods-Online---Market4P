"use client";

import { NavLink } from "react-router-dom";
import { Store, ShoppingCart, Search, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import UserInfor from "../components/common/UserInfor"

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      text: "Don hang #1234 da duoc giao thanh cong",
      time: "5 phút trước",
      unread: true,
    },
    {
      id: 2,
      text: "Giam gia 20% cho tat ca rau cu hom nay!",
      time: "1 giờ trước",
      unread: true,
    },
    {
      id: 3,
      text: "Don hang #1230 dang tren duong giao",
      time: "2 giờ trước",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

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
                `transition-colors duration-300 ${isActive ? "text-amber-600" : "hover:text-amber-600"
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
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-gray-100 hover:bg-amber-50 transition-colors duration-200 cursor-pointer ${notif.unread ? "bg-amber-50/50" : ""
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      {notif.unread && (
                        <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></span>
                      )}
                      <div className={notif.unread ? "" : "ml-5"}>
                        <p className="text-gray-800 text-sm">{notif.text}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-gray-100">
                <button className="text-amber-600 text-sm font-medium hover:underline">
                  Xem tất cả thông báo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Name */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <img
              src={"/placeholder.svg"}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border-2 border-amber-500"
            />
            <span className="text-sm max-w-24 truncate">
              <UserInfor></UserInfor>
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 border border-gray-100">
              <div className="px-4 py-3 border-b border-gray-100 bg-linear-to-r from-amber-500 to-amber-600">
                <div className="text-white font-bold truncate"><UserInfor></UserInfor></div>
                <p className="text-amber-100 text-xs">Người dùng</p>
              </div>
              <div className="py-2">
                {[
                  { label: "Tài khoản của tôi", to: "/account" },
                  { label: "Đơn hàng", to: "/orders" },
                  { label: "Địa chỉ giao hàng", to: "/addresses" },
                ].map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200 text-sm"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <div className="border-t border-gray-100 py-2">
                <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 transition-colors duration-200 text-sm font-medium">
                  Đăng xuất
                </button>
              </div>
            </div>
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

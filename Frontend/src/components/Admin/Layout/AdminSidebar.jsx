import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../Login/Logo";
import {
  LayoutDashboard,
  Apple,
  PlusCircle,
  Tags,
  Package,
  Users,
  ClipboardList,
  Ticket,
  Bell,
  Store,
  User,
  Settings,
} from "lucide-react";

const NavItem = ({ to, icon, children, end = false, isSidebarOpen }) => {
  const baseClasses =
    "flex items-center py-2.5 px-4 text-sm font-medium rounded-lg transition-colors duration-200";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";
  const activeClasses = "bg-amber-500 text-white shadow-md";

  return (
    <div className="relative group">
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) => `
          ${baseClasses} 
          ${isActive ? activeClasses : inactiveClasses}
          ${!isSidebarOpen && "justify-center"}
        `}
      >
        {icon}
        <span
          className={`
            overflow-hidden whitespace-nowrap transition-all duration-200
            ${isSidebarOpen ? "ml-3 max-w-xs" : "max-w-0"}
          `}
        >
          {children}
        </span>
      </NavLink>
      {/* Tooltip */}
      {!isSidebarOpen && (
        <div
          className="absolute left-full ml-4 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md shadow-lg 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                     pointer-events-none whitespace-nowrap z-50"
        >
          {children}
        </div>
      )}
    </div>
  );
};

function AdminSidebar({ isSidebarOpen }) {
  const sidebarClasses = `
    bg-gray-900 text-white flex flex-col shrink-0 transition-all duration-300 ease-in-out 
    ${isSidebarOpen ? "w-64" : "w-0 lg:w-20"}
    fixed lg:relative h-full z-30
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="flex flex-col h-full overflow-x-hidden">
        <div
          className={`
            flex flex-col items-center justify-center border-b border-gray-700 transition-all duration-300 shrink-0
            ${isSidebarOpen ? "p-5" : "py-5 px-2"}
          `}
        >
          {isSidebarOpen ? (
            <Logo />
          ) : (
            <div className="text-amber-600">
              <Store size={36} strokeWidth={2} />
            </div>
          )}
          <p
            className={`
              text-sm text-gray-400 mt-2 whitespace-nowrap transition-opacity duration-200
              ${isSidebarOpen ? "opacity-100" : "opacity-0 h-0"}
            `}
          >
            Bảng quản trị
          </p>
        </div>
        {/* Vùng chứa có thể cuộn cho các mục menu */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <nav
            className={`
              pt-2 pb-4 transition-all duration-300
              ${isSidebarOpen ? "px-4" : "px-2"}
            `}
          >
            <div className="space-y-1">
              <NavItem
                to="/admin/dashboard"
                icon={<LayoutDashboard size={18} />}
                end
                isSidebarOpen={isSidebarOpen}
              >
                Bảng điều khiển
              </NavItem>
            </div>

            <div className="mt-4">
              <h3
                className={`
                  relative px-4 pb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase h-5 flex items-center
                  ${!isSidebarOpen ? "justify-center" : "justify-start"}
                `}
              >
                <span
                  className={`transition-opacity duration-200 whitespace-nowrap ${
                    isSidebarOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Quản lý
                </span>
                <span
                  className={`absolute left-1/2 -translate-x-1/2 transition-opacity duration-200 ${
                    !isSidebarOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  •••
                </span>
              </h3>
            </div>

            <div className="space-y-1">
              <NavItem
                to="/admin/dashboard/products"
                icon={<Apple size={18} />}
                end
                isSidebarOpen={isSidebarOpen}
              >
                Tất cả trái cây
              </NavItem>
              <NavItem
                to="/admin/dashboard/products/add"
                icon={<PlusCircle size={18} />}
                isSidebarOpen={isSidebarOpen}
              >
                Thêm trái cây
              </NavItem>
              <NavItem
                to="/admin/dashboard/orders"
                icon={<Package size={18} />}
                isSidebarOpen={isSidebarOpen}
              >
                Đơn hàng
              </NavItem>
              <NavItem
                to="/admin/dashboard/customers"
                icon={<Users size={18} />}
                isSidebarOpen={isSidebarOpen}
              >
                Khách hàng
              </NavItem>
              <NavItem
                to="/admin/dashboard/inventory"
                icon={<ClipboardList size={18} />}
                isSidebarOpen={isSidebarOpen}
              >
                Kho
              </NavItem>
              <NavItem
                to="/admin/dashboard/coupons"
                icon={<Ticket size={18} />}
                isSidebarOpen={isSidebarOpen}
              >
                Phiếu giảm giá
              </NavItem>
            </div>

            <div className="mt-4">
              <h3
                className={`
                  relative px-4 pb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase h-5 flex items-center
                  ${!isSidebarOpen ? "justify-center" : "justify-start"}
                `}
              >
                <span
                  className={`transition-opacity duration-200 whitespace-nowrap ${
                    isSidebarOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Cá nhân
                </span>
                <span
                  className={`absolute left-1/2 -translate-x-1/2 transition-opacity duration-200 ${
                    !isSidebarOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  •••
                </span>
              </h3>
            </div>

            <div className="space-y-1">
              <NavItem
                to="/admin/dashboard/notifications"
                icon={<Bell size={18} />}
                isSidebarOpen={isSidebarOpen}
              >
                Thông báo
              </NavItem>
              <NavItem
                to="/admin/dashboard/profile"
                icon={<User size={18} />}
                isSidebarOpen={isSidebarOpen}
              >
                Hồ sơ
              </NavItem>
              <NavItem
                to="/admin/dashboard/settings"
                icon={<Settings size={18} />}
                isSidebarOpen={isSidebarOpen}
              >
                Cài đặt
              </NavItem>
            </div>
          </nav>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;

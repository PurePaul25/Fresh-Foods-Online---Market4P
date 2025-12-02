import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Admin/Layout/AdminSidebar";
import Header from "../../components/Admin/Layout/AdminHeader";
import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CustomToaster from "../../components/Toaster";

const IDLE_TIMEOUT = 15 * 60 * 1000; // 30 phút
function Dashboard() {
  // Đọc trạng thái từ localStorage, mặc định là true nếu không có
  const [isSidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const navigate = useNavigate();

  // Lưu trạng thái vào localStorage mỗi khi nó thay đổi
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  // Hiển thị thông báo đăng nhập thành công từ sessionStorage (admin)
  useEffect(() => {
    const message = sessionStorage.getItem("loginSuccessMessage");
    if (message) {
      toast.success(message, { duration: 4000 });
      sessionStorage.removeItem("loginSuccessMessage");
    }
  }, []);

  // Logic xử lý hết hạn phiên làm việc
  useEffect(() => {
    let lastActivity = Date.now();

    const handleLogout = () => {
      // Xóa thông tin đăng nhập
      localStorage.removeItem("user");
      toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!");
      navigate("/login", { replace: true });
    };

    const resetTimer = () => {
      lastActivity = Date.now();
    };

    const checkIdleTime = () => {
      if (Date.now() - lastActivity > IDLE_TIMEOUT) {
        handleLogout();
      }
    };

    const activityEvents = ["mousemove", "keydown", "click", "scroll"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    const intervalId = setInterval(checkIdleTime, 60000); // Kiểm tra mỗi phút

    return () => {
      clearInterval(intervalId);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [navigate]);

  return (
    <>
      <CustomToaster />
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>

        {/* Overlay for mobile */}
        {!isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          ></div>
        )}
      </div>
      </div>
    </>
  );
}

export default Dashboard;

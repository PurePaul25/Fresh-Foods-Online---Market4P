import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import Toaster from "./components/Toaster"; // Sử dụng Toaster tùy chỉnh

function App() {
  // Effect để kiểm tra và hiển thị thông báo đăng nhập thành công
  useEffect(() => {
    const message = sessionStorage.getItem("loginSuccessMessage");
    if (message) {
      toast.success(message);
      // Xóa thông báo sau khi đã hiển thị để không hiện lại khi tải lại trang
      sessionStorage.removeItem("loginSuccessMessage");
    }
  }, []); // Mảng rỗng `[]` đảm bảo effect này chỉ chạy một lần khi component được mount

  return (
    <div>
      {/* Sử dụng component Toaster đã được style tùy chỉnh */}
      <Toaster />
      <Outlet />
    </div>
  );
}

export default App;

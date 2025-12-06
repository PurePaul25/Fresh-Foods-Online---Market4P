import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CustomToaster from "./Toaster";

const RootLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hiển thị toast nếu có thông điệp được gửi qua state từ trang đăng nhập
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message, {
        duration: 4000,
      });
      // Xóa state để không hiển thị lại khi refresh hoặc điều hướng
      // bằng cách thay thế state hiện tại bằng một object rỗng.
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Hiển thị toast đăng xuất thành công từ sessionStorage
  useEffect(() => {
    const logoutMessage = sessionStorage.getItem("logoutSuccessMessage");
    if (logoutMessage) {
      toast.success(logoutMessage, { duration: 4000 });
      sessionStorage.removeItem("logoutSuccessMessage");
    }
  }, [location.pathname]);

  return (
    <>
      {/* Sử dụng CustomToaster để có style nhất quán trên toàn ứng dụng */}
      <CustomToaster />
      {/* Outlet sẽ render các component con tương ứng với route */}
      <Outlet />
    </>
  );
};

export default RootLayout;

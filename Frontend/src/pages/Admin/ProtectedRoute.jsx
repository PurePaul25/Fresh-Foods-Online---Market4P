import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Component này kiểm tra xem admin đã đăng nhập hay chưa.
 * - Nếu đã đăng nhập, nó sẽ render component con (children).
 * - Nếu chưa, nó sẽ chuyển hướng về trang đăng nhập.
 */
const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  // Lấy thông tin người dùng từ localStorage
  const userData = localStorage.getItem("user");
  let user = null;
  try {
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Lỗi khi đọc thông tin người dùng từ localStorage:", error);
  }

  // Kiểm tra xem người dùng có tồn tại và có vai trò là 'admin' hay không
  const isAdmin = user && user.role === "admin";

  // Nếu là admin, cho phép truy cập. Nếu không, chuyển hướng về trang đăng nhập.
  return isAdmin ? children : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;

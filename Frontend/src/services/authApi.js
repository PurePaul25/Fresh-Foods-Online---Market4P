// API service để kết nối với backend MongoDB
const API_BASE_URL = "http://localhost:5001/api/auth";

/**
 * Đăng nhập user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{accessToken, role, name}>}
 */
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // gửi cookie
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Đăng nhập thất bại");
  }

  const data = await response.json();
  return {
    accessToken: data.accessToken,
    role: data.role,
    displayName: data.displayName,
  };
};

/**
 * Đăng ký user mới
 * @param {string} username
 * @param {string} email
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {Promise<{message}>}
 */
export const registerUser = async (
  username,
  email,
  firstName,
  lastName,
  password,
  confirmPassword
) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Đăng ký thất bại");
  }

  return { success: true, message: "Đăng ký thành công" };
};

/**
 * Đăng xuất user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await fetch(`${API_BASE_URL}/signout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
  }
};

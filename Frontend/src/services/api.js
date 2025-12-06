// src/services/api.js
const VITE_API_URL_ENV = import.meta.env.VITE_API_URL;
const API_BASE_URL = VITE_API_URL_ENV
  ? `${VITE_API_URL_ENV}`
  : "http://localhost:5001";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.refreshing = false;
    this.refreshSubscribers = [];
  }

  // ==================== HELPER METHODS ====================

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Gửi cookie (refreshToken)
    };

    // Thêm access token nếu có
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(url, config);

      // Xử lý 401 - Token hết hạn
      if (response.status === 401 && !endpoint.includes("/auth/")) {
        const refreshed = await this.handleTokenRefresh();
        if (refreshed) {
          // Retry request với token mới
          config.headers.Authorization = `Bearer ${localStorage.getItem(
            "accessToken"
          )}`;
          return fetch(url, config).then((res) => res.json());
        } else {
          this.logout();
          window.location.href = "/login";
          throw new Error("Session expired");
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async handleTokenRefresh() {
    if (this.refreshing) {
      // Nếu đang refresh, đợi kết quả
      return new Promise((resolve) => {
        this.refreshSubscribers.push((token) => {
          resolve(!!token);
        });
      });
    }

    this.refreshing = true;

    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);

        // Notify subscribers
        this.refreshSubscribers.forEach((callback) =>
          callback(data.accessToken)
        );
        this.refreshSubscribers = [];

        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    } finally {
      this.refreshing = false;
    }
  }

  // ==================== AUTH ====================

  async signup(userData) {
    return this.request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async signin(email, password) {
    const data = await this.request("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Lưu token và thông tin user
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: data.userId,
          displayName: data.displayName,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
        })
      );
    }

    return data;
  }

  async signout() {
    try {
      await this.request("/api/auth/signout", { method: "POST" });
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  }

  async getCurrentUser() {
    return this.request("/api/users/me");
  }

  // ==================== PRODUCTS ====================

  async getProducts(params = {}) {
    // Mặc định yêu cầu nhiều sản phẩm hơn để hiển thị phân trang đầy đủ
    const defaultParams = {
      limit: 50, // Yêu cầu tối đa 50 sản phẩm
      ...params,
    };
    const queryString = new URLSearchParams(defaultParams).toString();
    return this.request(`/api/products?${queryString}`);
  }

  async getProductById(id) {
    return this.request(`/api/products/${id}`);
  }

  async createProduct(formData) {
    // FormData để upload ảnh
    const url = `${this.baseURL}/api/products`;

    const doRequest = async () => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
        body: formData, // Không set Content-Type, browser tự set
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create product");
      }
      return data;
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      credentials: "include",
      body: formData,
    });

    if (res.status === 401) {
      const refreshed = await this.handleTokenRefresh();
      if (refreshed) {
        return doRequest();
      }
      this.logout();
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create product");
    }
    return data;
  }

  async updateProduct(id, formData) {
    const url = `${this.baseURL}/api/products/${id}`;

    const doRequest = async () => {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update product");
      }
      return data;
    };

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      credentials: "include",
      body: formData,
    });

    if (res.status === 401) {
      const refreshed = await this.handleTokenRefresh();
      if (refreshed) {
        return doRequest();
      }
      this.logout();
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update product");
    }
    return data;
  }

  async deleteProduct(id) {
    return this.request(`/api/products/${id}`, {
      method: "DELETE",
    });
  }

  // ==================== CART ====================

  async getCart() {
    return this.request("/api/cart");
  }

  async addToCart(productId, quantity = 1) {
    return this.request("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async updateCartItem(productId, quantity) {
    return this.request("/api/cart/update", {
      method: "PUT",
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async removeFromCart(productId) {
    return this.request("/api/cart/remove", {
      method: "DELETE",
      body: JSON.stringify({ product_id: productId }),
    });
  }

  async clearCart() {
    return this.request("/api/cart/clear", {
      method: "DELETE",
    });
  }

  // ==================== ORDERS ====================

  async createOrder(orderData) {
    return this.request("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async getUserOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/orders?${queryString}`);
  }

  async getAllOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/orders/admin/all?${queryString}`);
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/api/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // ==================== REVIEWS ====================

  async getProductReviews(productId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/products/${productId}/reviews?${queryString}`);
  }

  async createReview(productId, reviewData) {
    return this.request(`/api/products/${productId}/reviews`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  }

  // ==================== ADMIN ====================

  async getDashboardStats() {
    return this.request("/api/admin/stats");
  }

  async getRevenueAnalytics(period = "month") {
    return this.request(`/api/admin/revenue?period=${period}`);
  }

  // Get all customers with order details
  async getCustomers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/customers?${queryString}`);
  }

  // Ban a customer
  async banCustomer(userId, reason) {
    return this.request(`/api/admin/users/${userId}/ban`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });
  }

  // Unban a customer
  async unbanCustomer(userId) {
    return this.request(`/api/admin/users/${userId}/unban`, {
      method: "PATCH",
    });
  }

  // Delete a customer
  async deleteCustomer(userId) {
    return this.request(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });
  }

  // ==================== UTILS ====================

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }

  getStoredUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  }

  isAdmin() {
    const user = this.getStoredUser();
    return user?.role === "admin";
  }
}

export default new ApiService();

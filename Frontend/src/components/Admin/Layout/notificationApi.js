// Dữ liệu giả lập cho thông báo
let mockNotifications = [
  {
    id: 1,
    message: "Đơn hàng mới #12345 vừa được đặt.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 phút trước
    read: false,
    type: "order",
  },
  {
    id: 2,
    message: 'Sản phẩm "Táo Envy" sắp hết hàng.',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 giờ trước
    read: false,
    type: "inventory",
  },
  {
    id: 3,
    message: "Khách hàng mới 'An Nguyễn' vừa đăng ký.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 giờ trước
    read: true,
    type: "customer",
  },
  {
    id: 4,
    message: "Báo cáo doanh thu tháng 5 đã được tạo.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 ngày trước
    read: true,
    type: "report",
  },
  {
    id: 5,
    message: "Đơn hàng #12344 đã được giao thành công.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 ngày trước
    read: true,
    type: "order",
  },
  {
    id: 6,
    message: "Khách hàng 'Trần Văn Bình' đã cập nhật thông tin.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 ngày trước
    read: true,
    type: "customer",
  },
  {
    id: 7,
    message: 'Sản phẩm "Nho Xanh không hạt Mỹ" chỉ còn 20kg.',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 ngày trước
    read: false,
    type: "inventory",
  },
  {
    id: 8,
    message: "Đơn hàng mới #12346 từ 'Lê Thị Hoa'.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 ngày trước
    read: true,
    type: "order",
  },
  {
    id: 9,
    message: "Báo cáo tồn kho tuần đã được cập nhật.",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 ngày trước
    read: true,
    type: "report",
  },
  {
    id: 10,
    message: "Khách hàng mới 'Phạm Thị Mai' vừa đăng ký.",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 tuần trước
    read: true,
    type: "customer",
  },
  {
    id: 11,
    message: 'Sản phẩm "Dâu tây Đà Lạt" đã hết hàng.',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 ngày trước
    read: true,
    type: "inventory",
  },
  {
    id: 12,
    message: "Đơn hàng mới #12347 vừa được đặt.",
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 ngày trước
    read: true,
    type: "order",
  },
  {
    id: 13,
    message: "Báo cáo khách hàng tiềm năng tháng 4 đã có.",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 ngày trước
    read: true,
    type: "report",
  },
  {
    id: 14,
    message: "Đơn hàng #12340 đã bị hủy bởi khách hàng.",
    timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), // 11 ngày trước
    read: false,
    type: "order",
  },
  {
    id: 15,
    message: "Khách hàng 'Hoàng Văn Nam' đã gửi một yêu cầu hỗ trợ.",
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 ngày trước
    read: false,
    type: "customer",
  },
];

/**
 * Giả lập việc lấy thông báo từ API
 */
export const fetchNotifications = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNotifications);
    }, 800); // Giả lập độ trễ mạng
  });
};

/**
 * Giả lập việc đánh dấu thông báo là đã đọc
 * @param {number} notificationId - ID của thông báo
 */
export const markNotificationAsRead = (notificationId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const notification = mockNotifications.find(
        (n) => n.id === notificationId
      );
      if (notification) {
        notification.read = true;
        resolve({ ...notification }); // Trả về một bản sao
      } else {
        reject(new Error("Notification not found"));
      }
    }, 300); // Giả lập độ trễ mạng ngắn
  });
};

/**
 * Giả lập việc đánh dấu tất cả thông báo là đã đọc
 */
export const markAllNotificationsAsRead = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockNotifications.forEach((n) => {
        n.read = true;
      });
      // Trả về một bản sao của mảng đã cập nhật
      resolve(mockNotifications.map((n) => ({ ...n })));
    }, 500); // Giả lập độ trễ mạng
  });
};

/**
 * Giả lập việc xóa một thông báo
 * @param {number} notificationId - ID của thông báo cần xóa
 */
export const deleteNotification = (notificationId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = mockNotifications.length;
      mockNotifications = mockNotifications.filter(
        (n) => n.id !== notificationId
      );
      if (mockNotifications.length < initialLength) {
        resolve({ success: true, id: notificationId });
      } else {
        reject(new Error("Notification not found for deletion"));
      }
    }, 300);
  });
};

/**
 * Giả lập việc xóa tất cả thông báo
 */
export const deleteAllNotifications = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Chỉ xóa những thông báo đã hiển thị (đã được fetch)
      // Trong API thật, bạn sẽ có endpoint riêng để xóa tất cả
      mockNotifications = [];
      resolve({ success: true });
    }, 500);
  });
};

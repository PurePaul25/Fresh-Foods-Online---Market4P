// --- Dữ liệu giả lập ---
// Trong ứng dụng thực tế, dữ liệu này sẽ được lấy từ API.

export const mockProducts = [
  {
    id: "SP001",
    name: "Táo Envy New Zealand",
    img: "https://via.placeholder.com/80x80.png?text=Táo+Envy",
    category: "Táo & Lê",
    price: 250000,
    stock: 120,
    status: "Còn hàng",
    lowStockThreshold: 20,
    sold: 350,
  },
  {
    id: "SP002",
    name: "Cam Vàng Navel Úc",
    img: "https://via.placeholder.com/80x80.png?text=Cam+Navel",
    category: "Họ Cam Quýt",
    price: 180000,
    stock: 80,
    lowStockThreshold: 15,
    sold: 220,
    status: "Còn hàng",
    description:
      "Cam vàng Navel Úc có vị ngọt đậm, mọng nước, vỏ mỏng và dễ bóc. Thích hợp để ăn tươi hoặc vắt nước.",
  },
  {
    id: "SP003",
    name: "Dâu Tây Hàn Quốc",
    img: "https://via.placeholder.com/80x80.png?text=Dâu+Tây",
    category: "Quả Mọng",
    price: 450000,
    stock: 8,
    lowStockThreshold: 10,
    sold: 95,
    status: "Sắp hết hàng",
    description:
      "Dâu tây Hàn Quốc quả to, đỏ mọng, hương thơm nồng nàn và vị ngọt thanh. Là một trong những loại dâu tây ngon nhất thế giới.",
  },
  {
    id: "SP004",
    name: "Nho Xanh không hạt Mỹ",
    img: "https://via.placeholder.com/80x80.png?text=Nho+Xanh",
    category: "Quả Mọng",
    price: 320000,
    stock: 50,
    lowStockThreshold: 25,
    sold: 180,
    status: "Còn hàng",
  },
  {
    id: "SP005",
    name: "Xoài Cát Hòa Lộc",
    img: "https://via.placeholder.com/80x80.png?text=Xoài+Cát",
    category: "Trái cây nhiệt đới",
    price: 90000,
    stock: 0,
    lowStockThreshold: 10,
    sold: 300,
    status: "Hết hàng",
  },
  {
    id: "SP006",
    name: "Kiwi Vàng New Zealand",
    img: "https://via.placeholder.com/80x80.png?text=Kiwi",
    category: "Trái cây nhiệt đới",
    price: 150000,
    stock: 75,
    lowStockThreshold: 20,
    sold: 150,
    status: "Còn hàng",
  },
  {
    id: "SP007",
    name: "Lê Nam Phi",
    img: "https://via.placeholder.com/80x80.png?text=Lê+Nam+Phi",
    category: "Táo & Lê",
    price: 110000,
    stock: 90,
    lowStockThreshold: 15,
    sold: 110,
    status: "Còn hàng",
  },
  {
    id: "SP008",
    name: "Việt Quất Chile",
    img: "https://via.placeholder.com/80x80.png?text=Việt+Quất",
    category: "Quả Mọng",
    price: 380000,
    stock: 30,
    lowStockThreshold: 20,
    sold: 80,
    status: "Còn hàng",
  },
  {
    id: "SP009",
    name: "Bưởi Da Xanh",
    img: "https://via.placeholder.com/80x80.png?text=Bưởi",
    category: "Họ Cam Quýt",
    price: 60000,
    stock: 4,
    lowStockThreshold: 5,
    sold: 450,
    status: "Sắp hết hàng",
  },
  {
    id: "SP010",
    name: "Sầu Riêng Ri6",
    img: "https://via.placeholder.com/80x80.png?text=Sầu+Riêng",
    category: "Trái cây nhiệt đới",
    price: 220000,
    stock: 0,
    lowStockThreshold: 10,
    sold: 120,
    status: "Hết hàng",
  },
  {
    id: "SP011",
    name: "Cherry Mỹ",
    img: "https://via.placeholder.com/80x80.png?text=Cherry",
    category: "Quả Mọng",
    price: 550000,
    stock: 45,
    lowStockThreshold: 15,
    sold: 60,
    status: "Còn hàng",
  },
];

let mockOrders = [
  {
    id: "DH746F1",
    customerName: "Nguyễn Văn An",
    orderDate: "2023-10-26T10:30:00Z",
    total: 350000,
    status: "Hoàn thành",
    items: [
      { name: "Táo Envy", quantity: 2 },
      { name: "Nho Xanh", quantity: 1 },
    ],
  },
  {
    id: "DH239B3",
    customerName: "Trần Thị Bích",
    orderDate: "2023-10-25T14:00:00Z",
    total: 780000,
    status: "Đang giao",
    items: [{ name: "Sầu riêng Ri6", quantity: 3 }],
  },
  {
    id: "DH881C7",
    customerName: "Lê Hoàng Cường",
    orderDate: "2023-10-25T09:15:00Z",
    total: 150000,
    status: "Chờ xử lý",
    items: [{ name: "Cam sành", quantity: 5 }],
  },
  {
    id: "DH452A9",
    customerName: "Phạm Thuỳ Dung",
    orderDate: "2023-10-24T18:45:00Z",
    total: 220000,
    status: "Đã hủy",
    items: [
      { name: "Dâu tây", quantity: 1 },
      { name: "Việt quất", quantity: 1 },
    ],
  },
  {
    id: "DH673D2",
    customerName: "Võ Minh Long",
    orderDate: "2023-10-23T11:00:00Z",
    total: 95000,
    status: "Hoàn thành",
    items: [{ name: "Chuối Laba", quantity: 2 }],
  },
  {
    id: "DH109E5",
    customerName: "Đặng Thị Mai",
    orderDate: "2023-10-22T16:20:00Z",
    total: 560000,
    status: "Hoàn thành",
    items: [
      { name: "Táo Envy", quantity: 4 },
      { name: "Lê Hàn Quốc", quantity: 2 },
    ],
  },
  {
    id: "DH110F6",
    customerName: "Hoàng Văn Giang",
    orderDate: "2023-10-21T11:30:00Z",
    total: 120000,
    status: "Chờ xử lý",
    items: [{ name: "Xoài Cát Hòa Lộc", quantity: 2 }],
  },
  {
    id: "DH111G7",
    customerName: "Bùi Thị Hoa",
    orderDate: "2023-10-20T19:00:00Z",
    total: 450000,
    status: "Đang giao",
    items: [{ name: "Dưa hấu không hạt", quantity: 3 }],
  },
];

// Hàm để lấy tất cả đơn hàng
export const getOrders = () => {
  // Trả về một bản sao để tránh thay đổi trực tiếp mảng gốc ngoài ý muốn
  return [...mockOrders];
};

// Hàm để lấy tất cả sản phẩm
export const getProducts = () => {
  // Trả về một bản sao để tránh thay đổi trực tiếp mảng gốc ngoài ý muốn
  return [...mockProducts];
};

// Hàm để xóa một đơn hàng
export const deleteOrderById = (orderId) => {
  const indexToDelete = mockOrders.findIndex((order) => order.id === orderId);
  if (indexToDelete > -1) {
    mockOrders.splice(indexToDelete, 1);
    return true;
  }
  return false;
};

// Hàm tìm kiếm sản phẩm (đã có trong SearchResults, chuyển vào đây để quản lý tập trung)
export const searchProducts = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query) {
        return resolve([]);
      }
      const lowercasedQuery = query.toLowerCase();
      const results = mockProducts.filter(
        // Sử dụng mockProducts từ file riêng
        (product) =>
          product.name.toLowerCase().includes(lowercasedQuery) ||
          product.category.toLowerCase().includes(lowercasedQuery)
      );
      resolve(results);
    }, 500); // Giả lập độ trễ mạng
  });
};

// Hàm cập nhật tồn kho sản phẩm
export const updateProductStock = (productId, quantityChange) => {
  const productIndex = mockProducts.findIndex((p) => p.id === productId);
  if (productIndex > -1) {
    const product = mockProducts[productIndex];
    const newStock = product.stock + quantityChange; // quantityChange sẽ là số âm khi trừ kho

    if (newStock < 0) {
      // Không cho phép tồn kho âm
      console.error(
        `Không đủ hàng cho sản phẩm ${productId}. Tồn kho: ${
          product.stock
        }, Yêu cầu trừ: ${-quantityChange}`
      );
      return { success: false, product };
    }

    product.stock = newStock;

    // Nếu là trừ kho (bán hàng), tăng số lượng đã bán
    if (quantityChange < 0) {
      product.sold += -quantityChange;
    }

    // Tự động cập nhật trạng thái dựa trên tồn kho mới
    if (product.stock === 0) {
      product.status = "Hết hàng";
    } else if (product.stock <= product.lowStockThreshold) {
      product.status = "Sắp hết hàng";
    }
    return { success: true, product };
  }
  return { success: false, product: null };
};

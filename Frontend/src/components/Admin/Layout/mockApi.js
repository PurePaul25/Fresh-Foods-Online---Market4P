// --- Dữ liệu giả lập ---
// Trong ứng dụng thực tế, dữ liệu này sẽ được lấy từ API.

export const mockProducts = [
  // Thịt
  {
    id: "SP001",
    name: "Thịt bò Wagyu A5",
    img: "https://res.cloudinary.com/dswqplrdx/image/upload/v1716868822/market4p/bowagyu.avif",
    category: "Thịt",
    price: 1500000,
    stock: 50,
    status: "Còn hàng",
    description:
      "Thịt bò Wagyu A5 nhập khẩu từ Nhật Bản, nổi tiếng với vân mỡ cẩm thạch đẹp mắt và độ mềm tan trong miệng.",
    lowStockThreshold: 10,
    sold: 80,
    discount: 0,
  },
  {
    id: "SP002",
    name: "Sườn cốt lết heo",
    img: "https://res.cloudinary.com/dswqplrdx/image/upload/v1716868822/market4p/suoncotlet.avif",
    category: "Thịt",
    price: 120000,
    stock: 100,
    status: "Còn hàng",
    description:
      "Sườn cốt lết heo tươi ngon, phù hợp để chế biến các món chiên, nướng, ram mặn.",
    lowStockThreshold: 20,
    sold: 250,
    discount: 0,
  },
  // Bánh mì
  {
    id: "SP003",
    name: "Bánh mì lúa mạch nguyên cám",
    img: "https://res.cloudinary.com/dswqplrdx/image/upload/v1716868822/market4p/banhmiluamach.avif",
    category: "Bánh mì",
    price: 55000,
    stock: 80,
    status: "Còn hàng",
    description:
      "Bánh mì làm từ 100% lúa mạch nguyên cám, giàu chất xơ, tốt cho sức khỏe.",
    lowStockThreshold: 15,
    sold: 400,
    discount: 10,
  },
  {
    id: "SP004",
    name: "Bánh mì Sandwich",
    img: "https://res.cloudinary.com/dswqplrdx/image/upload/v1716868822/market4p/banhmisandwich.png",
    category: "Bánh mì",
    price: 35000,
    stock: 150,
    status: "Còn hàng",
    description:
      "Bánh mì sandwich mềm mịn, tiện lợi cho bữa sáng nhanh gọn hoặc làm món ăn nhẹ.",
    lowStockThreshold: 30,
    sold: 600,
    discount: 0,
  },
  // Trái cây
  {
    id: "SP005",
    name: "Dâu tây Đà Lạt",
    img: "https://res.cloudinary.com/dswqplrdx/image/upload/v1716868822/market4p/strawberry.jpg",
    category: "Trái cây",
    price: 180000,
    stock: 120,
    status: "Còn hàng",
    description:
      "Dâu tây tươi ngon từ Đà Lạt, vị ngọt thanh và hương thơm dịu nhẹ, giàu vitamin C.",
    lowStockThreshold: 20,
    sold: 350,
    discount: 15,
  },
  {
    id: "SP006",
    name: "Nho Xanh Nhập Khẩu",
    img: "https://res.cloudinary.com/dswqplrdx/image/upload/v1716868822/market4p/berry.jpg",
    category: "Trái cây",
    price: 320000,
    stock: 30,
    status: "Còn hàng",
    description:
      "Nho xanh nhập khẩu, hạt to, ngọt, không hạt, giàu chất chống oxy hóa.",
    lowStockThreshold: 10,
    sold: 120,
    discount: 0,
  },
  // Rau xanh
  {
    id: "SP007",
    name: "Bông cải xanh",
    img: "https://res.cloudinary.com/dswqplrdx/image/upload/v1716868822/market4p/bongcaixanh.png",
    category: "Rau xanh",
    price: 40000,
    stock: 90,
    status: "Còn hàng",
    description:
      "Bông cải xanh tươi, giàu vitamin và khoáng chất, lý tưởng cho các món luộc, xào.",
    lowStockThreshold: 25,
    sold: 500,
    discount: 0,
  },
  {
    id: "SP008",
    name: "Cà rốt Đà Lạt",
    img: "https://res.cloudinary.com/dswqplrdx/image/upload/v1716868822/market4p/carrot.avif",
    category: "Rau xanh",
    price: 25000,
    stock: 200,
    status: "Còn hàng",
    description: "Cà rốt tươi, giòn, ngọt, được trồng theo tiêu chuẩn VietGAP.",
    lowStockThreshold: 40,
    sold: 800,
    discount: 0,
  },
  // Trứng
  {
    id: "SP009",
    name: "Trứng gà ta",
    img: "https://res.cloudinary.com/dswqplrdx/image/upload/v1716868822/market4p/cate_eggs.avif",
    category: "Trứng",
    price: 45000,
    stock: 300,
    status: "Còn hàng",
    description: "Trứng gà ta thả vườn, lòng đỏ đậm, giàu dinh dưỡng.",
    lowStockThreshold: 50,
    sold: 1200,
    discount: 0,
  },
  {
    id: "SP010",
    name: "Trứng cút",
    img: "https://via.placeholder.com/80x80.png?text=Trứng+cút",
    category: "Trứng",
    price: 20000,
    stock: 0,
    status: "Hết hàng",
    description:
      "Trứng cút tươi, nhỏ xinh, có thể dùng để luộc, làm gỏi hoặc chiên.",
    lowStockThreshold: 50,
    sold: 1500,
    discount: 0,
  },
  {
    id: "SP011",
    name: "Cam Sành Tươi",
    img: "https://res.cloudinary.com/dswqplrdx/image/upload/v1716868822/market4p/lemon.jpg",
    category: "Trái cây",
    price: 60000,
    stock: 8,
    status: "Sắp hết hàng",
    description:
      "Cam sành tươi ngon, vỏ mỏng, nhiều nước ngọt và có mùi thơm đặc trưng.",
    lowStockThreshold: 5,
    sold: 95,
    discount: 0,
  },
];

let mockOrders = [
  {
    id: "DH746F1",
    customerName: "Nguyễn Văn An",
    orderDate: "2023-10-26T10:30:00Z",
    total: 540000, // 2*250000 + 1*40000
    status: "Hoàn thành",
    items: [
      { name: "Dâu tây Đà Lạt", quantity: 2 },
      { name: "Bông cải xanh", quantity: 1 },
    ],
  },
  {
    id: "DH239B3",
    customerName: "Trần Thị Bích",
    orderDate: "2023-10-25T14:00:00Z",
    total: 3000000, // 2 * 1500000
    status: "Đang giao",
    items: [{ name: "Thịt bò Wagyu A5", quantity: 2 }],
  },
  {
    id: "DH881C7",
    customerName: "Lê Hoàng Cường",
    orderDate: "2023-10-25T09:15:00Z",
    total: 175000, // 5 * 35000
    status: "Chờ xử lý",
    items: [{ name: "Bánh mì Sandwich", quantity: 5 }],
  },
  {
    id: "DH452A9",
    customerName: "Phạm Thuỳ Dung",
    orderDate: "2023-10-24T18:45:00Z",
    total: 500000, // 1*180000 + 1*320000
    status: "Đã hủy",
    items: [
      { name: "Dâu tây Đà Lạt", quantity: 1 },
      { name: "Nho Xanh Nhập Khẩu", quantity: 1 },
    ],
  },
  {
    id: "DH673D2",
    customerName: "Võ Minh Long",
    orderDate: "2023-10-23T11:00:00Z",
    total: 50000, // 2 * 25000
    status: "Hoàn thành",
    items: [{ name: "Cà rốt Đà Lạt", quantity: 2 }],
  },
  {
    id: "DH109E5",
    customerName: "Đặng Thị Mai",
    orderDate: "2023-10-22T16:20:00Z",
    total: 480000, // 2*180000 + 1*120000
    status: "Hoàn thành",
    items: [
      { name: "Dâu tây Đà Lạt", quantity: 2 },
      { name: "Sườn cốt lết heo", quantity: 1 },
    ],
  },
  {
    id: "DH110F6",
    customerName: "Hoàng Văn Giang",
    orderDate: "2023-10-21T11:30:00Z",
    total: 240000, // 2 * 120000
    status: "Chờ xử lý",
    items: [{ name: "Sườn cốt lết heo", quantity: 2 }],
  },
  {
    id: "DH111G7",
    customerName: "Bùi Thị Hoa",
    orderDate: "2023-10-20T19:00:00Z",
    total: 135000, // 3 * 45000
    status: "Đang giao",
    items: [{ name: "Trứng gà ta", quantity: 3 }],
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

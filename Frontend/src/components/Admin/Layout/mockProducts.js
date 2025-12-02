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
    discount: 0,
  },
  {
    id: "SP010",
    name: "Trứng cút",
    img: "https://via.placeholder.com/80x80.png?text=Trứng+cút",
    category: "Trứng",
    price: 20000,
    stock: 500,
    status: "Còn hàng",
    description:
      "Trứng cút tươi, nhỏ xinh, có thể dùng để luộc, làm gỏi hoặc chiên.",
    discount: 0,
  },
  // Sản phẩm khác để đủ số lượng
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
    discount: 0,
  },
  {
    id: "SP012",
    name: "Sườn non heo",
    img: "https://via.placeholder.com/80x80.png?text=Sườn+non",
    category: "Thịt",
    price: 180000,
    stock: 0,
    status: "Hết hàng",
    description:
      "Sườn non heo tươi, phần thịt mềm và sụn giòn, tuyệt vời cho món nướng hoặc hầm.",
    discount: 0,
  },
  {
    id: "SP013",
    name: "Cải bó xôi",
    img: "https://via.placeholder.com/80x80.png?text=Cải+bó+xôi",
    category: "Rau xanh",
    price: 35000,
    stock: 70,
    status: "Còn hàng",
    description:
      "Cải bó xôi (rau bina) hữu cơ, giàu sắt và vitamin, tốt cho máu và sức khỏe tim mạch.",
    discount: 0,
  },
  {
    id: "SP014",
    name: "Bánh mì Baguette",
    img: "https://via.placeholder.com/80x80.png?text=Baguette",
    category: "Bánh mì",
    price: 15000,
    stock: 5,
    status: "Sắp hết hàng",
    description:
      "Bánh mì Baguette kiểu Pháp, vỏ giòn rụm, ruột mềm, thơm mùi bơ.",
    discount: 0,
  },
];

import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ChevronRight,
  Archive,
  ChevronDown,
  Loader,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import apiService from "../../services/api";

// --- FAKE API & DATA ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const generateRandomId = (length = 12) => {
  return Math.random()
    .toString(16)
    .substring(2, length + 2);
};

// Helper function to normalize product name for matching
const normalizeProductName = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "") // Remove special characters
    .replace(/\s+/g, " "); // Normalize spaces
};

// Helper function to get product image from API
const getProductImage = (productName, productsMap) => {
  if (!productName || !productsMap || Object.keys(productsMap).length === 0) {
    return "https://via.placeholder.com/150";
  }

  // Normalize the search name
  const normalizedSearchName = normalizeProductName(productName);

  // Try exact match first
  let product = productsMap[normalizedSearchName];

  // If no exact match, try partial match
  if (!product) {
    const matchingKey = Object.keys(productsMap).find((key) => {
      const normalizedKey = normalizeProductName(key);
      return (
        normalizedKey.includes(normalizedSearchName) ||
        normalizedSearchName.includes(normalizedKey)
      );
    });
    if (matchingKey) {
      product = productsMap[matchingKey];
    }
  }

  // If still no match, use first available product as fallback
  if (!product && Object.keys(productsMap).length > 0) {
    product = Object.values(productsMap)[0];
  }

  if (!product) return "https://via.placeholder.com/150";

  // Get image from product
  if (product.images && product.images.length > 0) {
    const firstImage = product.images[0];
    if (typeof firstImage === "string") return firstImage;
    if (firstImage?.url) return firstImage.url;
    if (firstImage?.image) return firstImage.image;
  }

  // Fallback to product.image if exists
  if (product.image) return product.image;

  return "https://via.placeholder.com/150";
};

// Fake orders data
const fakeOrdersData = [
  {
    _id: generateRandomId(),
    createdAt: "2024-05-20T10:30:00Z",
    status: "Đang xử lý",
    shippingAddress: {
      phone: "0987654321",
      address: "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh",
    },
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    shippingFee: 15000,
    history: [
      { status: "Đang xử lý", timestamp: "2025-12-02T10:35:00Z" },
      { status: "Đã đặt hàng", timestamp: "2025-12-01T10:30:00Z" },
    ],
    items: [
      {
        productId: "MEAT_01",
        quantity: 5,
        price: 45000,
        productName: "Trứng cút (10 quả)",
      },
      {
        productId: "EGG_01",
        quantity: 2,
        price: 35000,
        productName: "Trứng Gà Ta Thả Vườn (Vỉ 10)",
      },
    ],
    totalAmount: 180000 + 2 * 35000 + 15000,
  },
  {
    _id: generateRandomId(),
    createdAt: "2024-05-18T09:00:00Z",
    status: "Đã hủy",
    shippingAddress: {
      phone: "0909090909",
      address: "789 Đường GHI, Phường JKL, Quận 3, TP. Hồ Chí Minh",
    },
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    shippingFee: 15000,
    history: [
      { status: "Đã hủy", timestamp: "2025-11-28T09:30:00Z" },
      { status: "Đã đặt hàng", timestamp: "2025-11-28T09:00:00Z" },
    ],
    items: [
      {
        productId: "BREAD_01",
        quantity: 3,
        price: 25000,
        productName: "Trứng cút (10 quả)",
      },
    ],
    totalAmount: 2 * 25000,
  },
  {
    _id: generateRandomId(),
    createdAt: "2024-05-23T11:00:00Z",
    status: "Đã giao",
    shippingAddress: {
      phone: "0912345678",
      address: "101 Đường MNO, Phường PQR, Quận 4, TP. Hồ Chí Minh",
    },
    paymentMethod: "Thẻ tín dụng/Ghi nợ",
    shippingFee: 0,
    history: [
      { status: "Đã giao", timestamp: "2025-11-30T11:00:00Z" },
      { status: "Đang giao hàng", timestamp: "2025-11-28T08:00:00Z" },
      { status: "Đang xử lý", timestamp: "2025-11-23T10:35:00Z" },
      { status: "Đã đặt hàng", timestamp: "2025-11-20T10:30:00Z" },
    ],
    items: [
      {
        productId: "EGG_02",
        quantity: 1,
        price: 45000,
        productName: "Trứng Gà Hữu Cơ (Organic) (Vỉ 10)",
      },
      {
        productId: "BREAD_02",
        quantity: 1,
        price: 30000,
        productName: "Bánh Croissant Bơ",
      },
    ],
    totalAmount: 45000 + 30000,
  },
];

// --- HELPER COMPONENTS ---
const StatusBadge = ({ status }) => {
  const statusStyles = {
    "Đã giao": {
      icon: <CheckCircle className="w-4 h-4" />,
      text: "text-green-700",
      bg: "bg-green-100",
    },
    "Đang giao hàng": {
      icon: <Truck className="w-4 h-4" />,
      text: "text-blue-700",
      bg: "bg-blue-100",
    },
    "Đang xử lý": {
      icon: <Package className="w-4 h-4" />,
      text: "text-amber-700",
      bg: "bg-amber-100",
    },
    "Đã hủy": {
      icon: <XCircle className="w-4 h-4" />,
      text: "text-red-700",
      bg: "bg-red-100",
    },
  };

  const style = statusStyles[status] || {};

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      {style.icon}
      <span>{status}</span>
    </div>
  );
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tất cả");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [productsMap, setProductsMap] = useState({});
  const [userDisplayName, setUserDisplayName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let displayName = "";
        // Fetch user info để lấy displayName
        try {
          const userResponse = await apiService.getCurrentUser();
          if (userResponse.success && userResponse.data) {
            displayName = userResponse.data.displayName || "";
            setUserDisplayName(displayName);
          }
        } catch {
          // Fallback to localStorage
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            displayName = user.displayName || "";
            setUserDisplayName(displayName);
          }
        }

        // Fetch products để lấy ảnh - map theo tên sản phẩm
        try {
          const productsResponse = await apiService.getProducts({ limit: 100 });
          const products =
            productsResponse.data?.data || productsResponse.data || [];
          const productsMapObj = {};

          // Map products by normalized name để tìm ảnh cho fake orders
          products.forEach((product) => {
            const productName = product.name || "";
            if (productName) {
              const normalizedName = normalizeProductName(productName);
              // Store both original and normalized key for better matching
              productsMapObj[normalizedName] = product;
              productsMapObj[productName.toLowerCase()] = product; // Also store lowercase for backward compatibility
            }
          });

          console.log(
            "Products map created:",
            Object.keys(productsMapObj).length,
            "products"
          );
          console.log(
            "Sample product names:",
            products.slice(0, 3).map((p) => p.name)
          );
          setProductsMap(productsMapObj);
        } catch (err) {
          console.error("Error fetching products:", err);
          // Even if error, set empty map so component doesn't break
          setProductsMap({});
        }

        // Sử dụng fake orders nhưng map với real data
        const transformedOrders = fakeOrdersData.map((order) => ({
          ...order,
          shippingAddress: {
            ...order.shippingAddress,
            name: displayName || "Người dùng",
          },
        }));

        setOrders(transformedOrders);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Nếu lỗi, vẫn hiển thị fake data
        const userStr = localStorage.getItem("user");
        let displayName = "";
        if (userStr) {
          const user = JSON.parse(userStr);
          displayName = user.displayName || "";
          setUserDisplayName(displayName);
        }
        setOrders(
          fakeOrdersData.map((order) => ({
            ...order,
            shippingAddress: {
              ...order.shippingAddress,
              name: displayName || "Người dùng",
            },
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null); // Collapse if already expanded
    } else {
      setExpandedOrderId(orderId); // Expand new one
    }
  };

  const filteredOrders =
    filter === "Tất cả"
      ? orders
      : orders.filter((order) => order.status === filter);

  const TABS = ["Tất cả", "Đang xử lý", "Đang giao hàng", "Đã giao", "Đã hủy"];

  return (
    <div>
      <Navbar />
      <div className="pt-28 min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 p-4 sm:px-6 sm:pb-6 sm:pt-32">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Đơn hàng của tôi
          </h1>

          {/* Filter Tabs */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex border-b border-gray-200">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                    filter === tab
                      ? "border-b-2 border-amber-600 text-amber-600"
                      : "text-gray-500 cursor-pointer hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader className="w-8 h-8 text-amber-600 animate-spin" />
              </div>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden transition-shadow hover:shadow-xl"
                >
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Mã đơn: {order._id}
                      </p>
                      <p className="text-xs text-gray-500">
                        Ngày đặt:{" "}
                        {new Date(
                          order.createdAt || order.created_at
                        ).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="p-4">
                    {order.items.map((item, idx) => {
                      const imageUrl = getProductImage(
                        item.productName,
                        productsMap
                      );
                      return (
                        <div
                          key={item.productId || idx}
                          className="flex gap-4 mb-4 last:mb-0"
                        >
                          <img
                            src={imageUrl}
                            alt={item.productName}
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={(e) => {
                              // Fallback nếu ảnh lỗi
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                          <div className="grow">
                            <p className="font-medium text-gray-800">
                              {item.productName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Số lượng: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {item.price.toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-gray-50 p-4 flex justify-end items-center gap-4">
                    <p className="text-gray-600">
                      Tổng tiền:{" "}
                      <span className="font-bold text-lg text-amber-600">
                        {order.totalAmount.toLocaleString("vi-VN")}đ
                      </span>
                    </p>
                    <button
                      onClick={() => handleToggleDetails(order._id)}
                      className="flex items-center cursor-pointer gap-1 px-4 py-2 text-sm font-medium text-amber-600 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      {expandedOrderId === order._id
                        ? "Ẩn chi tiết"
                        : "Xem chi tiết"}
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-300 ${
                          expandedOrderId === order._id ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Expanded Details Section */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      expandedOrderId === order._id
                        ? "max-h-[500px]"
                        : "max-h-0"
                    }`}
                  >
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <div className="grid md:grid-cols-2 gap-6 text-sm">
                        {/* Shipping Info */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Thông tin giao hàng
                          </h4>
                          <div className="space-y-1 text-gray-600">
                            <p>{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.phone}</p>
                            <p>{order.shippingAddress.address}</p>
                          </div>
                          <h4 className="font-semibold text-gray-800 mt-4 mb-2">
                            Phương thức thanh toán
                          </h4>
                          <p className="text-gray-600">{order.paymentMethod}</p>
                        </div>

                        {/* Order History */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Lịch sử đơn hàng
                          </h4>
                          <ul className="space-y-2">
                            {order.history.map((entry, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="shrink-0">
                                  <div
                                    className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
                                      index === 0
                                        ? "bg-amber-500"
                                        : "bg-gray-300"
                                    }`}
                                  ></div>
                                  {index < order.history.length - 1 && (
                                    <div className="w-px h-6 bg-gray-300 mx-auto"></div>
                                  )}
                                </div>
                                <div>
                                  <p
                                    className={`font-medium ${
                                      index === 0
                                        ? "text-gray-800"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {entry.status}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(entry.timestamp).toLocaleString(
                                      "vi-VN"
                                    )}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-amber-100">
                <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700">
                  Chưa có đơn hàng
                </h3>
                <p className="text-gray-500">
                  Bạn chưa có đơn hàng nào trong mục này.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserOrders;

import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaDollarSign,
} from "react-icons/fa";
import { initialOrders, getStatusIcon } from "./Orders"; // Import dữ liệu đơn hàng chung và icon
import StatCard from "./StatCard";
import apiService from "../../../services/api";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// --- Dữ liệu giả lập ---
// Trong một ứng dụng thực tế, dữ liệu này sẽ được lấy từ API.

// 1. Dữ liệu thống kê tổng quan
const summaryStats = [
  {
    title: "Tổng khách hàng",
    value: 148,
    comparison: "+12.5%", // So sánh với kỳ trước
    isPositive: true,
    icon: <FaUsers className="text-blue-500" size={24} />,
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
  },
  {
    title: "Tổng sản phẩm",
    value: 1320,
    comparison: "+50", // Thêm 50 sản phẩm mới
    isPositive: true,
    icon: <FaBoxOpen className="text-orange-500" size={24} />,
    bgColor: "bg-green-100 dark:bg-green-900/50",
  },
  {
    title: "Tổng đơn hàng",
    value: 356,
    comparison: "+8.2%",
    isPositive: true,
    icon: <FaShoppingCart className="text-yellow-500" size={24} />,
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
  },
  {
    title: "Tổng doanh thu",
    value: 121000000,
    comparison: "+15.3%",
    isPositive: true,
    suffix: "đ",
    icon: <FaDollarSign className="text-red-500" size={24} />,
    bgColor: "bg-red-100 dark:bg-red-900/50",
  },
];

// Dữ liệu KPIs
const kpiData = [
  {
    title: "Giá trị đơn hàng trung bình",
    value: (summaryStats[3].value / summaryStats[2].value).toFixed(0), // Revenue / Orders
    suffix: "đ",
    description: "Doanh thu trung bình trên mỗi đơn hàng.",
  },
  {
    title: "Tỷ lệ khách hàng mới",
    value: 35,
    suffix: "%",
    description: "Tỷ lệ khách hàng mua lần đầu trong tháng.",
  },
];

// 2. Dữ liệu biểu đồ doanh thu
const salesData = {
  labels: [
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
  ],
  datasets: [
    {
      label: "Doanh thu (triệu đồng)",
      data: [56, 55, 60, 75, 59, 80, 85],
      fill: true, // Bật tô màu vùng dưới đường line
      borderColor: "rgb(59, 130, 246)", // Màu xanh dương đậm
      backgroundColor: "rgba(59, 130, 246, 0.2)", // Màu gradient nền
      tension: 0.4, // Làm cho đường cong mượt hơn
      pointBackgroundColor: "rgb(59, 130, 246)",
      pointBorderColor: "#fff",
    },
  ],
};

// 3. Dữ liệu biểu đồ tròn danh mục thực phẩm
const categoryData = {
  labels: ["Trái cây", "Thịt", "Trứng", "Rau xanh", "Bánh mì"],
  datasets: [
    {
      label: "Sản phẩm đã bán",
      data: [120, 150, 80, 110, 90],
      backgroundColor: [
        "rgba(255, 99, 132, 0.8)", // Trái cây (Đỏ)
        "rgba(201, 108, 7, 0.8)", // Thịt (Nâu)
        "rgba(255, 206, 86, 0.8)", // Trứng (Vàng)
        "rgba(75, 192, 192, 0.8)", // Rau xanh (Xanh lá)
        "rgba(153, 102, 255, 0.8)", // Bánh mì (Tím)
      ],
      borderColor: "#ffffff", // Màu viền trắng
      borderWidth: 2, // Tăng độ dày viền
    },
  ],
};

// 4. Tùy chọn cho biểu đồ để thêm hiệu ứng
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false, // Tắt tiêu đề mặc định của chartjs
    },
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleFont: {
        size: 14,
        weight: "bold",
      },
      bodyFont: {
        size: 12,
      },
      callbacks: {
        // Tùy chỉnh tooltip cho biểu đồ tròn để hiển thị %
        label: function (context) {
          // Chỉ áp dụng logic tính % cho biểu đồ tròn (doughnut)
          if (context.chart.config.type === "doughnut") {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.chart.getDatasetMeta(0).total;
            // Kiểm tra để tránh chia cho 0
            if (total > 0) {
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
            return `${label}: ${value}`;
          }

          // Logic mặc định cho các biểu đồ khác (như Line chart)
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y;
          }
          return label;
        },
      },
    },
  },
  animation: {
    duration: 1500,
    easing: "easeInOutQuart",
  },
};

// 4. Dữ liệu đơn hàng gần đây
// Lấy 4 đơn hàng gần nhất từ dữ liệu chung
const recentOrders = [...initialOrders]
  .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
  .slice(0, 4);

// Hàm helper để lấy class cho badge trạng thái
const getStatusBadge = (status) => {
  switch (status) {
    case "Hoàn thành":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Đã duyệt":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
    case "Đang giao":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Chờ xử lý":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Đã hủy":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

// Cấu hình animation cho Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

function DashboardHome() {
  const navigate = useNavigate();
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [isLoadingTopProducts, setIsLoadingTopProducts] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      setIsLoadingTopProducts(true);
      try {
        // Lấy tất cả đơn hàng và tất cả sản phẩm
        // Tạm thời sử dụng dữ liệu mẫu vì apiService.getOrders() chưa tồn tại
        const orders = initialOrders;
        const productsRes = await apiService.getProducts();
        const products = productsRes?.data || [];

        // Tính toán số lượng đã bán cho mỗi sản phẩm từ các đơn hàng đã hoàn thành
        const soldCount = {};
        orders.forEach((order) => {
          if (order.status === "Hoàn thành" && Array.isArray(order.items)) {
            order.items.forEach((item) => {
              // Tìm sản phẩm trong danh sách products để lấy ID
              const product = products.find((p) => p.name === item.name);
              const productId = product?._id;
              if (productId) {
                soldCount[productId] =
                  (soldCount[productId] || 0) + item.quantity;
              }
            });
          }
        });

        // Gắn số lượng đã bán vào danh sách sản phẩm và tính doanh thu
        const productsWithStats = products.map((p) => ({
          ...p,
          sold: soldCount[p._id] || 0,
          revenue: (soldCount[p._id] || 0) * p.price,
        }));

        // Sắp xếp và lấy top 4
        const sortedProducts = productsWithStats
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 4);

        setTopSellingProducts(sortedProducts);
      } catch (error) {
        console.error("Failed to fetch top selling products:", error);
        setTopSellingProducts([]);
      } finally {
        setIsLoadingTopProducts(false);
      }
    };
    fetchTopProducts();
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Bảng điều khiển
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Chào mừng bạn trở lại! Đây là tổng quan hệ thống của bạn.
      </p>

      {/* Thống kê tổng quan */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {summaryStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </motion.div>

      {/* Biểu đồ */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Thống kê doanh thu 6 tháng gần nhất
          </h2>
          <div className="h-80">
            <Line data={salesData} options={chartOptions} />
          </div>
        </motion.div>
        <motion.div
          className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Tỷ lệ thực phẩm bán chạy
          </h2>
          <div className="h-80">
            <Doughnut data={categoryData} options={chartOptions} />
          </div>
        </motion.div>
      </motion.div>

      {/* KPIs */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {kpiData.map((kpi, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {kpi.title}
            </p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-2">
              <CountUp
                end={kpi.value}
                duration={2}
                separator=","
                suffix={kpi.suffix || ""}
                formattingFn={(value) => {
                  if (kpi.suffix === "đ") {
                    return value.toLocaleString("vi-VN");
                  }
                  return value;
                }}
              />
              {kpi.suffix}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {kpi.description}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Bảng Đơn hàng gần đây */}
      <motion.div
        className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Đơn hàng gần đây
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Mã ĐH
                </th>
                <th scope="col" className="px-6 py-3">
                  Khách hàng
                </th>
                <th scope="col" className="px-6 py-3">
                  Tổng tiền
                </th>
                <th scope="col" className="px-6 py-3">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() =>
                    // Điều hướng đến trang chi tiết đơn hàng
                    navigate(`/admin/dashboard/orders/${order.id}`)
                  }
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4">
                    {order.total.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bảng Top sản phẩm bán chạy */}
      <motion.div
        className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Top sản phẩm bán chạy
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Sản phẩm
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Đã bán
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Doanh thu
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoadingTopProducts ? (
                <tr>
                  <td colSpan="3" className="text-center py-6">
                    <div className="flex justify-center items-center gap-2 text-gray-500">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
                      Đang tải...
                    </div>
                  </td>
                </tr>
              ) : topSellingProducts.length > 0 ? (
                topSellingProducts.map((product) => (
                  <tr
                    key={product._id || product.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          className="w-10 h-10 rounded-md object-cover"
                          src={
                            product.images?.[0]?.url ||
                            "https://via.placeholder.com/40"
                          }
                          alt={product.name}
                        />
                        <span>{product.name}</span>
                      </div>
                    </th>
                    <td className="px-6 py-4 text-center">
                      {product.sold || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(product.revenue || 0).toLocaleString("vi-VN")}đ
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    Không có dữ liệu sản phẩm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardHome;

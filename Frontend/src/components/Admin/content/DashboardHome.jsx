import React from "react";
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
    value: 1280,
    icon: <FaUsers className="text-blue-500" size={24} />,
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
  },
  {
    title: "Tổng sản phẩm",
    value: 8320,
    icon: <FaBoxOpen className="text-orange-500" size={24} />,
    bgColor: "bg-green-100 dark:bg-green-900/50",
  },
  {
    title: "Tổng đơn hàng",
    value: 3456,
    icon: <FaShoppingCart className="text-yellow-500" size={24} />,
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
  },
  {
    title: "Tổng doanh thu",
    value: 150000000,
    suffix: "đ",
    icon: <FaDollarSign className="text-red-500" size={24} />,
    bgColor: "bg-red-100 dark:bg-red-900/50",
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

// 3. Dữ liệu biểu đồ tròn danh mục trái cây
const categoryData = {
  labels: ["Trái cây nhiệt đới", "Họ Cam Quýt", "Quả Mọng", "Táo & Lê"],
  datasets: [
    {
      label: "Sản phẩm đã bán",
      data: [120, 90, 150, 60],
      backgroundColor: [
        "rgba(255, 206, 86, 0.8)", // Vàng (Nhiệt đới)
        "rgba(255, 159, 64, 0.8)", // Cam (Họ Cam Quýt)
        "rgba(255, 99, 132, 0.8)", // Đỏ (Quả Mọng)
        "rgba(75, 192, 192, 0.8)", // Xanh lá (Táo & Lê)
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
          <motion.div
            key={index}
            className={`p-4 rounded-lg shadow-md flex items-center space-x-4 ${stat.bgColor} text-gray-800 dark:text-gray-200`}
            variants={itemVariants}
          >
            <div className="p-3 bg-white rounded-full">{stat.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-[22px] font-bold">
                <CountUp
                  end={stat.value}
                  duration={2.5}
                  separator=","
                  suffix={stat.suffix || ""}
                />
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Biểu đồ */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6"
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
            Tỷ lệ trái cây bán chạy
          </h2>
          <div className="h-80">
            <Doughnut data={categoryData} options={chartOptions} />
          </div>
        </motion.div>
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
    </div>
  );
}

export default DashboardHome;

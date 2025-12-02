import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Calendar,
  Hash,
  DollarSign,
  Package as PackageIcon,
  Frown,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { initialOrders, getStatusBadge, getStatusIcon } from "./Orders"; // Import từ Orders.jsx

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập việc fetch dữ liệu chi tiết đơn hàng
    const findOrder = initialOrders.find((o) => o.id === orderId);
    setTimeout(() => {
      setOrder(findOrder);
      setLoading(false);
    }, 500); // Giả lập độ trễ mạng
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <Frown className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-200">
          Không tìm thấy đơn hàng
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Đơn hàng với ID "{orderId}" không tồn tại hoặc đã bị xóa.
        </p>
        <button
          onClick={() => navigate("/admin/dashboard/orders")}
          className="mt-6 flex items-center cursor-pointer transition-colors duration-200 justify-center mx-auto gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-50 dark:bg-gray-900"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Chi tiết Đơn hàng
        </h1>
      </div>

      {/* Nội dung chi tiết */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        {/* Thông tin tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-b dark:border-gray-700 pb-6 mb-6">
          <InfoItem icon={<Hash />} label="Mã Đơn Hàng" value={order.id} />
          <InfoItem
            icon={<User />}
            label="Khách Hàng"
            value={order.customerName}
          />
          <InfoItem
            icon={<Calendar />}
            label="Ngày Đặt"
            value={new Date(order.orderDate).toLocaleDateString("vi-VN")}
          />
          <InfoItem
            icon={<DollarSign />}
            label="Tổng Tiền"
            value={`${order.total.toLocaleString("vi-VN")} VNĐ`}
            valueClass="font-bold text-green-600 dark:text-green-400"
          />
        </div>

        {/* Trạng thái và danh sách sản phẩm */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
              Trạng thái
            </h3>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-base font-semibold rounded-lg ${getStatusBadge(
                order.status
              )}`}
            >
              {getStatusIcon(order.status)}
              {order.status}
            </span>
            {order.status === "Đã hủy" && order.reason && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 rounded-r-lg">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                  Lý do hủy:
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {order.reason}
                </p>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
              Các sản phẩm
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {item.name}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    Số lượng:{" "}
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {item.quantity}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Component phụ để hiển thị một mục thông tin
const InfoItem = ({ icon, label, value, valueClass = "" }) => (
  <div className="flex items-center gap-3">
    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-amber-600 dark:text-amber-400">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p
        className={`text-base font-medium text-gray-900 dark:text-white ${valueClass}`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default OrderDetail;

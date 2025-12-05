import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Eye,
  MoreVertical,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Truck,
  PackageCheck,
  ArrowUp,
  ArrowDown,
  Check,
  ClipboardCheck,
  XCircle,
} from "lucide-react";
import ConfirmationModal from "../Layout/ConfirmationModal";
import { updateProductStock, getProducts } from "../Layout/mockApi";

// --- Dữ liệu giả lập ---
// Dữ liệu này được đặt tạm thời ở đây. Khi có API, bạn sẽ thay thế bằng logic fetch.
// eslint-disable-next-line react-refresh/only-export-components
export const initialOrders = [
  {
    id: "DH746F1",
    customerName: "Nguyễn Văn An",
    orderDate: "2025-10-26T10:30:00Z",
    total: 360000,
    status: "Hoàn thành",
    items: [
      { name: "Dâu tây Đà Lạt", quantity: 2 },
      { name: "Bông cải xanh", quantity: 1 },
    ],
    reason: null,
  },
  {
    id: "DH239B3",
    customerName: "Trần Thị Bích",
    orderDate: "2025-10-25T14:00:00Z",
    total: 3000000,
    status: "Đang giao",
    items: [{ name: "Thịt bò Wagyu A5", quantity: 2 }],
    reason: null,
  },
  {
    id: "DH112D5",
    customerName: "Võ Thị E",
    orderDate: "2025-10-26T11:00:00Z",
    total: 450000,
    status: "Đã duyệt",
    items: [{ name: "Trứng gà ta", quantity: 10 }],
    reason: null,
  },
  {
    id: "DH881C7",
    customerName: "Lê Hoàng Cường",
    orderDate: "2025-10-25T09:15:00Z",
    total: 175000,
    status: "Chờ xử lý",
    items: [{ name: "Bánh mì Sandwich", quantity: 5 }],
    reason: null,
  },
  {
    id: "DH452A9",
    customerName: "Phạm Thuỳ Dung",
    orderDate: "2025-10-24T18:45:00Z",
    total: 500000,
    status: "Đã hủy",
    items: [
      { name: "Dâu tây Đà Lạt", quantity: 1 },
      { name: "Nho Xanh Nhập Khẩu", quantity: 1 },
    ],
    reason: "Khách hàng yêu cầu hủy.",
  },
  // Thêm các đơn hàng khác nếu cần
];

// --- Hằng số và Hàm helper ---
const statuses = [
  "Tất cả",
  "Chờ xử lý",
  "Đã duyệt",
  "Đang giao",
  "Hoàn thành",
  "Đã hủy",
];

// eslint-disable-next-line react-refresh/only-export-components
export const getStatusBadge = (status) => {
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

// eslint-disable-next-line react-refresh/only-export-components
export const getStatusIcon = (status) => {
  switch (status) {
    case "Hoàn thành":
      return <PackageCheck size={18} />;
    case "Đã duyệt":
      return <ClipboardCheck size={18} />;
    case "Đang giao":
      return <Truck size={18} />;
    case "Đã hủy":
      return <XCircle size={18} />;
    case "Chờ xử lý":
      return <Filter size={18} />;
    default:
      return <Filter size={18} />;
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

function OrdersList() {
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "orderDate",
    direction: "desc",
  });

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const sortedAndFilteredOrders = useMemo(() => {
    let sortableItems = [...orders];

    // Lọc
    if (filterStatus !== "Tất cả") {
      sortableItems = sortableItems.filter(
        (order) => order.status === filterStatus
      );
    }

    // Sắp xếp
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [orders, filterStatus, sortConfig]);

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedAndFilteredOrders.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedAndFilteredOrders.length / itemsPerPage);

  // Xử lý lỗi phân trang: Nếu xóa item cuối cùng của trang hiện tại,
  // tự động quay về trang cuối cùng hợp lệ.
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Logic xóa
  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      // Cập nhật UI trực tiếp, không cần gọi API giả
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderToDelete.id)
      );
      toast.success(`Đơn hàng "${orderToDelete.id}" đã được xóa.`);
      setDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  // Logic hủy đơn hàng
  const handleCancelClick = (order) => {
    setOrderToCancel(order);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = (reason) => {
    if (orderToCancel) {
      handleStatusChange(orderToCancel.id, "Đã hủy", reason);
      toast.success(`Đơn hàng "${orderToCancel.id}" đã được hủy.`);
    }
    setCancelModalOpen(false);
    setOrderToCancel(null);
  };

  // Logic thay đổi trạng thái
  const handleStatusChange = (orderId, newStatus, reason = null) => {
    const orderToUpdate = orders.find((o) => o.id === orderId);
    if (!orderToUpdate) return;

    // Logic cộng trả lại kho khi hủy đơn hàng
    // Chỉ cộng trả lại kho nếu đơn hàng đã được duyệt hoặc đang giao trước đó
    if (
      newStatus === "Đã hủy" &&
      (orderToUpdate.status === "Đã duyệt" ||
        orderToUpdate.status === "Đang giao")
    ) {
      const productsInStock = getProducts();
      orderToUpdate.items.forEach((item) => {
        const product = productsInStock.find((p) => p.name === item.name);
        // Cộng trả lại số lượng (quantityChange là số dương)
        if (product) updateProductStock(product.id, item.quantity);
      });
    }

    // Logic trừ kho khi duyệt đơn hàng
    if (newStatus === "Đã duyệt") {
      const productsInStock = getProducts();
      // Kiểm tra xem có đủ hàng không TRƯỚC KHI duyệt
      for (const item of orderToUpdate.items) {
        // Cần tìm ID sản phẩm từ tên
        const product = productsInStock.find((p) => p.name === item.name);
        if (!product) {
          toast.error(`Sản phẩm "${item.name}" không tồn tại trong hệ thống!`);
          return; // Dừng lại nếu sản phẩm không tồn tại
        }
        if (product.stock < item.quantity) {
          toast.error(
            `Không đủ hàng cho "${item.name}". Tồn kho: ${product.stock}, yêu cầu: ${item.quantity}.`
          );
          return; // Dừng lại nếu không đủ hàng
        }
      }

      // Nếu đủ hàng, tiến hành trừ kho
      orderToUpdate.items.forEach((item) => {
        const product = productsInStock.find((p) => p.name === item.name);
        if (product) {
          updateProductStock(product.id, -item.quantity);
        }
      });
    }

    // Cập nhật trạng thái đơn hàng trên UI
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus, reason } : order
    );
    setOrders(updatedOrders);
    toast.success(`Đã cập nhật trạng thái đơn hàng #${orderId}.`);
  };

  // Logic sắp xếp
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      // Tùy chọn: Nhấp lần thứ 3 để xóa sắp xếp
      // key = null;
    }
    setSortConfig({ key, direction });
  };

  return (
    <motion.div
      className="p-6 bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa đơn hàng"
        message={`Bạn có chắc chắn muốn xóa đơn hàng "${orderToDelete?.id}"?`}
        confirmText="Xóa"
      />

      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        orderId={orderToCancel?.id}
      />

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Quản lý Đơn hàng
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="pl-9 pr-4 py-2 text-sm font-medium cursor-pointer text-gray-600 bg-white border rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-x-auto rounded-t-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Mã ĐH
                </th>
                <th scope="col" className="px-6 py-3 min-w-[150px]">
                  Khách hàng
                </th>
                <th scope="col" className="px-6 py-3 min-w-[200px]">
                  Sản phẩm
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  <button
                    onClick={() => handleSort("total")}
                    className="flex items-center justify-end w-full gap-1 group cursor-pointer"
                  >
                    Tổng tiền (VNĐ)
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {sortConfig.key === "total" ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )
                      ) : (
                        <ArrowDown size={14} className="text-gray-400" />
                      )}
                    </span>
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3">
                  <button
                    onClick={() => handleSort("orderDate")}
                    className="flex items-center gap-1 group cursor-pointer"
                  >
                    Ngày đặt
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {sortConfig.key === "orderDate" ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )
                      ) : null}
                    </span>
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <motion.tbody>
              <AnimatePresence>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <motion.tr
                      key={order.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <td className="px-6 py-4 font-medium text-amber-600 whitespace-nowrap dark:text-amber-500">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {order.items
                          .map((item) => `${item.name} (x${item.quantity})`)
                          .join(", ")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {order.total.toLocaleString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 relative">
                        <div className="flex justify-center items-center gap-2">
                          <ActionMenu
                            order={order}
                            onStatusChange={handleStatusChange}
                            onCancelClick={handleCancelClick}
                            onDeleteClick={handleDeleteClick}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-10 text-gray-500 dark:text-gray-400"
                    >
                      Không có đơn hàng nào.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t dark:border-gray-700">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <ChevronLeft size={16} />
              Trang trước
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Trang sau
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Component ActionMenu cho từng đơn hàng
function ActionMenu({ order, onStatusChange, onCancelClick, onDeleteClick }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpward, setIsUpward] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    if (!isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Ước tính chiều cao của menu (khoảng 200px)
      // Nếu không đủ không gian bên dưới, mở menu lên trên
      if (spaceBelow < 200) {
        setIsUpward(true);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleStatusUpdate = (newStatus) => {
    onStatusChange(order.id, newStatus);
    toast.success(`Đã cập nhật trạng thái thành "${newStatus}"`);
    setIsOpen(false);
  };

  const menuItems = {
    "Chờ xử lý": [
      { label: "Duyệt đơn", action: () => handleStatusUpdate("Đã duyệt") },
      { label: "Hủy đơn", action: () => onCancelClick(order) },
    ],
    "Đã duyệt": [
      { label: "Bắt đầu giao", action: () => handleStatusUpdate("Đang giao") },
      { label: "Hủy đơn", action: () => onCancelClick(order) },
    ],
    "Đang giao": [
      { label: "Hoàn thành", action: () => handleStatusUpdate("Hoàn thành") },
    ],
    "Hoàn thành": [],
    "Đã hủy": [],
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
      >
        <MoreVertical size={18} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border dark:border-gray-700 ${
              isUpward ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            <div className="py-1">
              <button
                onClick={() => navigate(`/admin/dashboard/orders/${order.id}`)}
                className="w-full text-left flex items-center cursor-pointer gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Eye size={16} /> Xem chi tiết
              </button>
              {menuItems[order.status]?.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full text-left flex items-center cursor-pointer gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {item.label === "Duyệt đơn" && <Check size={16} />}
                  {item.label === "Bắt đầu giao" && <Truck size={16} />}
                  {item.label === "Hoàn thành" && <PackageCheck size={16} />}
                  {item.label === "Hủy đơn" && <XCircle size={16} />}
                  {item.label}
                </button>
              ))}
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              <button
                onClick={() => onDeleteClick(order)}
                className="w-full text-left flex items-center cursor-pointer gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={16} /> Xóa vĩnh viễn
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal để hủy đơn hàng và nhập lý do
function CancelOrderModal({ isOpen, onClose, onConfirm, orderId }) {
  const [reason, setReason] = useState("");

  const handleConfirmClick = () => {
    onConfirm(reason);
    setReason(""); // Reset reason after confirm
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirmClick}
      title={`Hủy đơn hàng ${orderId || ""}`}
      confirmText="Xác nhận hủy"
      message="" // Message is replaced by custom children
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn
        tác.
      </p>
      <div className="mt-4">
        <label
          htmlFor="cancel-reason"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Lý do hủy (không bắt buộc)
        </label>
        <textarea
          id="cancel-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Ví dụ: Khách hàng yêu cầu, hết hàng,..."
        ></textarea>
      </div>
    </ConfirmationModal>
  );
}

export default OrdersList;

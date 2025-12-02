import React, { useState, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Ticket,
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmationModal from "../Layout/ConfirmationModal";
import { format } from "date-fns";
import CouponModal from "./CouponModal";

// --- Dữ liệu giả lập ---
const initialCoupons = [
  {
    id: "C001",
    code: "SALE10",
    type: "percentage",
    value: 10,
    startDate: "2025-11-01T00:00:00Z",
    endDate: "2025-11-30T23:59:59Z",
    usageLimit: 100,
    usageCount: 45,
  },
  {
    id: "C002",
    code: "FREESHIP",
    type: "fixed",
    value: 30000,
    startDate: "2025-10-01T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    usageLimit: null,
    usageCount: 120,
  },
  {
    id: "C003",
    code: "WELCOME50K",
    type: "fixed",
    value: 50000,
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    usageLimit: 1,
    usageCount: 1,
  },
  {
    id: "C004",
    code: "BLACKFRIDAY",
    type: "percentage",
    value: 50,
    startDate: "2024-11-20T00:00:00Z",
    endDate: "2024-11-25T23:59:59Z",
    usageLimit: 500,
    usageCount: 500,
  },
];

// --- Hàm và Component phụ ---
const getStatus = (coupon) => {
  const now = new Date();
  const startDate = new Date(coupon.startDate);
  const endDate = new Date(coupon.endDate);

  if (now < startDate) {
    return {
      text: "Chưa bắt đầu",
      badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    };
  }
  if (now > endDate) {
    return {
      text: "Đã hết hạn",
      badge: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
  }
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    return {
      text: "Hết lượt",
      badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
  }
  return {
    text: "Đang hoạt động",
    badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function Coupons() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [isCouponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [coupons, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCoupons = filteredCoupons.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (couponToDelete) {
      setCoupons((prev) => prev.filter((c) => c.id !== couponToDelete.id));
      toast.success(`Đã xóa mã giảm giá "${couponToDelete.code}".`);
      setDeleteModalOpen(false);
      setCouponToDelete(null);
    }
  };

  const handleEditClick = (coupon) => {
    setEditingCoupon(coupon);
    setCouponModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingCoupon(null);
    setCouponModalOpen(true);
  };

  const handleSaveCoupon = (couponData) => {
    if (editingCoupon) {
      // Chế độ chỉnh sửa
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCoupon.id
            ? { ...c, ...couponData, id: editingCoupon.id } // Giữ lại ID cũ
            : c
        )
      );
      toast.success(`Đã cập nhật mã giảm giá "${couponData.code}".`);
    } else {
      // Chế độ thêm mới
      const newCoupon = {
        ...couponData,
        id: `C${Date.now().toString().slice(-4)}`, // Tạo ID đơn giản
        usageCount: 0,
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      toast.success(`Đã thêm mã giảm giá "${couponData.code}".`);
      // Reset bộ lọc và phân trang để coupon mới được hiển thị
      setSearchTerm("");
      setCurrentPage(1);
    }
    setCouponModalOpen(false);
    setEditingCoupon(null);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(
      () => {
        toast.success(`Đã sao chép mã "${code}"!`);
      },
      () => {
        toast.error("Không thể sao chép mã.");
      }
    );
  };

  return (
    <motion.div
      className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa mã giảm giá"
        message={`Bạn có chắc chắn muốn xóa mã "${couponToDelete?.code}" không?`}
        confirmText="Xóa"
      />

      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        onSave={handleSaveCoupon}
        coupon={editingCoupon}
      />

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Ticket size={32} className="text-amber-500" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Phiếu giảm giá
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm mã coupon..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            />
          </div>
          <button
            onClick={handleAddNewClick}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600"
          >
            <Plus size={16} />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Bảng Coupons */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Mã Coupon
                </th>
                <th scope="col" className="px-6 py-3">
                  Giá trị
                </th>
                <th scope="col" className="px-6 py-3">
                  Ngày bắt đầu
                </th>
                <th scope="col" className="px-6 py-3">
                  Ngày kết thúc
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Lượt sử dụng
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {currentCoupons.map((coupon) => {
                const status = getStatus(coupon);
                return (
                  <motion.tr
                    key={coupon.id}
                    className="border-b dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                    variants={itemVariants}
                  >
                    <td
                      className="px-6 py-4 font-bold text-gray-900 dark:text-white cursor-pointer group"
                      onClick={() => handleCopyCode(coupon.code)}
                      title="Nhấn để sao chép"
                    >
                      <div className="flex items-center gap-2">
                        <span>{coupon.code}</span>
                        <Copy
                          size={14}
                          className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {coupon.type === "percentage"
                        ? `${coupon.value}%`
                        : `${coupon.value.toLocaleString("vi-VN")} VNĐ`}
                    </td>
                    <td className="px-6 py-4">
                      {format(new Date(coupon.startDate), "dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      {format(new Date(coupon.endDate), "dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {coupon.usageCount} / {coupon.usageLimit ?? "∞"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${status.badge}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleEditClick(coupon)}
                          className="p-2 rounded-full cursor-pointer duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(coupon)}
                          className="p-2 rounded-full cursor-pointer duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t dark:border-gray-700">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <ChevronLeft size={16} /> Trang trước
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Trang sau <ChevronRight size={16} />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Coupons;

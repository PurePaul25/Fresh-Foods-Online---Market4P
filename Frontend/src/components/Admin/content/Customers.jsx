import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  UserPlus,
  Users,
  Activity,
  DollarSign,
  UserX,
  UserCheck,
} from "lucide-react";
import ConfirmationModal from "../Layout/ConfirmationModal";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import BanCustomerModal from "./BanCustomerModal";

// --- Dữ liệu giả lập ---
// Trong ứng dụng thực tế, dữ liệu này sẽ được lấy từ API.
const initialCustomers = [
  {
    id: "CUST001",
    name: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    phone: "0901234567",
    registrationDate: "2025-10-15T09:00:00Z",
    totalSpent: 1500000,
    lastOrderDate: "2025-10-26T10:30:00Z",
    avatar: `https://i.pravatar.cc/150?u=CUST001`,
    status: "active",
    banReason: null,
  },
  {
    id: "CUST002",
    name: "Trần Thị Bích",
    email: "bich.tran@example.com",
    phone: "0912345678",
    registrationDate: "2025-09-20T14:30:00Z",
    totalSpent: 780000,
    lastOrderDate: "2025-10-25T14:00:00Z",
    avatar: `https://i.pravatar.cc/150?u=CUST002`,
    status: "active",
    banReason: null,
  },
  {
    id: "CUST003",
    name: "Lê Hoàng Cường",
    email: "cuong.le@example.com",
    phone: "0987654321",
    registrationDate: "2024-08-01T11:00:00Z",
    totalSpent: 3200000,
    lastOrderDate: "2025-10-25T09:15:00Z",
    avatar: `https://i.pravatar.cc/150?u=CUST003`,
    status: "banned",
    banReason: "Tài khoản có dấu hiệu gian lận trong các đơn hàng.",
  },
  {
    id: "CUST004",
    name: "Phạm Thuỳ Dung",
    email: "dung.pham@example.com",
    phone: "0934567890",
    registrationDate: "2025-10-05T18:00:00Z",
    totalSpent: 220000,
    lastOrderDate: "2025-10-24T18:45:00Z",
    avatar: `https://i.pravatar.cc/150?u=CUST004`,
    status: "active",
    banReason: null,
  },
  {
    id: "CUST005",
    name: "Võ Thị E",
    email: "e.vo@example.com",
    phone: "0945678901",
    registrationDate: "2025-07-12T08:20:00Z",
    totalSpent: 450000,
    lastOrderDate: "2025-10-26T11:00:00Z",
    avatar: `https://i.pravatar.cc/150?u=CUST005`,
    status: "active",
    banReason: null,
  },
  {
    id: "CUST006",
    name: "Hoàng Minh Khang",
    email: "khang.hoang@example.com",
    phone: "0967890123",
    registrationDate: "2024-05-30T20:10:00Z",
    totalSpent: 0,
    lastOrderDate: null,
    avatar: `https://i.pravatar.cc/150?u=CUST006`,
    status: "active",
    banReason: null,
  },
];

// Hàm helper để lấy class cho badge trạng thái
const getStatusBadge = (lastOrderDate) => {
  if (!lastOrderDate) {
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
  const daysSinceLastOrder =
    (new Date() - new Date(lastOrderDate)) / (1000 * 60 * 60 * 24);
  if (daysSinceLastOrder <= 30) {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  }
  if (daysSinceLastOrder <= 90) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  }
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
};

const getStatusText = (lastOrderDate) => {
  if (!lastOrderDate) {
    return "Mới";
  }
  const daysSinceLastOrder =
    (new Date() - new Date(lastOrderDate)) / (1000 * 60 * 60 * 24);
  if (daysSinceLastOrder <= 30) {
    return "Hoạt động";
  }
  if (daysSinceLastOrder <= 90) {
    return "Ít hoạt động";
  }
  return "Không hoạt động";
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

// Component thẻ thống kê
const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 p-5 shadow-md rounded-xl flex items-center gap-4"
    variants={itemVariants}
  >
    <div className={`rounded-full p-3 ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        {value}
      </p>
    </div>
  </motion.div>
);

function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isBanModalOpen, setBanModalOpen] = useState(false);
  const [customerToBan, setCustomerToBan] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "registrationDate",
    direction: "desc",
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(
      (c) =>
        c.lastOrderDate &&
        (new Date() - new Date(c.lastOrderDate)) / (1000 * 60 * 60 * 24) <= 30
    ).length;
    const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);

    return {
      totalCustomers,
      activeCustomers,
      totalRevenue: totalRevenue.toLocaleString("vi-VN") + " VNĐ",
    };
  }, [customers]);

  const sortedAndFilteredCustomers = useMemo(() => {
    let filteredItems = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredItems;
  }, [customers, searchTerm, sortConfig]);

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = sortedAndFilteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    sortedAndFilteredCustomers.length / itemsPerPage
  );

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
  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
      toast.success(`Khách hàng "${customerToDelete.name}" đã được xóa.`);
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  // Logic cấm tài khoản
  const handleBanClick = (customer) => {
    setCustomerToBan(customer);
    setBanModalOpen(true);
  };

  const handleConfirmBan = (reason) => {
    if (customerToBan) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customerToBan.id
            ? { ...c, status: "banned", banReason: reason }
            : c
        )
      );
      toast.success(`Đã cấm tài khoản "${customerToBan.name}".`);
      setBanModalOpen(false);
      setCustomerToBan(null);
    }
  };

  const handleUnban = (customer) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customer.id ? { ...c, status: "active", banReason: null } : c
      )
    );
    toast.success(`Đã bỏ cấm tài khoản "${customer.name}".`);
  };

  // Logic sắp xếp
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader = ({ columnKey, title }) => (
    <th scope="col" className="px-6 py-3">
      <button
        onClick={() => handleSort(columnKey)}
        className="flex items-center gap-1 group cursor-pointer"
      >
        {title}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          {sortConfig.key === columnKey ? (
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
  );

  return (
    <motion.div
      className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa khách hàng"
        message={`Bạn có chắc chắn muốn xóa khách hàng "${customerToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
      />
      <BanCustomerModal
        isOpen={isBanModalOpen}
        onClose={() => setBanModalOpen(false)}
        onConfirm={handleConfirmBan}
        customerName={customerToBan?.name}
      />

      {/* Header & Stats */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Quản lý Khách hàng
        </h1>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <StatCard
            icon={<Users size={24} className="text-sky-600" />}
            title="Tổng khách hàng"
            value={stats.totalCustomers}
            color="bg-sky-100 dark:bg-sky-900/50"
          />
          <StatCard
            icon={<Activity size={24} className="text-green-600" />}
            title="Đang hoạt động"
            value={stats.activeCustomers}
            color="bg-green-100 dark:bg-green-900/50"
          />
          <StatCard
            icon={<DollarSign size={24} className="text-amber-600" />}
            title="Tổng doanh thu"
            value={stats.totalRevenue}
            color="bg-amber-100 dark:bg-amber-900/50"
          />
        </motion.div>
      </div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full sm:w-72 pl-10 transition duration-200 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Bảng khách hàng */}
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
                  Khách hàng
                </th>
                <SortableHeader
                  columnKey="registrationDate"
                  title="Ngày tham gia"
                />
                <SortableHeader columnKey="totalSpent" title="Tổng chi tiêu" />
                <th scope="col" className="px-6 py-3 text-center">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <motion.tbody>
              <AnimatePresence>
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((customer) => (
                    <motion.tr
                      key={customer.id}
                      className={`border-b dark:border-gray-700 transition-colors ${
                        customer.status === "banned"
                          ? "bg-red-50 dark:bg-red-900/20 opacity-60"
                          : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <div
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() =>
                            navigate(
                              `/admin/dashboard/customers/${customer.id}`
                            )
                          }
                        >
                          <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-base duration-200 group-hover:text-amber-600 transition-colors">
                              {customer.name}
                            </div>
                            {customer.status === "banned" && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-red-800 bg-red-200 dark:text-red-200 dark:bg-red-800 rounded-full">
                                Đã cấm
                              </span>
                            )}
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </th>
                      <td className="px-6 py-4">
                        {format(new Date(customer.registrationDate), "P", {
                          locale: vi,
                        })}
                      </td>
                      <td className="px-6 py-4 font-medium text-green-600 dark:text-green-400">
                        {customer.totalSpent.toLocaleString("vi-VN")} VNĐ
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 text-xs font-semibold leading-tight rounded-full ${getStatusBadge(
                            customer.lastOrderDate
                          )}`}
                        >
                          {getStatusText(customer.lastOrderDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          {customer.status === "active" ? (
                            <button
                              onClick={() => handleBanClick(customer)}
                              className="p-2 rounded-full cursor-pointer duration-200 hover:bg-yellow-100 dark:hover:bg-gray-700 text-yellow-600 dark:text-yellow-400 transition-colors"
                              title="Cấm tài khoản"
                            >
                              <UserX size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnban(customer)}
                              className="p-2 rounded-full cursor-pointer duration-200 hover:bg-green-100 dark:hover:bg-gray-700 text-green-600 dark:text-green-400 transition-colors"
                              title="Bỏ cấm tài khoản"
                            >
                              <UserCheck size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(customer)}
                            className="p-2 rounded-full cursor-pointer duration-200 hover:bg-red-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500 dark:text-gray-400"
                    >
                      Không tìm thấy khách hàng nào.
                    </td>
                  </motion.tr>
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
              className="flex items-center cursor-pointer duration-200 gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <ChevronLeft size={16} />
              Trang trước
            </button>

            <div className="text-sm text-gray-700 dark:text-gray-400">
              Trang <span className="font-semibold">{currentPage}</span> trên{" "}
              <span className="font-semibold">{totalPages}</span>
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center cursor-pointer duration-200 gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
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

export default Customers;

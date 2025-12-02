import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Frown,
  User,
  LogIn,
  Star,
  UserX,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Spinner from "../Layout/Spinner";
import toast from "react-hot-toast";
import BanCustomerModal from "./BanCustomerModal";
import ConfirmationModal from "../Layout/ConfirmationModal";

// --- Dữ liệu giả lập ---
// Trong ứng dụng thực tế, bạn sẽ fetch dữ liệu khách hàng dựa trên ID.
// Để đơn giản, chúng ta sẽ sử dụng lại mảng initialCustomers.
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

// --- Dữ liệu giả lập cho lịch sử hoạt động ---
const mockActivityHistory = [
  {
    id: 1,
    date: "2025-10-26T11:00:00Z",
    type: "order",
    description: "Đặt hàng thành công: #DH-12345",
  },
  {
    id: 2,
    date: "2025-10-26T10:30:00Z",
    type: "login",
    description: "Đăng nhập từ thiết bị mới (Chrome on Windows)",
  },
  {
    id: 3,
    date: "2025-10-25T14:00:00Z",
    type: "order",
    description: "Đặt hàng thành công: #DH-12344",
  },
  {
    id: 4,
    date: "2025-10-22T09:00:00Z",
    type: "profile",
    description: "Cập nhật địa chỉ giao hàng",
  },
  {
    id: 5,
    date: "2025-10-20T15:45:00Z",
    type: "review",
    description: 'Đánh giá sản phẩm "Áo thun nam"',
  },
];

const activityIcons = {
  order: <ShoppingCart size={16} />,
  login: <LogIn size={16} />,
  profile: <User size={16} />,
  review: <Star size={16} />,
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-gray-400 mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ activity }) => (
  <div className="flex gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
      {activityIcons[activity.type] || <User size={16} />}
    </div>
    <div className="grow">
      <p className="text-sm text-gray-800 dark:text-gray-200">
        {activity.description}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {format(new Date(activity.date), "PPP p", { locale: vi })}
      </p>
    </div>
  </div>
);

function CustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [isBanModalOpen, setBanModalOpen] = useState(false);
  const [isUnbanModalOpen, setUnbanModalOpen] = useState(false);

  useEffect(() => {
    // Giả lập việc fetch dữ liệu chi tiết khách hàng
    setLoading(true);
    const timer = setTimeout(() => {
      const findCustomer = initialCustomers.find((c) => c.id === customerId);
      setCustomer(findCustomer);
      setLoading(false);
    }, 700); // Giả lập độ trễ mạng 0.7 giây

    return () => clearTimeout(timer); // Dọn dẹp khi component unmount
  }, [customerId]);

  // --- Logic cấm/bỏ cấm ---
  const handleConfirmBan = (reason) => {
    setCustomer((prev) => ({ ...prev, status: "banned", banReason: reason }));
    toast.success(`Đã cấm tài khoản "${customer.name}".`);
    setBanModalOpen(false);
  };

  const handleConfirmUnban = () => {
    setCustomer((prev) => ({ ...prev, status: "active", banReason: null }));
    toast.success(`Đã bỏ cấm tài khoản "${customer.name}".`);
    setUnbanModalOpen(false);
  };

  // Trong ứng dụng thực tế, bạn sẽ cần gọi API ở đây để cập nhật dữ liệu ở backend.
  // useEffect(() => {
  //   if (customer) { /* gọi API cập nhật customer */ }
  // }, [customer?.status]);

  if (loading) {
    return <Spinner />;
  }

  if (!customer) {
    return (
      <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <Frown className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-200">
          Không tìm thấy khách hàng
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Khách hàng với ID "{customerId}" không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BanCustomerModal
        isOpen={isBanModalOpen}
        onClose={() => setBanModalOpen(false)}
        onConfirm={handleConfirmBan}
        customerName={customer?.name}
      />

      <ConfirmationModal
        isOpen={isUnbanModalOpen}
        onClose={() => setUnbanModalOpen(false)}
        onConfirm={handleConfirmUnban}
        title="Xác nhận bỏ cấm"
        message={`Bạn có chắc chắn muốn bỏ cấm cho tài khoản "${customer?.name}" không?`}
        confirmText="Xác nhận"
      />

      <button
        onClick={() => navigate(-1)}
        className="flex items-center cursor-pointer gap-2 mb-6 text-sm font-medium text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-amber-500 transition-colors"
      >
        <ArrowLeft size={16} />
        Quay lại danh sách
      </button>

      {customer.status === "banned" && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r-lg flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <h4 className="font-bold text-red-800 dark:text-red-200">
              Tài khoản đã bị cấm
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              Tài khoản này hiện không thể đăng nhập hoặc thực hiện giao dịch.
            </p>
          </div>
        </div>
      )}

      <div className="relative bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 md:p-8">
        {/* Nút hành động cấm/bỏ cấm */}
        <div className="absolute top-4 right-4">
          {customer.status === "active" ? (
            <button
              onClick={() => setBanModalOpen(true)}
              className="flex items-center cursor-pointer gap-2 px-3 py-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-lg hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:hover:bg-yellow-900 transition-colors"
              title="Cấm tài khoản"
            >
              <UserX size={16} />
              <span className="hidden sm:inline">Cấm tài khoản</span>
            </button>
          ) : (
            <button
              onClick={() => setUnbanModalOpen(true)}
              className="flex items-center cursor-pointer gap-2 px-3 py-2 text-sm font-medium text-green-800 bg-green-100 rounded-lg hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900 transition-colors"
              title="Bỏ cấm tài khoản"
            >
              <UserCheck size={16} />
              <span className="hidden sm:inline">Bỏ cấm</span>
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-8 pr-32 sm:pr-0">
          <div className="relative">
            <img
              src={customer.avatar}
              alt={customer.name}
              className={`w-28 h-28 rounded-full object-cover border-4 ${
                customer.status === "banned"
                  ? "border-red-300 dark:border-red-700"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            />
          </div>
          <div className="text-center md:text-left grow">
            <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                {customer.name}
              </h1>
              {customer.status === "banned" && (
                <span className="px-3 py-1 text-sm font-semibold text-red-800 bg-red-200 dark:text-red-200 dark:bg-red-800 rounded-full">
                  Đã cấm
                </span>
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400">{customer.id}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                activeTab === "details"
                  ? "border-amber-500 text-amber-600 dark:text-amber-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
              }`}
            >
              Thông tin chung
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                activeTab === "activity"
                  ? "border-amber-500 text-amber-600 dark:text-amber-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
              }`}
            >
              Lịch sử hoạt động
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "details" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DetailItem
                  icon={<Mail size={20} />}
                  label="Email"
                  value={customer.email}
                />
                <DetailItem
                  icon={<Phone size={20} />}
                  label="Số điện thoại"
                  value={customer.phone}
                />
                <DetailItem
                  icon={<Calendar size={20} />}
                  label="Ngày tham gia"
                  value={format(new Date(customer.registrationDate), "PPP", {
                    locale: vi,
                  })}
                />
                <DetailItem
                  icon={<DollarSign size={20} />}
                  label="Tổng chi tiêu"
                  value={`${customer.totalSpent.toLocaleString("vi-VN")} VNĐ`}
                />
                <DetailItem
                  icon={<ShoppingCart size={20} />}
                  label="Đơn hàng cuối"
                  value={
                    customer.lastOrderDate
                      ? format(new Date(customer.lastOrderDate), "PPP p", {
                          locale: vi,
                        })
                      : "Chưa có đơn hàng"
                  }
                />
              </div>
            )}
            {activeTab === "activity" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">
                  Hoạt động gần đây
                </h3>
                {mockActivityHistory.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default CustomerDetail;

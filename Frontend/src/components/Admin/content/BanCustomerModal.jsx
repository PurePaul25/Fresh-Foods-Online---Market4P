import React, { useState } from "react";
import ConfirmationModal from "../Layout/ConfirmationModal";

function BanCustomerModal({ isOpen, onClose, onConfirm, customerName }) {
  const [reason, setReason] = useState("");

  const handleConfirmClick = () => {
    onConfirm(reason);
    setReason(""); // Reset lại lý do sau khi xác nhận
  };

  if (!isOpen) return null;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirmClick}
      title={`Cấm tài khoản "${customerName}"`}
      confirmText="Xác nhận cấm"
      message="" // Bỏ message mặc định để dùng children
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Bạn có chắc chắn muốn cấm tài khoản này không? Khách hàng sẽ không thể
        đăng nhập hoặc thực hiện giao dịch.
      </p>
      <div className="mt-4 text-left">
        <label
          htmlFor="ban-reason"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Lý do cấm (bắt buộc)
        </label>
        <textarea
          id="ban-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="mt-1 w-full px-3 py-2 transition duration-200 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Ví dụ: Vi phạm điều khoản, spam,..."
        ></textarea>
      </div>
    </ConfirmationModal>
  );
}

export default BanCustomerModal;

import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { X, Save, Ticket } from "lucide-react";
import toast from "react-hot-toast";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { y: "-50px", opacity: 0 },
  visible: { y: "0", opacity: 1, transition: { duration: 0.3 } },
  exit: { y: "50px", opacity: 0, transition: { duration: 0.3 } },
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-3 py-2 bg-gray-50 border transition duration-200 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>
);

function CouponModal({ isOpen, onClose, onSave, coupon }) {
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
  });

  const isEditing = !!coupon;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setFormData({
          ...coupon,
          startDate: coupon.startDate.split("T")[0], // Format for date input
          endDate: coupon.endDate.split("T")[0],
          usageLimit: coupon.usageLimit ?? "",
        });
      } else {
        // Reset for new coupon
        setFormData({
          code: "",
          type: "percentage",
          value: "",
          startDate: "",
          endDate: "",
          usageLimit: "",
        });
      }
    }
  }, [isOpen, coupon, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.code ||
      !formData.value ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    const dataToSave = {
      ...formData,
      value: parseFloat(formData.value),
      usageLimit: formData.usageLimit
        ? parseInt(formData.usageLimit, 10)
        : null,
      startDate: `${formData.startDate}T00:00:00Z`,
      endDate: `${formData.endDate}T23:59:59Z`,
    };

    onSave(dataToSave);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Ticket size={20} />
                {isEditing
                  ? "Chỉnh sửa Phiếu giảm giá"
                  : "Thêm Phiếu giảm giá mới"}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full cursor-pointer duration-200 text-gray-500 hover:text-red-500 hover:bg-red-200 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                <div className="sm:col-span-2">
                  <InputField
                    label="Mã Coupon"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Ví dụ: SALE2024"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Loại giảm giá
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 transition duration-200 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>
                <InputField
                  label="Giá trị"
                  name="value"
                  type="number"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder={formData.type === "percentage" ? "10" : "50000"}
                  required
                  min="0"
                />
                <InputField
                  label="Ngày bắt đầu"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Ngày kết thúc"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
                <div className="sm:col-span-2">
                  <InputField
                    label="Giới hạn lượt sử dụng (bỏ trống nếu không giới hạn)"
                    name="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    placeholder="100"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium cursor-pointer duration-200 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center cursor-pointer duration-200 gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Save size={16} /> Lưu
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CouponModal;

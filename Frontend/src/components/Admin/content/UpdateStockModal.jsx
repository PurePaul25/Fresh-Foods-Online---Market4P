import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Package } from "lucide-react";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { y: "-50px", opacity: 0 },
  visible: {
    y: "0",
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    y: "50px",
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

function UpdateStockModal({ isOpen, onClose, onConfirm, product }) {
  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("");

  useEffect(() => {
    if (isOpen && product) {
      // Reset input khi modal được mở
      setQuantityToAdd("");
      setLowStockThreshold(product.lowStockThreshold);
    }
  }, [isOpen, product]);

  const handleConfirmClick = () => {
    const quantity = quantityToAdd ? parseInt(quantityToAdd, 10) : 0;
    const threshold = lowStockThreshold ? parseInt(lowStockThreshold, 10) : 0;

    if (
      !isNaN(quantity) &&
      quantity >= 0 &&
      !isNaN(threshold) &&
      threshold >= 0
    ) {
      onConfirm(product.id, quantity, threshold);
    } else {
      // Có thể thêm toast error ở đây nếu muốn
    }
  };

  if (!product) return null;

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
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Package size={20} /> Cập nhật tồn kho
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full cursor-pointer duration-200 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-800 dark:text-gray-200">
                Sản phẩm: <span className="font-bold">{product.name}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Tồn kho hiện tại:{" "}
                <span className="font-bold text-lg">{product.stock}</span>
              </p>
              <div>
                <label
                  htmlFor="quantity-to-add"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Số lượng nhập thêm
                </label>
                <input
                  id="quantity-to-add"
                  type="number"
                  value={quantityToAdd}
                  onChange={(e) => setQuantityToAdd(e.target.value)}
                  min="1"
                  className="mt-1 w-full px-3 py-2 transition duration-200 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Nhập số lượng..."
                  autoFocus
                />
              </div>
              <div>
                <label
                  htmlFor="low-stock-threshold"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Ngưỡng sắp hết
                </label>
                <input
                  id="low-stock-threshold"
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  min="0"
                  className="mt-1 w-full px-3 py-2 transition duration-200 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Ví dụ: 10"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium cursor-pointer duration-200 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmClick}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer duration-200 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} /> Xác nhận
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UpdateStockModal;

import React, { useState } from "react";
import { X, KeyRound, Eye, EyeOff, Save } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  error,
  showPassword,
  toggleShowPassword,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-200"
    >
      {label}
    </label>
    <div className="relative mt-1">
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 pr-10 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 dark:border-gray-600"
        }`}
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!currentPassword)
      newErrors.currentPassword = "Mật khẩu hiện tại là bắt buộc.";
    if (!newPassword) {
      newErrors.newPassword = "Mật khẩu mới là bắt buộc.";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự.";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Giả lập gọi API
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // Logic giả: nếu mật khẩu hiện tại là 'password123' thì thành công
        if (currentPassword === "password123") {
          console.log("Password changed successfully to:", newPassword);
          resolve("Mật khẩu đã được thay đổi thành công!");
        } else {
          reject(new Error("Mật khẩu hiện tại không đúng."));
        }
      }, 1500);
    });

    toast.promise(promise, {
      loading: "Đang xử lý...",
      success: (message) => {
        onClose(); // Đóng modal khi thành công
        return <b>{message}</b>;
      },
      error: (err) => <b>{err.toString()}</b>,
    });
  };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      y: "-50px",
      opacity: 0,
    },
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <KeyRound size={20} /> Đổi mật khẩu
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-500 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <PasswordInput
                  id="currentPassword"
                  label="Mật khẩu hiện tại"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={errors.currentPassword}
                  showPassword={showCurrent}
                  toggleShowPassword={() => setShowCurrent(!showCurrent)}
                />
                <PasswordInput
                  id="newPassword"
                  label="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={errors.newPassword}
                  showPassword={showNew}
                  toggleShowPassword={() => setShowNew(!showNew)}
                />
                <PasswordInput
                  id="confirmPassword"
                  label="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  showPassword={showConfirm}
                  toggleShowPassword={() => setShowConfirm(!showConfirm)}
                />
              </div>
              <div className="flex justify-end gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save size={16} /> Lưu thay đổi
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChangePasswordModal;

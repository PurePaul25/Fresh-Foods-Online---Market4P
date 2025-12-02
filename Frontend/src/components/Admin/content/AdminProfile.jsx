import React, { useState, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  XCircle,
  Camera,
} from "lucide-react";
import adminAvatar from "../../../assets/images/admin-avatar.jpg";

// Dữ liệu giả, sau này sẽ được thay thế bằng API
const initialAdminData = {
  name: "Admin",
  email: "admin@market4p.com",
  phone: "0123 456 789",
  address: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
  avatar: adminAvatar,
};

function AdminProfile() {
  const [adminData, setAdminData] = useState(initialAdminData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(adminData);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        // Nếu bạn muốn lưu file để upload, bạn có thể lưu `file` vào state
        // setFormData({ ...formData, avatarFile: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(adminData); // Reset form về dữ liệu hiện tại khi bắt đầu sửa
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarPreview(null); // Hủy ảnh preview
    fileInputRef.current.value = null; // Reset input file
  };

  const handleSave = () => {
    // Logic lưu dữ liệu (gọi API,...)
    // Ở đây chúng ta chỉ cập nhật state
    const updatedData = { ...adminData, ...formData };
    if (avatarPreview) {
      updatedData.avatar = avatarPreview;
    }
    setAdminData(updatedData);
    console.log("Đã lưu dữ liệu:", updatedData);

    // Kết thúc chỉnh sửa
    setIsEditing(false);
    setAvatarPreview(null);
    fileInputRef.current.value = null;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Hồ sơ của tôi
        </h2>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
          >
            <Edit size={16} />
            Chỉnh sửa
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột Avatar */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="relative group">
            <img
              src={avatarPreview || adminData.avatar}
              alt="Admin Avatar"
              className="w-40 h-40 rounded-full object-cover border-4 border-amber-500 shadow-md"
            />
            {isEditing && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 w-full h-full bg-black bg-opacity-50 cursor-pointer rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-70 transition-opacity"
              >
                <Camera size={32} />
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            className="hidden"
            accept="image/*"
          />
          {isEditing && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
              Nhấn vào ảnh để thay đổi
            </p>
          )}
        </div>

        {/* Cột thông tin */}
        <div className="md:col-span-2 space-y-6">
          {isEditing ? (
            <>
              <InfoInput
                label="Họ và tên"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                icon={<User />}
              />
              <InfoInput
                label="Email"
                name="email"
                value={formData.email}
                icon={<Mail />}
                disabled
              />
              <InfoInput
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                icon={<Phone />}
              />
              <InfoInput
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                icon={<MapPin />}
              />
            </>
          ) : (
            <>
              <InfoRow
                label="Họ và tên"
                value={adminData.name}
                icon={<User />}
              />
              <InfoRow label="Email" value={adminData.email} icon={<Mail />} />
              <InfoRow
                label="Số điện thoại"
                value={adminData.phone}
                icon={<Phone />}
              />
              <InfoRow
                label="Địa chỉ"
                value={adminData.address}
                icon={<MapPin />}
              />
            </>
          )}

          {isEditing && (
            <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
              <button
                onClick={handleCancel}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                <XCircle size={16} /> Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Save size={16} /> Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component phụ để hiển thị thông tin (chế độ xem)
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <span className="text-amber-500 mt-1">{icon}</span>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-base text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  </div>
);

// Component phụ cho các trường input (chế độ sửa)
const InfoInput = ({
  icon,
  label,
  name,
  value,
  onChange,
  disabled = false,
}) => (
  <div className="flex items-center gap-4">
    <span className="text-amber-500">{icon}</span>
    <div className="flex-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
      >
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-amber-500 disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
      />
    </div>
  </div>
);

export default AdminProfile;

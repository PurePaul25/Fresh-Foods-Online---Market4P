"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  KeyRound,
  Trash2,
  Camera,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import userAvatar from "../../assets/images/userAvatar.png";

// Giả lập API call
const fakeApi = {
  getUser: async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return {
      success: true,
      data: {
        // Giữ lại displayName để tương thích, nhưng ưu tiên firstName, lastName
        displayName: storedUser?.displayName || "OMG Phát",
        username: storedUser?.username || "phát xịt khói",
        firstName: storedUser?.firstName || "Phát",
        lastName: storedUser?.lastName || "OMG",
        email: storedUser?.email || "abc@gmail.com",
        phone: "0987654321",
        address: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
        avatar: userAvatar,
      },
    };
  },
  updateUser: async (userData) => {
    console.log("Updating user with data:", userData);
    // Giả lập độ trễ mạng
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Cập nhật lại localStorage để Navbar có thể lấy thông tin mới
    const currentUser = JSON.parse(localStorage.getItem("user")) || {};
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    // Luôn trả về thành công
    return { success: true, message: "Cập nhật thông tin thành công!" };
  },
};

const Account = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fakeApi.getUser();
        if (response.success) {
          setUser(response.data);
          setFormData(response.data);
        }
      } catch (error) {
        toast.error("Không thể tải thông tin người dùng.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const toastId = toast.loading("Đang cập nhật...");
    try {
      // Cập nhật lại displayName từ firstName và lastName
      const updatedFormData = {
        ...formData,
        displayName: `${formData.lastName} ${formData.firstName}`,
      };
      setFormData(updatedFormData);

      const response = await fakeApi.updateUser(updatedFormData);
      if (response.success) {
        setUser(updatedFormData);
        setEditMode(false);
        toast.success(response.message, { id: toastId });
      } else {
        toast.error("Cập nhật thất bại.", { id: toastId });
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi.", { id: toastId });
      console.error(error);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
  };

  const handleFutureFeature = () => {
    // react-hot-toast không có phương thức `info`. Sử dụng toast() mặc định.
    // Để có toast.info(), cần tùy chỉnh thêm trong Toaster component.
    toast("Tính năng này sẽ được triển khai trong tương lai.", {
      icon: <Info className="text-blue-500" />,
    });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="pt-28 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const InfoRow = ({
    icon,
    label,
    value,
    name,
    editMode,
    disabled = false,
  }) => {
    const Icon = icon;
    return (
      <div className="flex items-center gap-4 py-4 border-b border-gray-100">
        <Icon className="w-5 h-5 text-amber-600" />
        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>
          {editMode ? (
            <input
              type="text"
              name={name}
              value={value}
              onChange={handleInputChange}
              className={`w-full text-gray-800 font-medium bg-transparent border-b-2 border-amber-200 focus:outline-none focus:border-amber-500 transition-colors ${
                disabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              disabled={disabled}
            />
          ) : (
            <p className="text-gray-800 font-medium">{value}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="pt-28 min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <img
                  src={formData?.avatar || userAvatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-amber-200 shadow-md"
                />
                {editMode && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera size={24} />
                    <input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-800">
                  {user?.lastName} {user?.firstName}
                </h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  <Edit size={16} />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center cursor-pointer gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    <Save size={16} />
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center cursor-pointer gap-2 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-medium"
                  >
                    <X size={16} />
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Thông tin cá nhân
            </h2>
            <div className="space-y-2">
              <InfoRow
                icon={User}
                label="Tên đăng nhập"
                name="username"
                value={formData.username}
                editMode={editMode}
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
                  <InfoRow
                    icon={User}
                    label="Họ"
                    name="lastName"
                    value={formData.lastName}
                    editMode={editMode}
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <InfoRow
                    icon={User}
                    label="Tên"
                    name="firstName"
                    value={formData.firstName}
                    editMode={editMode}
                  />
                </div>
              </div>
              <InfoRow
                icon={Mail}
                label="Email"
                name="email"
                value={formData.email}
                editMode={editMode}
              />
              <InfoRow
                icon={Phone}
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                editMode={editMode}
              />
              <InfoRow
                icon={MapPin}
                label="Địa chỉ"
                name="address"
                value={formData.address}
                editMode={editMode}
              />
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Bảo mật</h2>
            <div className="space-y-4 space-x-2">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-800">Đổi mật khẩu</h3>
                  <p className="text-sm text-gray-500">
                    Nên sử dụng mật khẩu mạnh mà bạn chưa dùng ở đâu khác.
                  </p>
                </div>
                <button
                  onClick={handleFutureFeature}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200 font-medium text-sm"
                >
                  <KeyRound size={16} />
                  Đổi
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-red-800">Xóa tài khoản</h3>
                  <p className="text-sm text-red-600">
                    Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị xóa
                    vĩnh viễn.
                  </p>
                </div>
                <button
                  onClick={handleFutureFeature}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium text-sm"
                >
                  <Trash2 size={16} />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;

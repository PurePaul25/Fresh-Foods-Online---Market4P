import React, { useState } from "react";
import toast from "react-hot-toast";
import ChangePasswordModal from "./ChangePasswordModal";
import { Bell, Shield, Save, KeyRound, Store, ServerCog } from "lucide-react";

// Component phụ cho từng khu vực cài đặt
const SettingsSection = ({ title, icon, children }) => (
  <div className="bg-white shadow-md rounded-lg">
    <div className="p-4 border-b border-gray-200 flex items-center gap-3">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-6 space-y-6">{children}</div>
  </div>
);

// Component phụ cho nút bật/tắt
const ToggleSwitch = ({ label, description, enabled, setEnabled }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium text-gray-700">{label}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex items-center cursor-pointer h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
        enabled ? "bg-amber-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

// Component phụ cho trường nhập liệu
const SettingInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  description,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 w-full px-3 py-2 transition duration-200 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
    />
    {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
  </div>
);

function AdminSettings() {
  // State cho cài đặt thông báo
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // State cho modal đổi mật khẩu
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  // State cho các cài đặt mới
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    storeName: "Market4P",
    slogan: "Thực phẩm tươi ngon mỗi ngày",
    contactEmail: "abc@market4p.com",
  });

  const handleSave = () => {
    const promise = new Promise((resolve) => {
      // Giả lập việc gọi API để lưu
      setTimeout(() => {
        console.log("Đã lưu cài đặt:", {
          emailNotifications,
          pushNotifications,
          maintenanceMode,
          storeInfo,
        });
        resolve();
      }, 1000); // Giả lập độ trễ 1 giây
    });

    toast.promise(promise, {
      loading: "Đang lưu cài đặt...",
      success: <b>Cài đặt đã được lưu thành công!</b>,
      error: <b>Không thể lưu cài đặt.</b>,
    });
  };

  const handleStoreInfoChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Cài đặt</h2>
        <button
          onClick={handleSave}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <Save size={16} />
          Lưu thay đổi
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Cài đặt thông báo */}
        <SettingsSection
          title="Thông báo"
          icon={<Bell className="text-amber-500" />}
        >
          <ToggleSwitch
            label="Thông báo qua Email"
            description="Nhận email về đơn hàng mới, khách hàng mới,..."
            enabled={emailNotifications}
            setEnabled={setEmailNotifications}
          />
          <ToggleSwitch
            label="Thông báo đẩy"
            description="Nhận thông báo đẩy trên trình duyệt (sắp có)"
            enabled={pushNotifications}
            setEnabled={setPushNotifications}
          />
        </SettingsSection>

        {/* Cài đặt bảo mật */}
        <SettingsSection
          title="Bảo mật"
          icon={<Shield className="text-amber-500" />}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Đổi mật khẩu</p>
              <p className="text-sm text-gray-500">
                Nên thay đổi mật khẩu định kỳ để tăng cường bảo mật.
              </p>
            </div>
            <button
              onClick={() => setPasswordModalOpen(true)}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <KeyRound size={16} />
              Thay đổi
            </button>
          </div>
        </SettingsSection>

        {/* Cài đặt Thông tin cửa hàng */}
        <SettingsSection
          title="Thông tin cửa hàng"
          icon={<Store className="text-amber-500" />}
        >
          <SettingInput
            label="Tên cửa hàng"
            name="storeName"
            value={storeInfo.storeName}
            onChange={handleStoreInfoChange}
            placeholder="Ví dụ: Market4P"
          />
          <SettingInput
            label="Slogan"
            name="slogan"
            value={storeInfo.slogan}
            onChange={handleStoreInfoChange}
            placeholder="Ví dụ: Thực phẩm tươi ngon mỗi ngày"
          />
          <SettingInput
            label="Email liên hệ công khai"
            name="contactEmail"
            value={storeInfo.contactEmail}
            onChange={handleStoreInfoChange}
            placeholder="Ví dụ: contact@market4p.com"
          />
        </SettingsSection>

        {/* Chế độ bảo trì */}
        <SettingsSection
          title="Hệ thống"
          icon={<ServerCog className="text-amber-500" />}
        >
          <ToggleSwitch
            label="Chế độ bảo trì"
            description="Khi bật, khách hàng sẽ thấy trang thông báo bảo trì."
            enabled={maintenanceMode}
            setEnabled={setMaintenanceMode}
          />
        </SettingsSection>
      </div>
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </>
  );
}

export default AdminSettings;

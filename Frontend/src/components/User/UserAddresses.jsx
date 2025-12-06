import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const UserAddresses = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="pt-12 px-8 sm:pt-28 min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center bg-white rounded-2xl shadow-lg border border-amber-100 p-12">
          <MapPin className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Tính năng đang được phát triển
          </h1>
          <p className="text-gray-600 mb-8">
            Trang "Quản lý địa chỉ" sẽ sớm được ra mắt. Bạn sẽ có thể thêm, sửa,
            và xóa địa chỉ giao hàng tại đây.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 cursor-pointer bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all duration-200 font-medium shadow-md"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserAddresses;

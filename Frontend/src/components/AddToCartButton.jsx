import { ShoppingCart } from "lucide-react";
import { addToCart } from "../services/cartApi";
import toast from "react-hot-toast";

export default function AddToCartButton({ product, className = "" }) {
  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent parent click events

    try {
      // Lấy userId từ localStorage hoặc tạo mới nếu chưa có
      let userId = localStorage.getItem("guestUserId");
      if (!userId) {
        userId = `guest_${Date.now()}`;
        localStorage.setItem("guestUserId", userId);
      }

      // Chuẩn bị dữ liệu sản phẩm
      const productData = {
        _id: product._id || `prod_${Date.now()}`,
        name: product.name,
        price: parseFloat(product.price.replace(/[.,]/g, "")),
        image: product.image,
      };

      const res = await addToCart(productData, userId);
      toast.success(res.message || "Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center justify-center gap-2 bg-amber-600 text-white py-2 px-4 rounded-full hover:bg-amber-700 transition-all ${className}`}
    >
      <ShoppingCart className="w-4 h-4" />
      <span className="text-sm">Thêm vào giỏ</span>
    </button>
  );
}

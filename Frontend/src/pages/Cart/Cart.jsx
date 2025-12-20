"use client";

import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BongCaiXanh from "../../assets/images/bongcaixanh.png";
import NhoDenKhongHat from "../../assets/images/nhodenkohat.jpg";
import CamTienGiang from "../../assets/images/camtiengiang.jpg";
import CaHoiNaUy from "../../assets/images/cahoinauy.png";
import toast from "react-hot-toast";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Truck,
  Shield,
  Gift,
  ChevronRight,
  User,
} from "lucide-react";
import { useCart } from "../../context/CartContext";

function useScrollAnimation(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
}

// Helper function to get product image
const getProductImage = (product) => {
  if (!product) return "/placeholder.svg";
  if (product.image) return product.image;
  if (product.images && product.images.length > 0) {
    const firstImage = product.images[0];
    if (typeof firstImage === "string") return firstImage;
    if (firstImage?.url) return firstImage.url;
    if (firstImage?.image) return firstImage.image;
  }
  return "/placeholder.svg";
};

function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [isLoggedIn] = useState(() => {
    return !!localStorage.getItem("user");
  });

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để xem giỏ hàng!", {
        id: "cart-login-required",
      });
    }
  }, [isLoggedIn]);

  const [headerRef, headerVisible] = useScrollAnimation();
  const [cartRef, cartVisible] = useScrollAnimation();
  const [suggestRef, suggestVisible] = useScrollAnimation();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());

  const suggestedProducts = [
    {
      id: 5,
      name: "Nho Đen Không Hạt Úc",
      price: 159000,
      unit: "kg",
      image: NhoDenKhongHat,
    },
    {
      id: 6,
      name: "Bông Cải Xanh",
      price: 25000,
      unit: "kg",
      image: BongCaiXanh,
    },
    {
      id: 7,
      name: "Cam Sành Tiền Giang",
      price: 45000,
      unit: "kg",
      image: CamTienGiang,
    },
    {
      id: 8,
      name: "Cá Hồi Nauy Fillet",
      price: 389000,
      unit: "kg",
      image: CaHoiNaUy,
    },
  ];

  const removeItem = (id) => {
    setRemovingId(id);
    // Cũng xóa khỏi selectedItems nếu có
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 300);
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "FRESH20") {
      setAppliedCoupon({ code: "FRESH20", discount: 20 });
    } else if (couponCode.toUpperCase() === "SAVE10") {
      setAppliedCoupon({ code: "SAVE10", discount: 10 });
    }
  };

  const calculateItemPrice = (item) => {
    const discountedPrice =
      item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
    return discountedPrice * item.quantity;
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + calculateItemPrice(item),
    0
  );
  const shippingFee = subtotal > 500000 ? 0 : 25000;
  const couponDiscount = appliedCoupon
    ? (subtotal * appliedCoupon.discount) / 100
    : 0;
  const total = subtotal + shippingFee - couponDiscount;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(Math.round(price));
  };

  const handleIncreaseQuantity = (item) => {
    const itemId = item._id || item.id;
    updateQuantity(itemId, item.quantity + 1);
  };

  const handleDecreaseQuantity = (item) => {
    const itemId = item._id || item.id;
    if (item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    }
  };

  // Lấy id của item (hỗ trợ cả _id và id)
  const getItemId = (item) => item._id || item.id;

  // Xử lý chọn tất cả
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = new Set(cartItems.map((item) => getItemId(item)));
      setSelectedItems(allIds);
    } else {
      setSelectedItems(new Set());
    }
  };

  // Xử lý chọn/bỏ chọn một item
  const handleToggleItem = (itemId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Xóa các item đã chọn
  const handleDeleteSelected = () => {
    selectedItems.forEach((itemId) => {
      setRemovingId(itemId);
      setTimeout(() => {
        removeFromCart(itemId);
        setRemovingId(null);
      }, 300);
    });
    setSelectedItems(new Set());
  };

  // Kiểm tra tất cả đã được chọn
  const isAllSelected =
    cartItems.length > 0 && selectedItems.size === cartItems.length;

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header>
          <Navbar />
        </header>
        <div className="min-h-[80vh] flex items-center justify-center bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md mx-4 mt-10">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">
              Vui lòng đăng nhập
            </h2>
            <p className="text-stone-500 mb-6">
              Bạn cần đăng nhập để xem giỏ hàng.
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header>
        <Navbar />
      </header>

      <div className="py-16">
        {/* Header Section */}
        <section ref={headerRef} className="px-6 md:px-16 lg:px-30 py-8">
          <div
            className={`flex items-center gap-4 transition-all duration-700 ${
              headerVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <NavLink
              to="/shop"
              className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-all duration-300 group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span>Tiếp tục mua sắm</span>
            </NavLink>
          </div>

          <div
            className={`mt-6 flex items-center gap-4 transition-all duration-700 delay-100 ${
              headerVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="p-3 bg-amber-100 rounded-full">
              <ShoppingBag size={32} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Giỏ hàng của bạn
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                {cartItems.length} sản phẩm trong giỏ hàng
              </p>
            </div>
          </div>
        </section>

        {/* Main Cart Section */}
        <section ref={cartRef} className="px-6 md:px-16 lg:px-30">
          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div
              className={`text-center py-20 transition-all duration-700 ${
                cartVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={64} className="text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Giỏ hàng trống
              </h2>
              <p className="text-gray-500 mb-8">
                Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
              </p>
              <NavLink
                to="/shop"
                className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-amber-200"
              >
                <ShoppingBag size={20} />
                Mua sắm ngay
              </NavLink>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Select All Header */}
                <div
                  className={`bg-white rounded-2xl shadow-md p-4 flex items-center justify-between transition-all duration-500 ${
                    cartVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 transition-all duration-200"
                    />
                    <span className="text-gray-700 font-medium group-hover:text-amber-600 transition-colors duration-200">
                      Chọn tất cả ({cartItems.length} sản phẩm)
                    </span>
                  </label>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedItems.size === 0}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                      selectedItems.size === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-500 hover:text-red-600 hover:bg-red-50"
                    }`}
                  >
                    Xóa đã chọn{" "}
                    {selectedItems.size > 0 && `(${selectedItems.size})`}
                  </button>
                </div>

                {/* Cart Item Cards */}
                {cartItems.map((item, index) => {
                  const itemId = getItemId(item);
                  const isSelected = selectedItems.has(itemId);
                  return (
                    <div
                      key={itemId}
                      className={`bg-white rounded-2xl shadow-md p-4 md:p-6 transition-all duration-500 hover:shadow-xl ${
                        removingId === itemId
                          ? "opacity-0 translate-x-full scale-95"
                          : "opacity-100 translate-x-0 scale-100"
                      } ${
                        cartVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                      style={{ transitionDelay: `${index * 100 + 100}ms` }}
                    >
                      <div className="flex gap-4 md:gap-6">
                        {/* Checkbox */}
                        <div className="flex items-start pt-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleItem(itemId)}
                            className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                          />
                        </div>

                        {/* Product Image */}
                        <div className="relative shrink-0">
                          <div className="w-24 h-24 md:w-32 md:h-32 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden group">
                            <img
                              src={getProductImage(item)}
                              alt={item.name}
                              className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          {item.discount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                              -{item.discount}%
                            </span>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 hover:text-amber-600 transition-colors duration-200 cursor-pointer line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1">
                            Đơn vị: {item.unit}
                          </p>

                          {/* Price - Hiển thị giá gốc và giá giảm đúng */}
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            {item.discount > 0 ? (
                              <>
                                <span className="text-lg font-bold text-amber-600">
                                  {formatPrice(
                                    item.price * (1 - item.discount / 100)
                                  )}
                                  đ
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                  {formatPrice(item.price)}đ
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-amber-600">
                                {formatPrice(item.price)}đ
                              </span>
                            )}
                          </div>

                          {/* Quantity & Actions */}
                          <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
                            {/* Quantity Control - Sửa onClick để gọi đúng hàm */}
                            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                              <button
                                onClick={() => handleDecreaseQuantity(item)}
                                className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full hover:bg-amber-500 hover:text-white transition-all duration-200 disabled:opacity-50"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-12 text-center font-semibold text-gray-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleIncreaseQuantity(item)}
                                className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full hover:bg-amber-500 hover:text-white transition-all duration-200"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            {/* Subtotal & Delete */}
                            <div className="flex items-center gap-4">
                              <span className="text-xl font-bold text-gray-800">
                                {formatPrice(calculateItemPrice(item))}đ
                              </span>
                              <button
                                onClick={() => removeItem(itemId)}
                                className="p-2 text-gray-400 cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:rotate-12"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div
                  className={`bg-white rounded-2xl shadow-md p-6 sticky top-28 transition-all duration-700 delay-300 ${
                    cartVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Gift size={24} className="text-amber-600" />
                    Tóm tắt đơn hàng
                  </h2>

                  {/* Coupon Input */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Mã giảm giá
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Nhập mã..."
                        className="flex-1 px-4 py-2 border focus:outline-none border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm"
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all duration-200 hover:scale-105 text-sm"
                      >
                        Áp dụng
                      </button>
                    </div>
                    {appliedCoupon && (
                      <p className="text-green-600 text-sm mt-2 flex items-center gap-1 animate-in fade-in slide-in-from-top-2">
                        <span>✓</span> Đã áp dụng mã {appliedCoupon.code} (-
                        {appliedCoupon.discount}%)
                      </p>
                    )}
                    <p className="text-gray-400 text-xs mt-2">
                      Thử: FRESH20 hoặc SAVE10
                    </p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính</span>
                      <span>{formatPrice(subtotal)}đ</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển</span>
                      <span
                        className={
                          shippingFee === 0 ? "text-green-600 font-medium" : ""
                        }
                      >
                        {shippingFee === 0
                          ? "Miễn phí"
                          : `${formatPrice(shippingFee)}đ`}
                      </span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá ({appliedCoupon.code})</span>
                        <span>-{formatPrice(couponDiscount)}đ</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-gray-100 pt-3">
                      <span>Tổng cộng</span>
                      <span className="text-amber-600 text-2xl">
                        {formatPrice(total)}đ
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <NavLink
                    to="/checkout"
                    className="mt-6 w-full bg-amber-600 text-white py-4 rounded-xl font-semibold hover:bg-amber-700 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-amber-200 flex items-center justify-center gap-2"
                  >
                    Tiến hành thanh toán
                    <ChevronRight size={20} />
                  </NavLink>

                  {/* Trust badges */}
                  <div className="mt-6 flex items-center justify-center gap-4 text-gray-400 text-xs">
                    <div className="flex items-center gap-1">
                      <Shield size={14} />
                      <span>Bảo mật</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck size={14} />
                      <span>Giao nhanh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Suggested Products */}
        {cartItems.length > 0 && (
          <section
            ref={suggestRef}
            className="px-6 md:px-16 lg:px-30 py-12 mt-8"
          >
            <h2
              className={`text-2xl font-bold text-gray-800 mb-6 transition-all duration-700 ${
                suggestVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Có thể bạn cũng thích
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {suggestedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-xl shadow-md p-4 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer ${
                    suggestVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-32 object-contain rounded-lg"
                  />
                  <h3 className="mt-3 font-medium text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-amber-600 font-bold mt-1">
                    {formatPrice(product.price)}đ/{product.unit}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default Cart;

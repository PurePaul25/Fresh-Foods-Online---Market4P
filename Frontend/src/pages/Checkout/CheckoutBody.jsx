"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import {
  Truck,
  CreditCard,
  Building2,
  Wallet,
  ShieldCheck,
  Snowflake,
  Clock,
  RotateCcw,
  MapPin,
  Phone,
  Mail,
  User,
  ChevronRight,
  Check,
  Minus,
  Plus,
  Trash2,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import apiService from "../../services/api.js";

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

function useScrollAnimation(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

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

const shippingOptions = [
  { id: "express", name: "Giao siêu tốc 2h", price: 30000, icon: Clock },
  { id: "standard", name: "Giao tiêu chuẩn", price: 15000, icon: Truck },
  { id: "scheduled", name: "Hẹn giờ giao", price: 20000, icon: MapPin },
];

const paymentMethods = [
  { id: "card", name: "Thẻ tín dụng/ghi nợ", icon: CreditCard },
  { id: "bank", name: "Chuyển khoản ngân hàng", icon: Building2 },
  { id: "wallet", name: "Ví điện tử", icon: Wallet },
  { id: "cod", name: "Thanh toán khi nhận hàng", icon: Truck },
];

export default function CheckoutBody() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  // eslint-disable-next-line no-unused-vars
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("express");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const [stepsRef, stepsVisible] = useScrollAnimation();
  const [shippingRef, shippingVisible] = useScrollAnimation();
  const [paymentRef, paymentVisible] = useScrollAnimation();
  const [summaryRef, summaryVisible] = useScrollAnimation();

  const calculateItemPrice = (item) => {
    const discountedPrice =
      item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
    return discountedPrice * item.quantity;
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + calculateItemPrice(item),
    0
  );
  const shippingFee =
    shippingOptions.find((s) => s.id === shippingMethod)?.price || 0;
  const discountValue = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const total = subtotal + shippingFee - discountValue;

  const validCoupons = {
    FRESH10: { discount: 0.1, message: "Giảm giá 10% cho đơn hàng" },
    FRESH20: { discount: 0.2, message: "Giảm giá 20% cho đơn hàng" },
    MARKET4P: { discount: 0.15, message: "Giảm giá 15% cho đơn hàng" },
    SAVE10: { discount: 0.1, message: "Giảm giá 10% cho đơn hàng" },
  };

  // Format tiền VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(Math.round(price)) + "đ";
  };

  const handleUpdateQuantity = (id, delta) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity >= 1) {
        updateQuantity(id, newQuantity);
      }
    }
  };

  const handleRemoveProduct = (id) => {
    removeFromCart(id);
  };

  // Xử lý mã giảm giá
  const applyCoupon = () => {
    const code = couponCode.toUpperCase();
    if (validCoupons[code]) {
      setAppliedCoupon({ code: code, discount: validCoupons[code].discount });
      toast.success(`Áp dụng mã ${code} thành công!`);
    } else {
      setAppliedCoupon(null);
      toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      setCouponCode("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    try {
      // Kiểm tra xem người dùng có bị cấm hay không
      const currentUser = apiService.getStoredUser();
      if (currentUser) {
        // Lấy thông tin user hiện tại từ API
        const userInfo = await apiService.getCurrentUser();

        if (userInfo.data && userInfo.data.isBanned) {
          toast.error(
            `Tài khoản của bạn đã bị chặn. Lý do: ${
              userInfo.data.bannedReason || "Không có lý do cụ thể"
            }. Bạn không thể tiếp tục mua hàng.`
          );
          return;
        }
      }

      // Nếu không bị cấm, tiếp tục xử lý đơn hàng
      const newOrderId = "DH" + Date.now().toString().slice(-8);

      // Ghi log thông tin đặt hàng
      console.log("Order Info:", {
        orderId: newOrderId,
        shippingMethod,
        paymentMethod,
        formData,
        total,
      });
      toast.success(`Đặt hàng thành công! Mã đơn hàng: ${newOrderId}`);
    } catch (error) {
      console.error("Error during checkout:", error);
      if (error.message && error.message.includes("banned")) {
        toast.error("Tài khoản của bạn đã bị chặn. Không thể đặt hàng.");
      } else {
        toast.error("Lỗi khi xử lý đơn hàng: " + error.message);
      }
    }
  };

  const steps = [
    { number: 1, title: "Giao hàng" },
    { number: 2, title: "Thanh toán" },
    { number: 3, title: "Xác nhận" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 pb-10 pt-28">
        <div
          ref={stepsRef}
          className={`flex items-center justify-center mb-8 transition-all duration-700 ${
            stepsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-8"
          }`}
        >
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 hover:scale-110 ${
                    currentStep >= step.number
                      ? "bg-amber-600 text-white"
                      : "bg-stone-200 text-stone-500"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`font-medium hidden sm:block ${
                    currentStep >= step.number
                      ? "text-amber-600"
                      : "text-stone-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 text-stone-300 mx-4" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            <div
              ref={shippingRef}
              className={`bg-white rounded-2xl shadow-sm border border-stone-100 p-6 transition-all duration-700 ease-out hover:shadow-lg ${
                shippingVisible
                  ? "opacity-100 translate-y-0 lg:translate-x-0"
                  : "opacity-0 translate-y-12 lg:translate-y-0 lg:-translate-x-12"
              }`}
            >
              <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600 animate-bounce" />
                Thông tin giao hàng
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="group">
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 transition-colors group-focus-within:text-amber-600" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:border-amber-300"
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 transition-colors group-focus-within:text-amber-600" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0901 234 567"
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:border-amber-300"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6 group">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 transition-colors group-focus-within:text-amber-600" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-none hover:border-amber-300"
                  />
                </div>
              </div>

              <div className="mb-6 group">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Địa chỉ giao hàng
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-stone-400 transition-colors group-focus-within:text-amber-600" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-none hover:border-amber-300"
                  />
                </div>
              </div>

              {/* Shipping Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-3">
                  Phương thức vận chuyển
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {shippingOptions.map((option, index) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.id}
                        className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md ${
                          shippingMethod === option.id
                            ? "border-amber-600 bg-amber-50"
                            : "border-stone-200 hover:border-amber-300"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={shippingMethod === option.id}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="sr-only"
                        />
                        <Icon
                          className={`w-6 h-6 mb-2 transition-transform duration-300 ${
                            shippingMethod === option.id
                              ? "text-amber-600 scale-110"
                              : "text-stone-400"
                          }`}
                        />
                        <span className="text-sm font-medium text-stone-800 text-center">
                          {option.name}
                        </span>
                        <span className="text-sm text-amber-600 font-semibold mt-1">
                          {formatPrice(option.price)}
                        </span>
                        {shippingMethod === option.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center animate-pulse">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Note */}
              <div className="group">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Ghi chú giao hàng
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="VD: Giao buổi sáng, để trước cửa, gọi điện trước 15 phút..."
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-none hover:border-amber-300"
                />
              </div>
            </div>

            <div
              ref={paymentRef}
              className={`bg-white rounded-2xl shadow-sm border border-stone-100 p-6 transition-all duration-700 ease-out delay-200 hover:shadow-lg ${
                paymentVisible
                  ? "opacity-100 translate-y-0 lg:translate-x-0"
                  : "opacity-0 translate-y-12 lg:translate-y-0 lg:-translate-x-12"
              }`}
            >
              <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                Phương thức thanh toán
              </h2>

              <div className="grid sm:grid-cols-2 gap-3">
                {paymentMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                        paymentMethod === method.id
                          ? "border-amber-600 bg-amber-50"
                          : "border-stone-200 hover:border-amber-300"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <Icon
                        className={`w-6 h-6 transition-all duration-300 ${
                          paymentMethod === method.id
                            ? "text-amber-600 scale-110"
                            : "text-stone-400"
                        }`}
                      />
                      <span className="text-sm font-medium text-stone-800">
                        {method.name}
                      </span>
                      {paymentMethod === method.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center animate-pulse">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div
              ref={summaryRef}
              className={`bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sticky top-28 transition-all duration-700 ease-out delay-300 hover:shadow-lg ${
                summaryVisible
                  ? "opacity-100 translate-y-0 lg:translate-x-0"
                  : "opacity-0 translate-y-12 lg:translate-y-0 lg:translate-x-12"
              }`}
            >
              <h2 className="text-xl font-bold text-stone-800 mb-6">
                Đơn hàng của bạn
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-stone-50 rounded-xl"
                  >
                    <img
                      src={getProductImage(item)}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-stone-800 text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="text-amber-600 font-semibold text-sm">
                        {item.discount > 0
                          ? formatPrice(item.price * (1 - item.discount / 100))
                          : formatPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveProduct(item.id)}
                          className="ml-auto text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Mã giảm giá"
                      className="w-full pl-9 pr-4 duration-200 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 cursor-pointer duration-200 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-green-600 text-xs mt-2">
                    ✓ Đã áp dụng mã {appliedCoupon.code}
                  </p>
                )}
              </div>

              {/* Price Summary */}
              <div className="space-y-3 border-t border-stone-100 pt-4">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(shippingFee)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discountValue)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-stone-800 border-t border-stone-100 pt-3">
                  <span>Tổng cộng</span>
                  <span className="text-amber-600">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full mt-6 py-4 cursor-pointer bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Đặt hàng
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Thanh toán an toàn</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Snowflake className="w-4 h-4 text-blue-500" />
                  <span>Bảo quản lạnh</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Giao hàng nhanh</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <RotateCcw className="w-4 h-4 text-purple-500" />
                  <span>Đổi trả dễ dàng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

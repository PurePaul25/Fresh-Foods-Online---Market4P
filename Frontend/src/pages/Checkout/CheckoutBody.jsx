"use client"

import { useState, useEffect, useRef } from "react"
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
} from "lucide-react"

function useScrollAnimation(threshold = 0.1) {
    const ref = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold },
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [threshold])

    return [ref, isVisible]
}

// Dữ liệu sản phẩm mẫu
const initialProducts = [
    {
        id: 1,
        name: "Xoài cát Hòa Lộc",
        price: 85000,
        quantity: 2,
        unit: "kg",
        image: "/fresh-ripe-mango-fruit.jpg",
    },
    {
        id: 2,
        name: "Bánh mì nguyên cám",
        price: 35000,
        quantity: 3,
        unit: "ổ",
        image: "/whole-grain-bread-loaf.jpg",
    },
    {
        id: 3,
        name: "Rau cải hữu cơ",
        price: 28000,
        quantity: 2,
        unit: "bó",
        image: "/fresh-organic-bok-choy-vegetables.jpg",
    },
    {
        id: 4,
        name: "Cà chua Đà Lạt",
        price: 32000,
        quantity: 1,
        unit: "kg",
        image: "/fresh-red-tomatoes.jpg",
    },
]

const shippingOptions = [
    { id: "express", name: "Giao siêu tốc 2h", price: 30000, icon: Clock },
    { id: "standard", name: "Giao tiêu chuẩn", price: 15000, icon: Truck },
    { id: "scheduled", name: "Hẹn giờ giao", price: 20000, icon: MapPin },
]

const paymentMethods = [
    { id: "card", name: "Thẻ tín dụng/ghi nợ", icon: CreditCard },
    { id: "bank", name: "Chuyển khoản ngân hàng", icon: Building2 },
    { id: "wallet", name: "Ví điện tử", icon: Wallet },
    { id: "cod", name: "Thanh toán khi nhận hàng", icon: Truck },
]

export default function CheckoutBody() {
    const [currentStep, setCurrentStep] = useState(1)
    const [products, setProducts] = useState(initialProducts)
    const [shippingMethod, setShippingMethod] = useState("express")
    const [paymentMethod, setPaymentMethod] = useState("card")
    const [couponCode, setCouponCode] = useState("")
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        note: "",
    })

    const [stepsRef, stepsVisible] = useScrollAnimation()
    const [shippingRef, shippingVisible] = useScrollAnimation()
    const [paymentRef, paymentVisible] = useScrollAnimation()
    const [summaryRef, summaryVisible] = useScrollAnimation()

    // Tính toán giá
    const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingFee = shippingOptions.find((s) => s.id === shippingMethod)?.price || 0
    const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0
    const total = subtotal + shippingFee - discount

    // Format tiền VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price) + "đ"
    }

    // Xử lý số lượng sản phẩm
    const updateQuantity = (id, delta) => {
        setProducts((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = Math.max(1, item.quantity + delta)
                    return { ...item, quantity: newQty }
                }
                return item
            }),
        )
    }

    const removeProduct = (id) => {
        setProducts((prev) => prev.filter((item) => item.id !== id))
    }

    // Xử lý mã giảm giá
    const applyCoupon = () => {
        if (couponCode.toLowerCase() === "fresh10") {
            setAppliedCoupon("FRESH10")
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const steps = [
        { number: 1, title: "Giao hàng" },
        { number: 2, title: "Thanh toán" },
        { number: 3, title: "Xác nhận" },
    ]

    return (
        <section className="bg-amber-50/30 py-8 min-h-screen">
            <div className="max-w-6xl mx-auto px-4">
                <div
                    ref={stepsRef}
                    className={`flex items-center justify-center mb-8 transition-all duration-700 ${stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
                        }`}
                >
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 hover:scale-110 ${currentStep >= step.number ? "bg-amber-600 text-white" : "bg-stone-200 text-stone-500"
                                        }`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                                </div>
                                <span
                                    className={`font-medium hidden sm:block ${currentStep >= step.number ? "text-amber-600" : "text-stone-400"
                                        }`}
                                >
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && <ChevronRight className="w-5 h-5 text-stone-300 mx-4" />}
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        <div
                            ref={shippingRef}
                            className={`bg-white rounded-2xl shadow-sm border border-stone-100 p-6 transition-all duration-700 hover:shadow-lg ${shippingVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                                }`}
                        >
                            <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-amber-600 animate-bounce" />
                                Thông tin giao hàng
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                <div className="group">
                                    <label className="block text-sm font-medium text-stone-700 mb-2">Họ và tên</label>
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
                                    <label className="block text-sm font-medium text-stone-700 mb-2">Số điện thoại</label>
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
                                <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 transition-colors group-focus-within:text-amber-600" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="email@example.com"
                                        className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:border-amber-300"
                                    />
                                </div>
                            </div>

                            <div className="mb-6 group">
                                <label className="block text-sm font-medium text-stone-700 mb-2">Địa chỉ giao hàng</label>
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

                            {/* Shipping Options với animation */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-stone-700 mb-3">Phương thức vận chuyển</label>
                                <div className="grid sm:grid-cols-3 gap-3">
                                    {shippingOptions.map((option, index) => {
                                        const Icon = option.icon
                                        return (
                                            <label
                                                key={option.id}
                                                className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md ${shippingMethod === option.id
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
                                                    className={`w-6 h-6 mb-2 transition-transform duration-300 ${shippingMethod === option.id ? "text-amber-600 scale-110" : "text-stone-400"
                                                        }`}
                                                />
                                                <span className="text-sm font-medium text-stone-800 text-center">{option.name}</span>
                                                <span className="text-sm text-amber-600 font-semibold mt-1">{formatPrice(option.price)}</span>
                                                {shippingMethod === option.id && (
                                                    <div className="absolute top-2 right-2 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center animate-pulse">
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Delivery Note */}
                            <div className="group">
                                <label className="block text-sm font-medium text-stone-700 mb-2">Ghi chú giao hàng</label>
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
                            className={`bg-white rounded-2xl shadow-sm border border-stone-100 p-6 transition-all duration-700 delay-200 hover:shadow-lg ${paymentVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                                }`}
                        >
                            <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-amber-600" />
                                Phương thức thanh toán
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-3">
                                {paymentMethods.map((method, index) => {
                                    const Icon = method.icon
                                    return (
                                        <label
                                            key={method.id}
                                            className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${paymentMethod === method.id
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
                                                className={`w-6 h-6 transition-all duration-300 ${paymentMethod === method.id ? "text-amber-600 scale-110" : "text-stone-400"}`}
                                            />
                                            <span className="text-sm font-medium text-stone-800">{method.name}</span>
                                            {paymentMethod === method.id && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center animate-pulse">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </label>
                                    )
                                })}
                            </div>

                            {/* Card Details với animation */}
                            {paymentMethod === "card" && (
                                <div className="mt-6 pt-6 border-t border-stone-100 space-y-4 animate-fadeIn">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-stone-700 mb-2">Số thẻ</label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:border-amber-300"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="group">
                                            <label className="block text-sm font-medium text-stone-700 mb-2">Ngày hết hạn</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:border-amber-300"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-medium text-stone-700 mb-2">CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:border-amber-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div
                            ref={summaryRef}
                            className={`bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sticky top-4 transition-all duration-700 delay-300 hover:shadow-lg ${summaryVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                                }`}
                        >
                            <h2 className="text-xl font-bold text-stone-800 mb-6">Đơn hàng của bạn</h2>

                            {/* Product List với animation */}
                            <div className="space-y-4 mb-6">
                                {products.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="flex gap-3 transition-all duration-300 hover:bg-amber-50 p-2 rounded-lg -mx-2"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0 transition-transform duration-300 hover:scale-105">
                                            <img
                                                src={product.image || "/placeholder.svg"}
                                                alt={product.name}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-stone-800 truncate">{product.name}</h4>
                                            <p className="text-sm text-amber-600 font-semibold">
                                                {formatPrice(product.price)}/{product.unit}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <button
                                                    onClick={() => updateQuantity(product.id, -1)}
                                                    className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center hover:bg-amber-100 hover:border-amber-300 transition-all duration-200 active:scale-90"
                                                >
                                                    <Minus className="w-3 h-3 text-stone-600" />
                                                </button>
                                                <span className="text-sm font-medium text-stone-800 w-6 text-center">{product.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(product.id, 1)}
                                                    className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center hover:bg-amber-100 hover:border-amber-300 transition-all duration-200 active:scale-90"
                                                >
                                                    <Plus className="w-3 h-3 text-stone-600" />
                                                </button>
                                                <button
                                                    onClick={() => removeProduct(product.id)}
                                                    className="ml-auto text-stone-400 hover:text-red-500 transition-all duration-200 hover:scale-110"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Code */}
                            <div className="mb-6">
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 transition-colors group-focus-within:text-amber-600" />
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Mã giảm giá"
                                            className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:border-amber-300"
                                        />
                                    </div>
                                    <button
                                        onClick={applyCoupon}
                                        className="px-4 py-2.5 bg-amber-600 text-white text-sm font-medium rounded-xl hover:bg-amber-700 transition-all duration-300 hover:scale-105 active:scale-95"
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                                {appliedCoupon && (
                                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1 animate-fadeIn">
                                        <Check className="w-4 h-4" />
                                        Đã áp dụng mã {appliedCoupon} - Giảm 10%
                                    </p>
                                )}
                                <p className="text-xs text-stone-500 mt-2">Thử mã: FRESH10</p>
                            </div>

                            {/* Price Summary */}
                            <div className="space-y-3 py-4 border-t border-stone-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-600">Tạm tính</span>
                                    <span className="text-stone-800 font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-600">Phí vận chuyển</span>
                                    <span className="text-stone-800 font-medium">{formatPrice(shippingFee)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm animate-fadeIn">
                                        <span className="text-green-600">Giảm giá</span>
                                        <span className="text-green-600 font-medium">-{formatPrice(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-3 border-t border-stone-100">
                                    <span className="text-lg font-bold text-stone-800">Tổng cộng</span>
                                    <span className="text-xl font-bold text-amber-600">{formatPrice(total)}</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button className="w-full py-4 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]">
                                <ShieldCheck className="w-5 h-5" />
                                Đặt hàng ngay
                            </button>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-stone-100">
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: ShieldCheck, text: "100% Tươi sạch" },
                                        { icon: Snowflake, text: "Bảo quản lạnh" },
                                        { icon: Truck, text: "Giao siêu tốc" },
                                        { icon: RotateCcw, text: "Đổi trả 24h" },
                                    ].map((badge, index) => {
                                        const Icon = badge.icon
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 text-sm text-stone-600 transition-all duration-300 hover:text-amber-600 cursor-default"
                                            >
                                                <Icon className="w-4 h-4 text-amber-600" />
                                                <span>{badge.text}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </section>
    )
}

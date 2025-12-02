"use client";

import PromoCountdown from "../../components/PromoCountdown/PromoCountdown";

import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/Footer";
import Button from "../../components/Button/Button";
import Cate_Fruits from "../../assets/images/cate_fruits.avif";
import Cate_Eggs from "../../assets/images/cate_eggs.avif";
import Cate_Veget from "../../assets/images/cate_veget.avif";
import Cate_Meat from "../../assets/images/cate_meat.avif";
import Cate_Bread from "../../assets/images/cate_bread.avif";
import BongCaiXanh from "../../assets/images/bongcaixanh.png";
import Carrot from "../../assets/images/carrot.avif";
import BanhMiLuaMach from "../../assets/images/banhmiluamach.avif";
import SuonCotLet from "../../assets/images/suoncotlet.avif";
import BoWagyu from "../../assets/images/bowagyu.avif";
import BanhMiSandwich from "../../assets/images/banhmisandwich.png";
import strawberry from "../../assets/images/strawberry.jpg";

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

function Shop() {
  const [heroRef, heroVisible] = useScrollAnimation();
  const [categoryRef, categoryVisible] = useScrollAnimation();
  const [saleRef, saleVisible] = useScrollAnimation();
  const [bestSellingRef, bestSellingVisible] = useScrollAnimation();
  const [newArrivalsRef, newArrivalsVisible] = useScrollAnimation();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryProducts, setShowCategoryProducts] = useState(false);

  const categories = [
    { id: "fruits", name: "Trái cây", image: Cate_Fruits },
    { id: "eggs", name: "Trứng", image: Cate_Eggs },
    { id: "meat", name: "Thịt", image: Cate_Meat },
    { id: "vegetables", name: "Rau xanh", image: Cate_Veget },
    { id: "bread", name: "Bánh mì", image: Cate_Bread },
  ];

  const categoryProducts = {
    fruits: [
      {
        name: "Xoài cát Hòa Lộc",
        price: "65.000",
        unit: "kg",
        image: BongCaiXanh,
      },
      {
        name: "Nho xanh Ninh Thuận",
        price: "85.000",
        unit: "kg",
        image: BongCaiXanh,
      },
      {
        name: "Dâu tây Đà Lạt",
        price: "120.000",
        unit: "hộp",
        image: BongCaiXanh,
      },
      {
        name: "Bưởi da xanh",
        price: "45.000",
        unit: "quả",
        image: BongCaiXanh,
      },
      { name: "Cam sành", price: "35.000", unit: "kg", image: BongCaiXanh },
      {
        name: "Táo Fuji nhập khẩu",
        price: "95.000",
        unit: "kg",
        image: BongCaiXanh,
      },
    ],
    eggs: [
      {
        name: "Trứng gà ta",
        price: "45.000",
        unit: "vỉ 10 quả",
        image: BongCaiXanh,
      },
      {
        name: "Trứng gà công nghiệp",
        price: "32.000",
        unit: "vỉ 10 quả",
        image: BongCaiXanh,
      },
      {
        name: "Trứng vịt",
        price: "38.000",
        unit: "vỉ 10 quả",
        image: BongCaiXanh,
      },
      {
        name: "Trứng cút",
        price: "25.000",
        unit: "vỉ 20 quả",
        image: BongCaiXanh,
      },
      {
        name: "Trứng gà ác",
        price: "55.000",
        unit: "vỉ 10 quả",
        image: BongCaiXanh,
      },
      {
        name: "Trứng vịt lộn",
        price: "8.000",
        unit: "quả",
        image: BongCaiXanh,
      },
    ],
    meat: [
      {
        name: "Thịt bò Wagyu",
        price: "985.000",
        unit: "kg",
        image: BongCaiXanh,
      },
      {
        name: "Sườn cốt lết",
        price: "185.000",
        unit: "kg",
        image: BongCaiXanh,
      },
      { name: "Ba chỉ heo", price: "145.000", unit: "kg", image: BongCaiXanh },
      { name: "Ức gà", price: "95.000", unit: "kg", image: BongCaiXanh },
      { name: "Đùi gà", price: "85.000", unit: "kg", image: BongCaiXanh },
      {
        name: "Thịt heo xay",
        price: "125.000",
        unit: "kg",
        image: BongCaiXanh,
      },
    ],
    vegetables: [
      {
        name: "Bông cải xanh",
        price: "85.000",
        unit: "kg",
        image: BongCaiXanh,
      },
      { name: "Cà rốt", price: "35.000", unit: "kg", image: BongCaiXanh },
      { name: "Rau muống", price: "15.000", unit: "bó", image: BongCaiXanh },
      { name: "Cải thìa", price: "25.000", unit: "kg", image: BongCaiXanh },
      { name: "Bí đỏ", price: "28.000", unit: "kg", image: BongCaiXanh },
      { name: "Dưa leo", price: "20.000", unit: "kg", image: BongCaiXanh },
    ],
    bread: [
      {
        name: "Bánh mì lúa mạch",
        price: "45.000",
        unit: "ổ",
        image: BongCaiXanh,
      },
      {
        name: "Bánh mì sandwich",
        price: "35.000",
        unit: "gói",
        image: BongCaiXanh,
      },
      {
        name: "Bánh mì baguette",
        price: "25.000",
        unit: "ổ",
        image: BongCaiXanh,
      },
      {
        name: "Bánh mì ngọt",
        price: "18.000",
        unit: "cái",
        image: BongCaiXanh,
      },
      {
        name: "Bánh croissant",
        price: "28.000",
        unit: "cái",
        image: BongCaiXanh,
      },
      { name: "Bánh mì tươi", price: "5.000", unit: "ổ", image: BongCaiXanh },
    ],
  };

  const saleProducts = [
    {
      name: "Thịt bò Úc",
      price: "320.000",
      originalPrice: "450.000",
      discount: 30,
      image: BongCaiXanh,
      hot: true,
    },
    {
      name: "Rau cải xanh",
      price: "18.000",
      originalPrice: "25.000",
      discount: 28,
      image: BongCaiXanh,
    },
    {
      name: "Trứng gà omega",
      price: "42.000",
      originalPrice: "55.000",
      discount: 24,
      image: BongCaiXanh,
    },
    {
      name: "Bánh mì tươi",
      price: "12.000",
      originalPrice: "18.000",
      discount: 33,
      image: BongCaiXanh,
      hot: true,
    },
    {
      name: "Cam Vinh",
      price: "45.000",
      originalPrice: "60.000",
      discount: 25,
      image: BongCaiXanh,
    },
  ];

  const bestSelling = [
    { name: "Bông cải xanh", price: "85.000", discount: 8, image: BongCaiXanh },
    { name: "Thịt bò Wagyu", price: "985.000", discount: 8, image: BoWagyu },
    { name: "Sườn cốt lết", price: "185.000", discount: 8, image: SuonCotLet },
    { name: "Cà rốt", price: "55.000", discount: 8, image: Carrot },
    {
      name: "Bánh mì lúa mạch",
      price: "45.000",
      discount: 8,
      image: BanhMiLuaMach,
    },
    {
      name: "Bánh mì lúa mạch",
      price: "45.000",
      discount: 8,
      image: BanhMiLuaMach,
    },
    { name: "Cà rốt", price: "985.000", discount: 8, image: Carrot },
    { name: "Bông cải xanh", price: "85.000", discount: 8, image: BongCaiXanh },
    { name: "Thịt bò Wagyu", price: "985.000", discount: 8, image: BoWagyu },
    { name: "Sườn cốt lết", price: "185.000", discount: 8, image: SuonCotLet },
  ];

  const newArrivals = [
    {
      name: "Bánh mì sandwich",
      price: "85.000",
      discount: 8,
      image: BanhMiSandwich,
    },
    {
      name: "Bánh mì sandwich",
      price: "85.000",
      discount: 8,
      image: BanhMiSandwich,
    },
    {
      name: "Bánh mì sandwich",
      price: "85.000",
      discount: 8,
      image: BanhMiSandwich,
    },
    {
      name: "Bánh mì sandwich",
      price: "85.000",
      discount: 8,
      image: BanhMiSandwich,
    },
    {
      name: "Bánh mì sandwich",
      price: "85.000",
      discount: 8,
      image: BanhMiSandwich,
    },
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategoryProducts(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryProducts(false);
    setSelectedCategory(null);
  };

  const selectedCategoryData = categories.find(
    (c) => c.id === selectedCategory
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <header>
        <Navbar />
      </header>

      <div className="pt-20">
        <section
          ref={heroRef}
          className="relative px-6 md:px-16 lg:px-30 py-16 bg-linear-to-r from-amber-500 via-amber-400 to-orange-400 overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative  max-w-4xl">
            <span
              className={`inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4 transition-all duration-700 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Ưu đãi đặc biệt hôm nay
            </span>
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 transition-all duration-700 delay-100 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Thực phẩm tươi sạch
              <br />
              <span className="text-amber-900">Giao tận nhà</span>
            </h1>
            <p
              className={`text-white/90 text-lg md:text-xl mb-8 max-w-2xl transition-all duration-700 delay-200 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Chọn ngay những sản phẩm tươi ngon nhất với giá ưu đãi. Giao hàng
              siêu tốc trong 2 giờ!
            </p>
            <div
              className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <button className="bg-white text-amber-600 px-8 py-3 rounded-full font-semibold hover:bg-amber-50 hover:scale-105 transition-all duration-300 shadow-lg">
                Mua ngay
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                Xem ưu đãi
              </button>
            </div>
          </div>

          {/* Floating food icons */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
            <div
              className={`transition-all duration-1000 delay-500 ${
                heroVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-20"
              }`}
            >
              <img
                src={strawberry}
                alt="Thực phẩm"
                className="rounded-full w-72 h-72 object-contain drop-shadow-2xl animate-float"
              />
            </div>
          </div>
        </section>

        {/* Category Section */}
        <section ref={categoryRef} className="px-6 md:px-16 lg:px-30 py-12">
          <h2
            className={`text-3xl font-bold text-gray-800 relative inline-block transition-all duration-700 ease-out ${
              categoryVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            Danh mục sản phẩm
            <span className="absolute -bottom-2 left-0 w-16 h-1 bg-amber-600 rounded-full"></span>
          </h2>
          <p className="text-gray-500 mt-4">
            Nhấn vào danh mục để xem sản phẩm
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-start gap-6 md:gap-10">
            {categories.map((cat, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(cat.id)}
                className={`group cursor-pointer transition-all duration-500 ease-out ${
                  categoryVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                <div className="relative overflow-hidden rounded-full shadow-md group-hover:shadow-xl group-hover:shadow-amber-200 transition-all duration-300 ring-4 ring-transparent group-hover:ring-amber-400">
                  <div className="absolute inset-0 bg-amber-600/0 group-hover:bg-amber-600/20 transition-all duration-300 rounded-full z-10"></div>
                  <img
                    src={cat.image || "/placeholder.svg"}
                    alt={cat.name}
                    className="w-28 h-28 md:w-35 md:h-35 rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="text-center text-gray-700 text-base md:text-lg mt-4 font-medium transition-all duration-300 group-hover:text-amber-600 group-hover:font-semibold">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          ref={saleRef}
          className="px-6 md:px-16 lg:px-30 py-12 bg-linear-to-r from-red-50 to-orange-50"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <h2
                className={`text-3xl font-bold text-gray-800 relative inline-block transition-all duration-700 ease-out ${
                  saleVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
              >
                Đang giảm giá
                <span className="absolute -bottom-2 left-0 w-16 h-1 bg-red-500 rounded-full"></span>
              </h2>
              <span
                className={`bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full animate-pulse transition-all duration-700 ${
                  saleVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                HOT SALE
              </span>
            </div>

            {/* Countdown timer */}
            <div
              className={`flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md transition-all duration-700 delay-200 ${
                saleVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <span className="text-gray-600 text-sm">Kết thúc sau:</span>
              <div className="flex gap-1">
                <span className="bg-red-500 text-white px-2 py-1 rounded font-bold text-sm">
                  02
                </span>
                <span className="text-red-500 font-bold">:</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded font-bold text-sm">
                  45
                </span>
                <span className="text-red-500 font-bold">:</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded font-bold text-sm">
                  30
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {saleProducts.map((product, index) => (
              <div
                key={index}
                className={`group bg-white rounded-2xl shadow-md p-4 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-3 cursor-pointer relative overflow-hidden border-2 border-red-100 hover:border-red-300 ${
                  saleVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-12 scale-95"
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                {/* Hot badge */}
                {product.hot && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
                    </svg>
                    HOT
                  </div>
                )}

                {/* Discount badge */}
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
                  -{product.discount}%
                </div>

                {/* Product image */}
                <div className="flex justify-center overflow-hidden rounded-xl bg-linear-to-b from-gray-50 to-gray-100 p-4 mt-6">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-28 h-28 md:w-36 md:h-36 object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Product info */}
                <div className="text-center mt-4">
                  <p className="text-base font-medium text-gray-800 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
                    {product.name}
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-red-500">
                      {product.price}đ
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {product.originalPrice}đ
                    </span>
                  </div>
                </div>

                <div className="mt-4 transform transition-transform duration-300 group-hover:scale-105">
                  <Button product={product} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best Selling Section */}
        <section
          ref={bestSellingRef}
          className="px-6 md:px-16 lg:px-30 py-12 bg-linear-to-b from-gray-100 to-gray-50"
        >
          <h2
            className={`text-3xl font-bold text-gray-800 relative inline-block transition-all duration-700 ease-out ${
              bestSellingVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            Sản phẩm bán chạy
            <span className="absolute -bottom-2 left-0 w-16 h-1 bg-amber-600 rounded-full"></span>
          </h2>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {bestSelling.map((product, index) => (
              <div
                key={index}
                className={`group bg-white rounded-xl shadow-md p-4 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-3 cursor-pointer relative overflow-hidden ${
                  bestSellingVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-12 scale-95"
                }`}
                style={{ transitionDelay: `${(index % 5) * 80 + 200}ms` }}
              >
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse z-10">
                  -{product.discount}%
                </div>

                <div className="flex justify-center overflow-hidden rounded-lg bg-gray-50 p-2">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="text-center mt-4">
                  <p className="text-base md:text-lg font-medium text-gray-800 group-hover:text-amber-600 transition-colors duration-300">
                    {product.name}
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-lg md:text-xl font-bold text-amber-600">
                      {product.price}
                      <span className="text-sm">đ</span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 transform transition-transform duration-300 group-hover:scale-105">
                  <Button product={product} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals Section */}
        <section
          ref={newArrivalsRef}
          className="px-6 md:px-16 lg:px-30 py-12 pb-20 bg-linear-to-b from-gray-50 to-white"
        >
          <div className="flex items-center gap-3">
            <h2
              className={`text-3xl font-bold text-gray-800 relative inline-block transition-all duration-700 ease-out ${
                newArrivalsVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              Hàng vừa mới đến
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-amber-600 rounded-full"></span>
            </h2>
            <span
              className={`bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce transition-all duration-700 ${
                newArrivalsVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              NEW
            </span>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {newArrivals.map((product, index) => (
              <div
                key={index}
                className={`group bg-white rounded-xl shadow-md p-4 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-3 cursor-pointer relative overflow-hidden border-2 border-transparent hover:border-amber-200 ${
                  newArrivalsVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-12 scale-95"
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  MỚI
                </div>

                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  -{product.discount}%
                </div>

                <div className="flex justify-center overflow-hidden rounded-lg bg-gray-50 p-2">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                  />
                </div>

                <div className="text-center mt-4">
                  <p className="text-base md:text-lg font-medium text-gray-800 group-hover:text-amber-600 transition-colors duration-300">
                    {product.name}
                  </p>
                  <div className="mt-2">
                    <span className="text-lg md:text-xl font-bold text-amber-600">
                      {product.price}
                      <span className="text-sm">đ</span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 transform transition-transform duration-300 group-hover:scale-105">
                  <Button product={product} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {showCategoryProducts && selectedCategory && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeCategoryModal}
        >
          <div
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-linear-to-r from-amber-500 to-orange-400 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCategoryData?.image || "/placeholder.svg"}
                  alt={selectedCategoryData?.name}
                  className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedCategoryData?.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {categoryProducts[selectedCategory]?.length} sản phẩm
                  </p>
                </div>
              </div>
              <button
                onClick={closeCategoryModal}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {categoryProducts[selectedCategory]?.map((product, index) => (
                  <div
                    key={index}
                    className="group bg-gray-50 hover:bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer border border-gray-100 hover:border-amber-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex justify-center overflow-hidden rounded-xl bg-white p-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-24 h-24 md:w-32 md:h-32 object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="text-center mt-4">
                      <p className="font-medium text-gray-800 group-hover:text-amber-600 transition-colors duration-300">
                        {product.name}
                      </p>
                      <div className="mt-2 flex items-center justify-center gap-2">
                        <span className="text-lg font-bold text-amber-600">
                          {product.price}đ
                        </span>
                        <span className="text-xs text-gray-400">
                          / {product.unit}
                        </span>
                      </div>
                    </div>

                    <button className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Thêm vào giỏ
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes modal-in {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-modal-in {
          animation: modal-in 0.3s ease-out forwards;
        }
      `}</style>

      <Footer />
    </main>
  );
}

export default Shop;

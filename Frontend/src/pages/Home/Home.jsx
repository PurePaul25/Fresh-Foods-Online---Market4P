import PromoCountdown from "../../components/PromoCountdown/PromoCountdown";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button/Button";
import trangchu from "../../assets/images/trangchu.jpg";
import { Truck, PhoneCall, RefreshCcw, ShoppingCart } from "lucide-react";
import berry from "../../assets/images/berry.jpg";
import strawberry from "../../assets/images/strawberry.jpg";
import lemon from "../../assets/images/lemon.jpg";
import HIKANstrawberry from "../../assets/images/HIKANstrawberry.jpg";
import Footer from "../../components/Footer";
import { NavLink } from "react-router-dom";

import { useRef, useState, useEffect } from "react";

function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // 1. Lưu giá trị ref.current vào một biến
    const currentElement = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 2. Tối ưu: Ngừng quan sát sau khi phần tử đã hiển thị
          if (currentElement) {
            observer.unobserve(currentElement);
          }
        }
      },
      { threshold }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    // 3. Sử dụng biến đã lưu trong hàm dọn dẹp
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
}

function Home() {
  const [heroRef, heroVisible] = useScrollAnimation();
  const [servicesRef, servicesVisible] = useScrollAnimation();
  const [productsRef, productsVisible] = useScrollAnimation();
  const [promoRef, promoVisible] = useScrollAnimation();

  const products = [
    { id: 1, name: "Dâu tây", price: 165000, image: berry },
    { id: 2, name: "Nho", price: 125000, image: strawberry },
    { id: 3, name: "Chanh", price: 45000, image: lemon },
  ];

  const services = [
    {
      icon: Truck,
      title: "Miễn phí ship",
      desc: "Khi đặt hàng trên 1.000.000",
    },
    { icon: PhoneCall, title: "Hỗ trợ 24/7", desc: "Hỗ trợ bất cứ lúc nào" },
    {
      icon: RefreshCcw,
      title: "Hoàn trả",
      desc: "Hoàn trả trong vòng 3 ngày!",
    },
  ];

  return (
    <main>
      <Navbar></Navbar>
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-screen">
        <img
          src={trangchu}
          alt="Trang chủ"
          className="w-full h-screen object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Banner text với animation */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold transition-all duration-1000 ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <p
            className={`text-amber-600 text-xl transition-all duration-700 delay-200 ${
              heroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            Tươi & Sạch
          </p>
          <p
            className={`text-5xl text-white my-1 transition-all duration-700 delay-400 ${
              heroVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            Trái cây ngon theo mùa
          </p>

          <div
            className={`flex items-center justify-center font-semibold gap-x-3 text-white mt-6 transition-all duration-700 delay-600 ${
              heroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <NavLink
              to="/shop"
              className="bg-amber-600 py-3 px-5 rounded-full hover:cursor-pointer hover:brightness-90 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Đi đến cửa hàng
            </NavLink>
            <NavLink
              to="/contact"
              className="bg-amber-600 py-3 px-5 rounded-full hover:cursor-pointer hover:brightness-90 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Liên hệ với chúng tôi
            </NavLink>
          </div>
        </div>
      </div>

      <div>
        {/* Dịch vụ với animation */}
        <div
          ref={servicesRef}
          className="p-20 bg-gray-100 flex items-center justify-around"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className={`flex items-center gap-x-2 transition-all duration-700 hover:scale-105 ${
                  servicesVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="p-3 rounded-full border border-amber-600 border-dotted text-amber-600 transition-all duration-300 hover:bg-amber-600 hover:text-white">
                  <Icon size={40} />
                </div>
                <div>
                  <p className="font-bold text-lg">{service.title}</p>
                  <p className="text-sm text-[#5d5c5c]">{service.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sản phẩm nổi bật với animation */}
        <div ref={productsRef} className="p-20">
          <div
            className={`text-center mb-10 transition-all duration-700 ${
              productsVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-8"
            }`}
          >
            <p className="font-bold text-3xl">
              <span className="text-amber-600">Sản phẩm</span> nổi bật
            </p>
            <div className="w-[8vh] h-[0.2rem] bg-amber-600 mx-auto mt-2 mb-4 rounded transition-all duration-500 hover:w-[12vh]"></div>
            <p className="text-[#5d5c5c]">
              Tận hưởng sự tươi mát trong từng miếng trái cây được chọn lọc kỹ
              lưỡng từ những nông trại uy tín.
              <br />
              Chúng tôi cam kết mang đến cho bạn nguồn trái cây sạch, ngon và
              giàu dinh dưỡng nhất.
            </p>
          </div>

          <div className="flex items-center justify-evenly">
            {products.map((product, index) => (
              <div
                key={index}
                className={`shadow-lg p-10 hover:cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  productsVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-70 h-70 transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold mt-4">{product.name}</p>
                  <p className="my-3">Per Kg</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {product.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <div className="flex justify-center">
                  <NavLink
                    to="/shop"
                    className="bg-amber-600 py-2 mt-1 px-5 rounded-full hover:cursor-pointer hover:brightness-90 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    Đi đến cửa hàng
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Giảm giá với animation */}
        <div
          ref={promoRef}
          className="p-20 flex items-center gap-x-4 pl-52 bg-gray-100"
        >
          <div
            className={`relative transition-all duration-700 ${
              promoVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="overflow-hidden rounded-xl">
              <img
                src={HIKANstrawberry}
                alt="Dâu tây HIKAN"
                className="object-cover min-w-130 transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute top-4 left-4 p-6 bg-amber-600 rounded-full border-4 border-orange-300 animate-pulse">
              <p className="text-center text-white">
                <span className="text-xl font-bold">27%</span>
                <br />
                <span>per kg</span>
              </p>
            </div>
          </div>

          <div
            className={`text-start transition-all duration-700 delay-300 ${
              promoVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            <p className="text-4xl font-bold flex gap-x-2">
              <span className="text-amber-600">Siêu</span>
              giảm giá
            </p>

            <div className="mb-4">
              <p className="py-2 mb-5 font-semibold text-xl">DÂU TÂY HIKAN</p>
              <p className="leading-relaxed">
                Dâu tây là loại trái cây đỏ mọng, có vị ngọt xen lẫn chua nhẹ,
                hương thơm đặc trưng và được nhiều người yêu thích. Không chỉ
                ngon miệng, dâu tây còn giàu vitamin C, chất xơ và chất chống
                oxy hóa, giúp tăng cường sức khỏe, làm đẹp da và hỗ trợ hệ miễn
                dịch.
              </p>
            </div>
            <PromoCountdown />
            <div className="mt-7">
              <NavLink
                to="/shop"
                className="bg-amber-600 py-2 mt-1 px-5 rounded-full hover:cursor-pointer hover:brightness-90 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Đi đến cửa hàng
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </main>
  );
}

export default Home;

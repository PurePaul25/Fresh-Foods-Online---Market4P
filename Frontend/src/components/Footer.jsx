import { Send, Store } from "lucide-react";
import { Link } from "react-router-dom";

const Year = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="bg-[#051922] text-white">
      <div className="p-6 lg:p-20 flex flex-col lg:flex-row justify-between gap-10 lg:gap-x-10">
        {/* Cột 1: Về chúng tôi */}
        <div className="lg:w-1/3">
          <h1 className="text-xl font-semibold text-center md:text-left">
            Về Chúng tôi
          </h1>
          <div className="w-full h-0.5 my-3 bg-amber-600"></div>
          <p className="text-gray-400 text-justify">
            Chúng tôi là đội ngũ đam mê mang đến những sản phẩm chất lượng, dịch
            vụ tận tâm và trải nghiệm tốt nhất cho khách hàng.
            <br />
            Với tinh thần sáng tạo và trách nhiệm, chúng tôi không ngừng nỗ lực
            để xây dựng thương hiệu uy tín và đáng tin cậy.
          </p>
        </div>

        {/* Cột 2: Tổng quan */}
        <div className="lg:w-1/3 ">
          <h1 className="text-xl font-semibold text-center md:text-left">
            Tổng quan
          </h1>
          <div className="w-full h-0.5 my-3 bg-amber-600"></div>
          <div className="text-gray-400 space-y-3 flex flex-col items-center md:items-start">
            <Link
              to="/"
              className="hover:text-amber-600 transition-all duration-300 hover:translate-x-2 w-fit"
            >
              Trang chủ
            </Link>
            <Link
              to="/about"
              className="hover:text-amber-600 transition-all duration-300 hover:translate-x-2 w-fit"
            >
              Giới thiệu
            </Link>
            <Link
              to="/contact"
              className="hover:text-amber-600 transition-all duration-300 hover:translate-x-2 w-fit"
            >
              Liên hệ
            </Link>
            <Link
              to="/shop"
              className="hover:text-amber-600 transition-all duration-300 hover:translate-x-2 w-fit"
            >
              Cửa hàng
            </Link>
            <Link
              to="/checkout"
              className="hover:text-amber-600 transition-all duration-300 hover:translate-x-2 w-fit"
            >
              Thanh toán
            </Link>
          </div>
        </div>
        {/* Cột 3: Đăng ký */}
        <div className="lg:w-1/3">
          <h1 className="text-xl font-semibold text-center md:text-left">
            Đăng ký
          </h1>
          <div className="w-full h-0.5 my-3 bg-amber-600"></div>
          <div className="text-gray-400 text-center md:text-left">
            Đăng ký để nhận những thông tin mới nhất từ chúng tôi.
            <br />
            <form className="flex items-center mt-4 rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-[#012738] outline-none placeholder-gray-500"
              />
              <button
                type="submit"
                className="px-4 py-3.5 hover:cursor-pointer hover:bg-amber-700 text-white bg-amber-600 transition-colors"
              >
                <Send size={20}></Send>
              </button>
            </form>
          </div>
        </div>
        {/* Cột 4: Hợp tác và liên hệ chúng tôi */}
        <div className="lg:w-1/3">
          <h1 className="text-xl font-semibold text-center md:text-left">
            Hợp tác
          </h1>
          <div className="w-full h-0.5 my-3 bg-amber-600"></div>
          <div className="text-gray-400 space-y-3 text-center md:text-left">
            UTH, Binh Thanh, Ho Chi Minh City
            <a
              href="mailto:abc@market4p.com"
              className="block mt-2.5 hover:text-amber-600 transition hover:translate-x-2 duration-200"
            >
              abc@market4p.com
            </a>
            <a
              href="tel:+84123456789"
              className="block hover:text-amber-600 transition hover:translate-x-2 duration-200"
            >
              +84 123 456 789
            </a>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="px-6 lg:px-20 py-5 bg-[#051922] text-white border-t border-t-white/10 text-center text-sm">
        <p>
          Copyrights © {Year} -{" "}
          <span className="text-amber-600">Market4P, </span>
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

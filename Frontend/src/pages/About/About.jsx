import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { Banknote, BriefcaseBusiness, RefreshCw, Truck } from "lucide-react";
import featureBg from "../../assets/images/feature-bg.jpg";
import VanTai from "../../assets/images/VanTai.png";
import Bao from "../../assets/images/Bao.png";
import Phat from "../../assets/images/Phat.png";
import Hoa from "../../assets/images/Hoa.jpg";

import { useEffect, useRef, useState } from "react";

function useScrollAnimation(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentElement = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
}

function About() {
  const [whyRef, whyVisible] = useScrollAnimation();
  const [teamRef, teamVisible] = useScrollAnimation();

  const features = [
    [
      {
        icon: Truck,
        title: "Giao hàng tận nơi",
        desc: "Giao hàng tận nơi nhanh chóng, giúp bạn nhận sản phẩm ngay tại nhà mà không cần di chuyển.",
      },
      {
        icon: Banknote,
        title: "Giá tốt nhất",
        desc: "Mang đến mức giá tốt nhất cùng nhiều ưu đãi hấp dẫn để bạn luôn mua sắm tiết kiệm.",
      },
    ],
    [
      {
        icon: BriefcaseBusiness,
        title: "Đóng gói",
        desc: "Đóng gói sản phẩm theo yêu cầu, đảm bảo tính thẩm mỹ và phù hợp với từng nhu cầu riêng.",
      },
      {
        icon: RefreshCw,
        title: "Hoàn tiền",
        desc: "Chính sách hoàn tiền nhanh chóng, đơn giản và minh bạch để bạn yên tâm khi mua sắm.",
      },
    ],
  ];

  const team = [
    { name: "Huỳnh Văn Tài", role: "Developer", avt: VanTai },
    { name: "Lê Nguyễn Thành Phát", role: "Developer", avt: Phat },
    { name: "Phạm Xuân Hòa", role: "Developer", avt: Hoa },
    { name: "Đoàn Lưu Gia Bảo", role: "Developer", avt: Bao },
  ];

  return (
    <div>
      <Navbar></Navbar>

      <div className="pt-19">
        {/* Why Section */}
        <div
          ref={whyRef}
          className="flex flex-col lg:flex-row items-center p-8 md:p-20 gap-12"
        >
          {/* Text Section */}
          <div className="flex flex-col gap-10 w-full lg:w-1/2">
            <h2
              className={`text-4xl font-bold transition-all duration-700 ${
                whyVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <span className="text-amber-600">Tại sao </span>
              chọn Market4P
            </h2>

            {features.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex flex-col sm:flex-row justify-between gap-8"
              >
                {row.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-4 w-full sm:w-1/2 transition-all duration-500 hover:translate-x-2 ${
                        whyVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                    >
                      <div className="p-4 rounded-full text-amber-600 border border-dashed border-amber-600 shrink-0 transition-all duration-300 hover:bg-amber-600 hover:text-white hover:scale-110">
                        <Icon size={35} />
                      </div>
                      <div>
                        <p className="text-xl font-bold">{feature.title}</p>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Image Section */}
          <div
            className={`w-full lg:w-1/2 flex justify-center transition-all duration-700 ${
              whyVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            <div className="overflow-hidden rounded-xl">
              <img
                src={featureBg}
                alt="Feature Background"
                className="object-cover w-full max-w-md lg:max-w-full transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div ref={teamRef} className="p-8 md:p-20 bg-gray-100">
          <div
            className={`text-center max-w-3xl mx-auto transition-all duration-700 ${
              teamVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-8"
            }`}
          >
            <h1 className="text-3xl font-bold">
              Đội ngũ
              <span className="text-amber-600 ml-2">chúng tôi</span>
            </h1>
            <p className="leading-relaxed mt-4">
              Chúng tôi là một tập thể trẻ trung, sáng tạo và đầy nhiệt huyết.
              Với tinh thần hợp tác và trách nhiệm, Market4P luôn nỗ lực mang
              đến trải nghiệm mua sắm tiện lợi, đáng tin cậy và thân thiện nhất
              cho khách hàng.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {team.map((member, index) => (
              <div
                key={index}
                className={`text-center group p-6 bg-white/50 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-white ${
                  teamVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
              >
                <div className="relative inline-block">
                  <img
                    src={member.avt}
                    alt={member.name}
                    className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-white shadow-md transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-amber-500 transition-all duration-300"></div>
                </div>
                <p className="font-bold text-lg mt-4 transition-colors duration-300 group-hover:text-amber-600">
                  {member.name}
                </p>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}

export default About;

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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
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
    { name: "Huỳnh Văn Tài", avt: VanTai },
    { name: "Lê Nguyễn Thành Phát", avt: Phat },
    { name: "Phạm Xuân Hòa", avt: Hoa },
    { name: "Đoàn Lưu Gia Bảo", avt: Bao },
  ];

  return (
    <div>
      <Navbar></Navbar>

      <div className="pt-19">
        {/* Why Section với animation */}
        <div ref={whyRef} className="flex items-center p-20 pl-40">
          {/* Text Section */}
          <div className="flex flex-col gap-10 w-1/2">
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
              <div key={rowIndex} className="flex justify-between gap-8">
                {row.map((feature, index) => {
                  const Icon = feature.icon;
                  const delay = (rowIndex * 2 + index) * 150;
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-4 w-1/2 transition-all duration-500 hover:translate-x-2 ${
                        whyVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                      style={{ transitionDelay: `${delay}ms` }}
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
            className={`w-1/2 flex justify-center transition-all duration-700 delay-500 ${
              whyVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            <div className="overflow-hidden rounded-xl">
              <img
                src={featureBg}
                alt="Feature Background"
                className="object-cover w-140 transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Team Section với animation */}
        <div ref={teamRef} className="p-20 bg-gray-100">
          <div
            className={`text-center w-210 mx-auto transition-all duration-700 ${
              teamVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-8"
            }`}
          >
            <h1 className="text-3xl font-bold">
              Đội ngũ
              <span className="text-amber-600 ml-1">chúng tôi</span>
            </h1>
            <p className="leading-relaxed mt-4">
              Chúng tôi là một tập thể trẻ trung, sáng tạo và đầy nhiệt huyết.
              Với tinh thần hợp tác và trách nhiệm, Market4P luôn nỗ lực mang
              đến trải nghiệm mua sắm tiện lợi, đáng tin cậy và thân thiện nhất
              cho khách hàng.
            </p>
          </div>
          <div className="flex items-center justify-center gap-x-15 mt-8">
            {team.map((member, index) => (
              <div
                key={index}
                className={`text-center group transition-all duration-500 hover:-translate-y-2 ${
                  teamVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="overflow-hidden rounded">
                  <img
                    src={member.avt}
                    alt={member.name}
                    className="w-50 h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="font-semibold mt-2 transition-colors duration-300 group-hover:text-amber-600">
                  {member.name}
                </p>
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

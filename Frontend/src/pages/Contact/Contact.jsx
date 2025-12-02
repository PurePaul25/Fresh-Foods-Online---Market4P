import Navbar from "../../components/navbar"
import Footer from "../../components/Footer"
import { Clock, Map, MapPin, ReceiptText } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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

function Contact() {
    const [formRef, formVisible] = useScrollAnimation()
    const [infoRef, infoVisible] = useScrollAnimation()
    const [mapRef, mapVisible] = useScrollAnimation()

    const contactInfo = [
        { icon: Map, title: "Địa chỉ cửa hàng", lines: ["25 Vo Oanh, Binh Thanh,", "Ho Chi Minh City"] },
        { icon: Clock, title: "Giờ mở cửa", lines: ["Thứ 2 - Thứ 6: 7h đến 20h", "Thứ 7 - Chủ nhật: 7h đến 22h"] },
        { icon: ReceiptText, title: "Liên hệ", lines: ["Điện thoại: +84 123 456 789", "Email: abc@market4p.com"] },
    ]

    return (
        <main>
            <Navbar></Navbar>

            <div className="pt-19">
                {/* Question Section */}
                <div className="p-20 px-35 grid grid-cols-[70%_30%] gap-x-8">
                    {/* Form với animation */}
                    <div
                        ref={formRef}
                        className={`transition-all duration-700 ${formVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                            }`}
                    >
                        <div>
                            <h1 className="font-bold text-3xl">Gửi câu hỏi về cho chúng tôi</h1>
                            <p className="my-3">
                                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Nếu bạn có bất kỳ câu hỏi nào về sản phẩm, dịch vụ hoặc
                                đơn hàng, hãy liên hệ với chúng tôi — đội ngũ Market4P sẽ nhanh chóng phản hồi và giúp bạn có được câu
                                trả lời hài lòng nhất.
                            </p>
                        </div>
                        <div className="mt-4">
                            <div className="flex gap-x-1">
                                <input
                                    type="text"
                                    placeholder="Họ tên"
                                    className="p-3 w-1/2 outline-none border border-[#ccc] transition-all duration-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-100 hover:border-amber-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className="p-3 w-1/2 outline-none border border-[#ccc] transition-all duration-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-100 hover:border-amber-400"
                                />
                            </div>
                            <div className="flex gap-x-1 my-3">
                                <input
                                    type="text"
                                    placeholder="Số điện thoại"
                                    className="p-3 w-1/2 outline-none border border-[#ccc] transition-all duration-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-100 hover:border-amber-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Vấn đề"
                                    className="p-3 w-1/2 outline-none border border-[#ccc] transition-all duration-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-100 hover:border-amber-400"
                                />
                            </div>
                            <div>
                                <textarea
                                    placeholder="Nội dung"
                                    className="resize-none h-40 p-3 w-full outline-none border border-[#ccc] transition-all duration-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-100 hover:border-amber-400"
                                />
                            </div>
                            <button className="py-1.5 px-8 mt-4 rounded-full text-lg font-medium bg-amber-600 hover:cursor-pointer hover:bg-black hover:text-amber-600 transition-all duration-300 hover:scale-105 active:scale-95">
                                Gửi
                            </button>
                        </div>
                    </div>

                    {/* Contact Info với animation */}
                    <div ref={infoRef} className="p-2">
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon
                            return (
                                <div
                                    key={index}
                                    className={`flex gap-x-2 mb-8 last:mb-0 transition-all duration-500 hover:translate-x-2 ${infoVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                                        }`}
                                    style={{ transitionDelay: `${index * 150}ms` }}
                                >
                                    <div>
                                        <div className="text-amber-600 transition-transform duration-300 hover:scale-110">
                                            <Icon size={29} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold">{info.title}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {info.lines.map((line, i) => (
                                                <span key={i}>
                                                    {line}
                                                    {i < info.lines.length - 1 && <br />}
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Map Section với animation */}
                <div ref={mapRef}>
                    <div
                        className={`flex items-center justify-center gap-x-2 bg-[#162133] p-20 transition-all duration-700 ${mapVisible ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <div className="text-amber-600 animate-bounce">
                            <MapPin size={50} />
                        </div>
                        <p className="text-white text-2xl font-bold">Vị trí của chúng tôi</p>
                    </div>
                    <div
                        className={`transition-all duration-700 delay-300 ${mapVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1385.6077291571794!2d106.71664602663205!3d10.804381533060173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175293dceb22197%3A0x755bb0f39a48d4a6!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBHaWFvIFRow7RuZyBW4bqtbiBU4bqjaSBUaMOgbmggUGjhu5EgSOG7kyBDaMOtIE1pbmggLSBDxqEgc-G7nyAx!5e0!3m2!1svi!2s!4v1763556334774!5m2!1svi!2s"
                            className="w-full h-145"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </main>
    )
}

export default Contact
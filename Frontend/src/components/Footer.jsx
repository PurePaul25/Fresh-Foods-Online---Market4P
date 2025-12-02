import { Send, } from "lucide-react"

const Footer = () => {
    return (
        <div>
            <div className="p-20 flex  justify-between gap-x-10 bg-[#051922] text-white">
                <div className="w-100">
                    <h1 className="text-xl font-semibold">Về Chúng tôi</h1>
                    <div className="w-[4vh] h-0.5 my-3 bg-amber-600"></div>
                    <p className="text-gray-400">
                        Chúng tôi là đội ngũ đam mê mang đến những sản phẩm chất lượng,
                        dịch vụ tận tâm và trải nghiệm tốt nhất cho khách hàng.
                        <br />
                        Với tinh thần sáng tạo và trách nhiệm,
                        chúng tôi không ngừng nỗ lực để xây dựng thương hiệu uy tín và đáng tin cậy.
                    </p>
                </div>
                <div className="w-100">
                    <h1 className="text-xl font-semibold">Đăng ký</h1>
                    <div className="w-[4vh] h-0.5 my-3 bg-amber-600"></div>
                    <div className="text-gray-400">
                        Đăng ký để nhận những thông tin mới nhất từ chúng tôi.
                        <br />
                        <div className="flex items-center gap-x-1 mt-4">
                            <input type="email" placeholder="Email"
                                className="w-full px-3 py-4 bg-[#012738] outline-none"
                            />
                            <div className="p-4 hover:cursor-pointer hover:opacity-80 text-amber-600 bg-[#012738]">
                                <Send></Send>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-100">
                    <h1 className="text-xl font-semibold">Hợp tác</h1>
                    <div className="w-[4vh] h-0.5 my-3 bg-amber-600"></div>
                    <div className="text-gray-400">
                        UTH, Binh Thanh, Ho Chi Minh City
                        <br />
                        <br />
                        abc@market4p.com
                        <br />
                        <br />
                        +84 123 456 789
                    </div>
                </div>

            </div>
            {/* Copyright */}
            <div className="flex items-center justify-center px-20 py-5 bg-[#051922] text-white border-t border-t-[#383636]">
                <div>
                    Copyrights © 2025 - <span className="text-amber-600">Market4P, </span>
                    All Rights Reserved.
                </div>
            </div>
        </div>


    )
}

export default Footer
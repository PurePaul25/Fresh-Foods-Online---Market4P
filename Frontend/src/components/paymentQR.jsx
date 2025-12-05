"use client"

import { useState } from "react"

const PaymentQR = ({ orderId, amount, onClose }) => {
    const [qrUrl, setQrUrl] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const bankInfo = {
        bankId: "970422",
        accountNo: "1037023264",
        accountName: "Market 4P",
        template: "compact2",
    }

    const createQR = async () => {
        try {
            setLoading(true)
            setError(null)
            console.log("[v0] Creating QR with amount:", amount, "orderId:", orderId)

            const description = `DH${orderId}`
            const qrApiUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-${bankInfo.template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(bankInfo.accountName)}`

            console.log("[v0] QR URL:", qrApiUrl)
            setQrUrl(qrApiUrl)
        } catch (err) {
            console.error("[v0] Error creating QR:", err)
            setError("Không thể tạo mã QR. Vui lòng thử lại.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-stone-800">Thanh toán qua VietQR</h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-3 mb-4">
                    <p className="text-stone-600">
                        Mã đơn hàng: <strong className="text-stone-800">DH{orderId}</strong>
                    </p>
                    <p className="text-stone-600">
                        Số tiền: <strong className="text-amber-600">{amount.toLocaleString("vi-VN")}đ</strong>
                    </p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                {!qrUrl ? (
                    <button
                        onClick={createQR}
                        disabled={loading}
                        className="w-full bg-amber-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Đang tạo mã QR..." : "Tạo mã QR"}
                    </button>
                ) : (
                    <div className="mt-4 text-center">
                        <img
                            src={qrUrl || "/placeholder.svg"}
                            alt="VietQR"
                            className="w-64 mx-auto rounded-lg shadow-md"
                            onError={() => setError("Không thể tải mã QR")}
                        />
                        <p className="mt-3 text-sm text-stone-500">Quét mã QR để thanh toán</p>
                        <div className="mt-4 p-3 bg-amber-50 rounded-lg text-left text-sm">
                            <p className="font-medium text-stone-700">Thông tin chuyển khoản:</p>
                            <p className="text-stone-600">Ngân hàng: MB Bank</p>
                            <p className="text-stone-600">STK: {bankInfo.accountNo}</p>
                            <p className="text-stone-600">Chủ TK: {bankInfo.accountName}</p>
                            <p className="text-stone-600">Nội dung: DH{orderId}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PaymentQR

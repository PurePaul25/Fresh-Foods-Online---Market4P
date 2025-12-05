import express from "express";
const router = express.Router();

const BANK_ID = "VCB";
const ACCOUNT_NO = "1037023264";
const ACCOUNT_NAME = "HUYNH VAN TAI";

router.post("/create-qr", (req, res) => {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
        return res.status(400).json({ message: "Missing amount or orderId" });
    }

    // Link tạo VietQR
    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${orderId}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

    return res.json({
        qrUrl,
        amount,
        orderId,
    });
});

export default router;

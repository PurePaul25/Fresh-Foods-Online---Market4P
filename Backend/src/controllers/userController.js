import User from "../models/User.js";

export const authMe = async (req, res) => {
  try {
    const userId = req.user.id; // lấy từ authMiddleware

    // Fetch user data từ database để lấy ban status
    const user = await User.findById(userId).select(
      "-hashedPassword -resetPasswordToken -resetPasswordExpire"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        data: {
          ...user.toObject(),
          isBanned: true,
        },
        message: `Tài khoản của bạn đã bị chặn. Lý do: ${
          user.bannedReason || "Không có lý do cụ thể"
        }`,
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Lỗi khi gọi authMe", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
    });
  }
};

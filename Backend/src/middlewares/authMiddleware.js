// @ts-nocheck
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from '../utils/ApiError.js';

// authorization - xác minh user là ai
export const protectedRoute = (req, res, next) => {
  try {
    // lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }

    // xác nhận token hợp lệ
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
      if (err) {
        console.error(err);

        return res
          .status(403)
          .json({ message: "Access token hết hạn hoặc không đúng" });
      }

      // tìm user
      const user = await User.findById(decodedUser.userId).select("-hashedPassword");

      if (!user) {
        return res.status(404).json({ message: "người dùng không tồn tại." });
      }

      // trả user về trong req
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Lỗi khi xác minh JWT trong authMiddleware", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access token is required');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach user info to request object
    req.user = {
      id: decoded.userId || decoded.id,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired'));
    }
    next(error);
  }
};
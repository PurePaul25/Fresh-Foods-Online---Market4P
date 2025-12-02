// seedAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/User.js"; // đường dẫn tới file User.js

dotenv.config();

const MONGO_URI = process.env.MONGODB_CONNECTIONSTRING; // kết nối MongoDB Atlas
const ADMIN_EMAIL = "admin@gmail.com"; // email admin
const ADMIN_USERNAME = "admin01"; // username admin
const ADMIN_PASSWORD = "admin123456789"; // mật khẩu admin
const ADMIN_DISPLAYNAME = "Admin1"; // display name

async function main() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Đã kết nối MongoDB");

    // kiểm tra admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("⚠️ Admin đã tồn tại:", existingAdmin.email);
      process.exit(0);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // tạo admin mới
    const admin = await User.create({
      username: ADMIN_USERNAME,
      hashedPassword,
      email: ADMIN_EMAIL,
      displayName: ADMIN_DISPLAYNAME,
      role: "admin",
      bio: "Quản trị hệ thống",
    });

    console.log("✅ Admin đã được tạo:", admin);
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi khi tạo admin:", err);
    process.exit(1);
  }
  console.log("MONGO_URI:", process.env.MONGO_URI);

}

main();

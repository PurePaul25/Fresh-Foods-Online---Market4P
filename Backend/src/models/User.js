import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String, // link CDN để hiển thị hình
    },
    avatarId: {
      type: String, // Cloudinary public_id để xoá hình
    },
    bio: {
      type: String,
      maxlength: 500, // 
    },
    phone: {
      type: String,
      sparse: true, // cho phép null, nhưng không được trùng
    },

    // ======  BAN FEATURE ====
    isBanned: {
      type: Boolean,
      default: false,
      index: true // Index for faster queries
    },
    bannedReason: {
      type: String,
      default: null
    },
    bannedAt: {
      type: Date,
      default: null
    },
    bannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", // mặc định là user
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if user is banned
userSchema.methods.checkBanStatus = function() {
  if (this.isBanned) {
    return {
      isBanned: true,
      reason: this.bannedReason || 'No reason provided',
      bannedAt: this.bannedAt
    };
  }
  return { isBanned: false };
};

const User = mongoose.model("User", userSchema);
export default User;
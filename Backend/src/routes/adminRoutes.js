import express from "express";
import {
  getDashboardStats,
  getRevenueAnalytics,
} from "../controllers/adminController.js";
import {
  getAllUsers,
  getUserById,
  banUser,
  unbanUser,
  changeUserRole,
  deleteUser,
  getCustomersWithOrders,
} from "../controllers/adminUserController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { banUserSchema } from "../utils/validationSchemas.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorize(["admin"]));

// Dashboard stats
router.get("/stats", getDashboardStats);
router.get("/revenue", getRevenueAnalytics);

// User management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/ban", validate(banUserSchema), banUser);
router.patch("/users/:id/unban", unbanUser);
router.patch("/users/:id/role", changeUserRole);
router.delete("/users/:id", deleteUser);

// Customer management (with order details)
router.get("/customers", getCustomersWithOrders);

export default router;

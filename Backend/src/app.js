import express from "express"
import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import cookieParser from "cookie-parser"
import { errorHandler, notFoundHandler } from "./middlewares/errorMiddleware.js"

// Import routes
import authRoute from "./routes/authRoute.js"
import userRoute from "./routes/userRoute.js"
import productRoutes from "./routes/productRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import paymentRoutes from "./routes/payment.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import { protectedRoute } from "./middlewares/authMiddleware.js"

const app = express()

// Security middleware
app.use(helmet())

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later",
})
app.use("/api/", limiter)

// Body parser
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Cookie parser
app.use(cookieParser())

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
} else {
  app.use(morgan("combined"))
}

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  })
})

// Public routes
app.use("/api/auth", authRoute)
app.use("/api/products", productRoutes)
app.use("/api/products", reviewRoutes)

// Protected routes - notification routes already have their own protectedRoute middleware
app.use("/api/users", protectedRoute, userRoute)
app.use("/api/orders", protectedRoute, orderRoutes)
app.use("/api/cart", protectedRoute, cartRoutes)
app.use("/api/admin", protectedRoute, adminRoutes)
app.use("/api/payment", protectedRoute, paymentRoutes)
app.use("/api/notification", notificationRoutes) // Already has protectedRoute in its own file

// 404 handler
app.use(notFoundHandler)

// Global error handler
app.use(errorHandler)

export default app

import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import reviewRoutes from "./src/routes/review.routes.js";
import errorHandler from "./src/middleware/errorHandler.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/review", reviewRoutes);

app.use(errorHandler);

export default app;

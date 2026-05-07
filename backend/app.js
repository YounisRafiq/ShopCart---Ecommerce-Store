import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
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

app.use(errorHandler);

export default app;

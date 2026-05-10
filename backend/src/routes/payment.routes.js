import { authMiddleware } from "../middleware/auth.middleware.js";
import paymentControllers from "../controllers/payment.controllers.js";
import express from "express";
const router = express.Router();

router.post(
  "/create-payment",
  authMiddleware,
  paymentControllers.createPayment,
);
router.post(
  "/verify-payment",
  authMiddleware,
  paymentControllers.verifyPayment,
);
router.get(
  "/payment-status/:orderId",
  authMiddleware,
  paymentControllers.getPaymentStatus,
);
router.get("/my-payments", authMiddleware, paymentControllers.getAllPayments);

export default router;

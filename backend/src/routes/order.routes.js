import { authMiddleware } from "../middleware/auth.middleware";
import orderController from "../controllers/order.controllers.js";
import express from "express";
const router = express.Router();

router.post("/create-order", authMiddleware, orderController.createOrder);
router.get("/get-single-order/:id", authMiddleware, orderController.getSingleOrder);
router.get("/get-my-orders", authMiddleware, orderController.getMyOrders);
router.patch("/update-order/:id", authMiddleware, orderController.updateOrder);
router.delete("/delete-order/:id", authMiddleware, orderController.deleteOrder);

export default router;

import { authMiddleware } from "../middleware/auth.middleware.js";
import cartControllers from "../controllers/cart.controllers.js";
import express from "express";
const router = express.Router();

router.post("/add-to-cart", authMiddleware , cartControllers.addToCart);
router.get("/get-cart", authMiddleware , cartControllers.getCarts);
router.patch("/update-cart/:id", authMiddleware , cartControllers.updateCartItem);
router.delete("/delete-cart/:id", authMiddleware , cartControllers.deleteCart);
router.delete("/clear-cart", authMiddleware , cartControllers.clearCart);

export default router;

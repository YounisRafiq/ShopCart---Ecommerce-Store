import express from "express";
import productControllers from "../controllers/product.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
const router = express.Router();

router.post(
  "/create-product",
  authMiddleware,
  upload.array("images"),
  productControllers.createProduct,
);

router.patch(
  "/update-product/:id",
  authMiddleware,
  productControllers.updateProduct,
);

router.delete(
  "/delete-product/:id",
  authMiddleware,
  productControllers.deleteProduct,
);

router.get("/", productControllers.getAllProducts);
router.get("/:productId", productControllers.getSingleProduct);
router.get("/:category", productControllers.getProductsByCategory);
router.get("/search", productControllers.searchProducts);
router.get("/filter", productControllers.filterProducts);
router.get("/trending-products", productControllers.getTrendingProducts);
router.get("/:productId", productControllers.getRelatedProducts);

export default router;

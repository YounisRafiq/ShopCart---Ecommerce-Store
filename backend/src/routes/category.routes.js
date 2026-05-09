import express from "express";
const router = express.Router();
import categoryControllers from "../controllers/category.controllers.js";
import upload from "../middleware/multer.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

router.post(
  "/create-category",
  authMiddleware,
  upload.single("image"),
  categoryControllers.createCategory,
);

router.get("/get-category" , authMiddleware , categoryControllers.getCategory);
router.patch("/update-category/:id" , authMiddleware , categoryControllers.updateCategory);
router.delete("/delete-category/:id" , authMiddleware)

export default router;

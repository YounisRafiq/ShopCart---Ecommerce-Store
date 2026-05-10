import { authMiddleware } from "../middleware/auth.middleware.js";
import reviewsControllers from "../controllers/reviews.controllers.js";
import express from "express";
const router = express.Router();

router.post("/create-review", authMiddleware , reviewsControllers.createReview);
router.get("/product/all-reviews", authMiddleware , reviewsControllers.getAllReviews);
router.get("/single-review/:id", authMiddleware , reviewsControllers.getSingleReview);
router.patch("/update-review/:id", authMiddleware , reviewsControllers.updateReview);
router.delete("/delete-route/:id", authMiddleware , reviewsControllers.deleteSingleReview);

export default router;

import express from "express"
const router = express.Router();
import authControllers from "../controllers/auth.controllers.js";
import upload from "../middleware/multer.middleware.js";

router.post("/user/register" , upload.single("avatar") ,  authControllers.registerUser)
router.post("/user/login" , authControllers.loginUser)
router.get("/user/logout" , authControllers.logoutUser)

export default router;
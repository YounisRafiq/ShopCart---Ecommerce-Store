import express from "express"
const router = express.Router();
import authControllers from "../controllers/auth.controllers.js";
import upload from "../middleware/multer.middleware.js";

router.post("/user/register" , upload.single("avatar") ,  authControllers.registerUser)

export default router;
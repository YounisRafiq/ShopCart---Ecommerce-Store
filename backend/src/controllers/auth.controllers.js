import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { uploadAvatarToCloudinary } from "../services/service.cloudinary.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    let avatarData = {};

    console.log("File", req.file);

    if (req.file) {
      const result = await uploadAvatarToCloudinary(req.file.path);

      console.log("Result", result);

      avatarData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: avatarData,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      message: "User registered & logged in",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  registerUser,
};

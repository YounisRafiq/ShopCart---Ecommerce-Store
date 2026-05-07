import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { uploadAvatarToCloudinary } from "../services/service.cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required", [
      "All Fields Are Required",
    ]);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists", ["User Already Exist"]);
  }

  let avatarData = {};

  if (req.file) {
    const result = await uploadAvatarToCloudinary(req.file.path);

    avatarData = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar: avatarData,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(201)
    .cookie("token", token, options)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required", [
      "Email and Password are required!!!",
    ]);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.clearCookie("token");
    throw new ApiError(404, "User not found", ["User Not Found"]);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.clearCookie("token");
    throw new ApiError(401, "Email or Password is Invalid", [
      "Email or Password is Invalid",
    ]);
  }

  const token = jwt.sign({ id: user._id , role : user.role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, user, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError(401, "Please Login First", ["Please Login First"]);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decoded.id).select("name email");

  if (!user) {
    throw new ApiError(404, "User not found", ["User not found"]);
  }

  res.clearCookie("token");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      "User LoggedOut Successfully",
    ),
  );
});

export default {
  registerUser,
  loginUser,
  logoutUser,
};

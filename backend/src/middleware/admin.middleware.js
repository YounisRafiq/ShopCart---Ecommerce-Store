import ApiError from "../utils/ApiError";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError(401, "Login required", ["Login required"]);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decoded._id);

  if (!user) {
    throw new ApiError(404, "User Not Found", ["User Not Found"]);
  }

  req.user = user;
  await user.save();
  next();
  
});

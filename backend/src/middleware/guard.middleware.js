import ApiError from "../utils/ApiError";

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access only", ["Admin access only"]);
  }

  next();
};

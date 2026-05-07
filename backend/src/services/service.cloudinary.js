import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "../utils/ApiError.js";

export const initCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export const uploadAvatarToCloudinary = async (avatar) => {
  try {
    console.log("avatar", avatar);

    if (!avatar) return null;
    const response = await cloudinary.uploader.upload(avatar, {
      resource_type: "image",
    });

    fs.unlinkSync(avatar);

    return response;
  } catch (error) {
    console.error("Error uploading avatar to Cloudinary:", error);
    fs.unlinkSync(avatar);
    return null;
  }
};

export const deleteFromCloundinary = async (public_id) => {
  if (!public_id) {
    throw new ApiError(404, "public id not found", ["public id not found"]);
  }

  const result = await cloudinary.uploader.destroy(public_id);

  return result;
};

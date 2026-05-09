import productModel from "../models/product.model.js";
import categoryModel from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadAvatarToCloudinary } from "../services/service.cloudinary.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  const existingCategory = await categoryModel.findOne({ name });

  if (existingCategory) {
    throw new ApiError(400, "Category already exists");
  }

  let image = {};

  if (req.file) {
    const uploadedImage = await uploadAvatarToCloudinary(req.file.path);

    image = {
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    };
  }

  const category = await categoryModel.create({
    name,
    description,
    image,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

const getCategory = asyncHandler(async (req, res) => {
  const categories = await categoryModel.find().sort({ createdAt: -1 });

  if (!categories) {
    throw new ApiError(500, "failed to fetch categories", [
      "failed to fetch categories",
    ]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Successfully fetched categories"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  const { name, description } = req.body;
  const image = req.file;

  const category = await categoryModel.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found", ["Category not found"]);
  }

  if (category.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this category");
  }

  if (name) {
    const existingCategory = await categoryModel.findOne({ name });

    if (existingCategory && existingCategory._id.toString() !== categoryId) {
      throw new ApiError(400, "Category already exists", [
        "Category already exists",
      ]);
    }

    category.name = name;
  }

  if (description) {
    category.description = description;
  }

  if (image) {
    const uploadedImage = await uploadAvatarToCloudinary(image.path);

    category.image = {
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    };
  }

  const updatedCategory = await category.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Category updated successfully"),
    );
});

const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  const user = req.user._id;

  const category = await categoryModel.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "category not found", ["category not found"]);
  }

  if (category.user.toString() !== user.toString()) {
    throw new ApiError(403, "You're not authorize to delete this category");
  }

  const deletedCategory = await categoryModel.findByIdAndDelete(categoryId);

  if (!deletedCategory) {
    throw new ApiError(500, "failed to delete this category", [
      "failed to delete this category",
    ]);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedCategory, "Category deleted successfully"),
    );
});

export default {
  createCategory,
  getCategory,
  updateCategory,
};

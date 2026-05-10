import userModel from "../models/user.model.js";
import reviewModel from "../models/review.model.js";
import productModel from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  const { rating, comment } = req.body;

  const product = await productModel.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const alreadyReviewed = await reviewModel.findOne({
    user: userId,
    product: productId,
  });

  if (alreadyReviewed) {
    throw new ApiError(400, "You already reviewed this product");
  }

  const review = await reviewModel.create({
    user: userId,
    product: productId,
    rating,
    comment,
  });

  const reviews = await reviewModel.find({
    product: productId,
  });

  const totalRatings = reviews.reduce((acc, item) => {
    return acc + item.rating;
  }, 0);

  const averageRating = totalRatings / reviews.length;

  product.averageRating = averageRating;
  product.numReviews = reviews.length;

  await product.save();

  res
    .status(201)
    .json(new ApiResponse(201, review, "Review created successfully"));
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  const product = await productModel.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const reviews = await reviewModel
    .find({ product: productId })
    .populate("user", "name email avatar");

  res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

const getSingleReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.reviewId;

  const review = await reviewModel.findById(reviewId).populate("user", "name");

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, review, "Review fetched successfully"));
});

const updateReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.reviewId;

  const { rating, comment } = req.body;

  const review = await reviewModel.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this review");
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  await review.save();

  const reviews = await reviewModel.find({
    product: review.product,
  });

  const totalRatings = reviews.reduce((acc, item) => {
    return acc + item.rating;
  }, 0);

  const averageRating = totalRatings / reviews.length;

  await productModel.findByIdAndUpdate(review.product, {
    averageRating,
    numReviews: reviews.length,
  });

  res
    .status(200)
    .json(new ApiResponse(200, review, "Review updated successfully"));
});

const deleteSingleReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.reviewId;

  const review = await reviewModel.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this review");
  }

  const productId = review.product;

  await review.deleteOne();

  const reviews = await reviewModel.find({ product: productId });

  const numReviews = reviews.length;

  const averageRating =
    numReviews === 0
      ? 0
      : reviews.reduce((acc, item) => acc + item.rating, 0) / numReviews;

  await productModel.findByIdAndUpdate(productId, {
    averageRating,
    numReviews,
  });

  res.status(200).json(new ApiResponse(200, {}, "Review deleted successfully"));
});

export default {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteSingleReview,
};

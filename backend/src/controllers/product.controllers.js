import productModel from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  uploadAvatarToCloudinary,
  deleteFromCloundinary,
} from "../services/service.cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, discountPrice, stock, category , isFeatured } =
    req.body;

  if (!title || !description || !price || !category) {
    throw new ApiError(
      400,
      "title , description , category and price are required fields",
      ["title , description , category and price are required fields"],
    );
  }

  console.log("title :", title, "Description :", description);

  console.log("User :", req.user);

  const user = req.user.id;

  if (!user) {
    throw new ApiError(404, "User Not Found !!! Not LoggedIn", [
      "User Not Found !!! Not LoggedIn",
    ]);
  }

  const images = req.files;

  if (!images || images.length === 0) {
    throw new ApiError(400, "At least 1 image is required", [
      "images are required",
    ]);
  }

  if (images.length > 5) {
    throw new ApiError(400, "Maximum 5 images are allowed", [
      "images limit exceeded",
    ]);
  }

  const uploadedImages = [];

  for (let i = 0; i < images.length; i++) {
    const result = await uploadAvatarToCloudinary(images[i].path);

    uploadedImages.push({
      url: result.url,
      public_id: result.public_id,
    });
  }

  const product = await productModel.create({
    title: title,
    description: description,
    price: price,
    stock: stock,
    discountPrice: discountPrice,
    category: category,
    isFeatured : isFeatured,
    images: uploadedImages,
  });

  if (!product) {
    throw new ApiError(
      500,
      "Something went wrong while creating your product",
      ["Something went wrong while creating your product"],
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "product created successfully", [
        "product created successfully",
      ]),
    );
});

const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    throw new ApiError(404, "productid not found", ["productid not found"]);
  }

  const product = await productModel.findById(productId);

  if (!product) {
    throw new ApiError(404, "product not found", ["product not found"]);
  }

  const user = req.user.id;

  if (!user) {
    throw new ApiError(401, "Please Login First", ["Please Login First"]);
  }

  if (product.user.toString() !== user.toString()) {
    throw new ApiError(403, "Unauthorized access", ["Unauthorized access"]);
  }

  const { title, description, price, stock, discountPrice, category } =
    req.body;

  product.title = title || product.title;
  product.description = description || product.description;
  product.price = price || product.price;
  product.stock = stock || product.stock;
  product.discountPrice = discountPrice || product.discountPrice;
  product.category = category || product.category;

  const images = req.files;

  if (images && images.length > 0) {
    if (images.length > 5) {
      throw new ApiError(400, "Maximum 5 images are allowed", [
        "images limit exceeded",
      ]);
    }

    const uploadedImages = [];

    for (let i = 0; i < images.length; i++) {
      const result = await uploadAvatarToCloudinary(images[i].path);

      uploadedImages.push({
        url: result.url,
        public_id: result.public_id,
      });
    }

    product.images = uploadedImages;
  }

  await product.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product updated successfully", [
        "Product updated successfully",
      ]),
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    throw new ApiError(404, "productid not found", ["productid not found"]);
  }

  const product = await productModel.findById(productId);

  if (!product) {
    throw new ApiError(404, "product not found", ["product not found"]);
  }

  const user = req.user.id;

  if (!user) {
    throw new ApiError(401, "Please Login First", ["Please Login First"]);
  }

  if (product.user.toString() !== user.toString()) {
    throw new ApiError(403, "Unauthorized access", ["Unauthorized access"]);
  }

  if (product.images && product.images.length > 0) {
    for (let i = 0; i < product.images.length; i++) {
      const image = product.images[i];

      await deleteFromCloundinary(image.public_id);
    }
  }

  await product.deleteOne();

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product deleted successfully", [
        "Product deleted successfully",
      ]),
    );
});

const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page,
    limit = 20,
    sortBy = "createdAt",
    order = "desc",
    category,
  } = req.query;

  let filter = {};

  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }

  const sortOrder = {};
  sortOrder[sortBy] = order === "asc" ? 1 : -1;

  let query = productModel.find(filter).sort(sortOrder);

  // 🔥 pagination only when page exists
  if (page) {
    const skip = (Number(page) - 1) * Number(limit);
    query = query.skip(skip).limit(Number(limit));
  }

  const products = await query;
  const totalProducts = await productModel.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        totalProducts,
        currentPage: page ? Number(page) : null,
        totalPages: page ? Math.ceil(totalProducts / limit) : 1,
      },
      "Products fetched successfully"
    )
  );
});

const getSingleProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    throw new ApiError(404, "product id not found", ["product id not found"]);
  }

  const product = await productModel.findById(productId);

  if (!product) {
    throw new ApiError(404, "product not found", ["product not found"]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "single product fetched successfully"));
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  if (!category) {
    throw new ApiError(400, "Category is required", ["Category is required"]);
  }

  const products = await productModel.find({
    category: category,
  });

  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found in this category", [
      "No products found in this category",
    ]);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "Products fetched by category successfully")
    );
});

const searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    throw new ApiError(400, "Search query is required", [
      "Search query is required",
    ]);
  }

  const products = await productModel.find({
    name: {
      $regex: query,
      $options: "i",
    },
  });

  if (!products.length) {
    throw new ApiError(404, "No products found", ["No products found"]);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "Products searched successfully")
    );
});

const filterProducts = asyncHandler(async (req, res) => {
  const { brand, minPrice, maxPrice, rating , category } = req.query;

  let filter = {};

  if (brand) {
    filter.brand = {
      $regex: brand,
      $options: "i",
    };
  }

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  if(category){
    filter.category = {
      $regex : category,
      $options : "i"
    }
  }

  if (rating) {
    filter.rating = {
      $gte: Number(rating),
    };
  }

  const products = await productModel.find(filter);

  if (!products.length) {
    throw new ApiError(404, "No products found", [
      "No products found",
    ]);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "Products filtered successfully")
    );
});

const getTrendingProducts = asyncHandler(async (req, res) => {
  const products = await productModel
    .find()
    .sort({ soldCount: -1 }) 
    .limit(10);

  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "Trending products fetched successfully")
    );
});

const getRelatedProducts = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await productModel.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found", ["Product not found"]);
  }

  const relatedProducts = await productModel.find({
    category: product.category,
    _id: { $ne: productId }, 
  }).limit(20);

  return res
    .status(200)
    .json(
      new ApiResponse(200, relatedProducts, "Related products fetched successfully")
    );
});

export default {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  getProductsByCategory,
  searchProducts,
  filterProducts,
  getTrendingProducts,
  getRelatedProducts
};

import cartModel from "../models/cart.model";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler";

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity = 1 } = req.body;

  const product = await productModel.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await cartModel.findOne({ user: userId });

  if (!cart) {
    cart = await cartModel.create({
      user: userId,
      items: [
        {
          product: productId,
          quantity,
          price: product.price,
        },
      ],
    });

    return res
      .status(201)
      .json(new ApiResponse(201, cart, "Product added to cart"));
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart updated successfully"));
});

const getCarts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const carts = await cartModel.find({ user: userId });
  if (!carts || carts.length === 0) {
    throw new ApiError(404, "Carts not found yet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, carts, "carts fetched successfully"));
});

const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;
  const { quantity } = req.body;

  const cart = await cartModel.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.find((i) => i.product.toString() === productId);

  if (!item) {
    throw new ApiError(404, "Product not found in cart");
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart updated successfully"));
});

const deleteCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await cartModel.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  await cartModel.findByIdAndDelete(cart._id);

  return res.status(200).json(
    new ApiResponse(200, null, "Cart deleted successfully")
  );
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await cartModel.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = [];

  await cart.save();

  return res.status(200).json(
    new ApiResponse(200, cart, "Cart cleared successfully")
  );
});

export default {
  addToCart,
  getCarts,
  updateCartItem,
  deleteCart,
  clearCart
};

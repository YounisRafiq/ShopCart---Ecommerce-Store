import mongoose from "mongoose";
import productModel from "../models/product.model.js";
import orderModel from "../models/order.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createOrder = asyncHandler(async (req, res) => {
  const { products, shippingAddress, paymentMethod } = req.body;

  if (!products || products.length === 0) {
    throw new ApiError(400, "Products are required");
  }

  if (!shippingAddress) {
    throw new ApiError(400, "Shipping address is required");
  }

  let totalAmount = 0;

  const populatedProducts = [];

  for (let item of products) {
    const product = await productModel.findById(item.product);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.title}`);
    }

    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    populatedProducts.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });

    product.stock -= item.quantity;
    await product.save();
  }

  const order = await orderModel.create({
    user: req.user._id,
    products: populatedProducts,
    shippingAddress,
    paymentMethod,
    totalAmount,
    status: "pending",
    paymentStatus: "unpaid",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

const getSingleOrder = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const order = await orderModel.findById(id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You're not allowed to access this order", [
      "You're not allowed to view this order",
    ]);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, order, "order fetched successfully"));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await orderModel
    .find({ user: userId })
    .sort({ createdAt: -1 });

  if (!orders) {
    throw new ApiError(404, "orders not found", ["orders not found"]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Orders fetched successfully"));
});

const updateOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new ApiError(404, "order not found", ["order not found"]);
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You're not allowed to access this order", [
      "You're not allowed to access this order",
    ]);
  }

  if (order.status === "delivered") {
    throw new ApiError(400, "Delivered prodcuts can't be updated");
  }

  if (order.status === "shipped") {
    throw new ApiError(400, "Shipped order can't be cancelled");
  }

  const { status, shippingAddress } = req.body;

  if (status) {
    order.status = status;
  }
  if (shippingAddress) {
    order.shippingAddress = shippingAddress;
  }

  const updatedOrder = await order.save();

  return res
    .status(201)
    .json(
      new ApiResponse(201, updatedOrder, "Order details updated successfully"),
    );
});

const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const user = req.user._id;

  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found", ["Order not found"]);
  }

  if (order.user.toString() !== user.toString()) {
    throw new ApiError(403, "You're not allowed to delete this order", [
      "You're not allowed to delete this order",
    ]);
  }

  if (order.status === "delivered") {
    throw new ApiError(400, "Delivered products can't be deleted!!!");
  }
  if (order.status === "shipped") {
    throw new ApiError(400, "shipped products can't be deleted!!!");
  }

  for (let item of order.products) {
    const product = await productModel.findById(item.product);

    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  order.status = "cancelled";

  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "order cancelled successfully"));
});

export default {
  createOrder,
  getSingleOrder,
  getMyOrders,
  updateOrder,
  deleteOrder
};

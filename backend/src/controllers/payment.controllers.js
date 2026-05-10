import paymentModel from "../models/payment.model.js";
import orderModel from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPayment = asyncHandler(async (req, res) => {
  const { orderId, method } = req.body;

  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order Not Found", ["Order Not Found"]);
  }

  if (order.paymentStatus === "paid") {
    throw new ApiError(400, "Order is already paid", ["Order is already paid"]);
  }

  const existingPayment = await paymentModel.findOne({ order: orderId });

  if (existingPayment && existingPayment.status === "pending") {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          existingPayment,
          "Payment already initiated for this order",
        ),
      );
  }

  const payment = await paymentModel.create({
    user: req.user._id,
    order: orderId,
    amount: order.totalAmount,
    method: method || "COD",
    status: "pending",
  });

  if (!payment) {
    throw new ApiError(500, "failed to create payment", [
      "failed to create payment",
    ]);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, payment, "payment created successfully"));
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId, status } = req.body;

  const payment = await paymentModel.findById(paymentId);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.status === "paid") {
    return res
      .status(200)
      .json(new ApiResponse(200, payment, "Payment already verified"));
  }

  if (status === "failed") {
    payment.status = "failed";
    await payment.save();

    return res
      .status(200)
      .json(new ApiResponse(200, payment, "Payment failed"));
  }

  payment.status = "paid";
  await payment.save();

  const order = await orderModel.findById(payment.order);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.paymentStatus = "paid";
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, payment, "Payment verified successfully"));
});

const getPaymentStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const payment = await paymentModel.findOne({ order: orderId });

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {
      paymentId: payment._id,
      orderId: payment.order,
      amount: payment.amount,
      status: payment.status,
      method: payment.method,
    }),
  );
});

const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await paymentModel
    .find({ user: req.user._id })
    .populate("order", "amount status")
    .sort({ createdAt: -1 });

  if (!payments) {
    throw new ApiError(500, "failed to fetch payments", [
      "failed to fetch payments",
    ]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, payments, "payments fetched successfully"));
});

export default {
  createPayment,
  verifyPayment,
  getPaymentStatus,
  getAllPayments
};

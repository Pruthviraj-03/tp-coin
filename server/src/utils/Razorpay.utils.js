import Razorpay from "razorpay";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const razorpayPayment = asyncHandler(async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    if (!req.body) {
      throw new ApiError(400, "Bad request");
    }

    const { amount, currency, receipt } = req.body;

    const options = {
      amount: amount,
      currency: currency,
      receipt: receipt,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      throw new ApiError(500, "order is not there");
    }

    res.json(new ApiResponse(200, { order }, "Payment successful"));
    console.log("Payment successful");
  } catch (error) {
    console.error("Error during payment process:", error);
    throw new ApiError(500, error.message || "Failed in payment process");
  }
});

export { razorpayPayment };

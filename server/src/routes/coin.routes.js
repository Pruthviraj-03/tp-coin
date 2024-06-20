import { Router } from "express";
import { authMiddleWare } from "../middlewares/auth.middleware.js";
import {
  getPortfolio,
  buyCoins,
  sellCoins,
} from "../controllers/coin.controller.js";
import { razorpayPayment } from "../utils/Razorpay.utils.js";

const router = Router();

router.route("/getPortfolio").get(authMiddleWare, getPortfolio);

router.route("/buyCoins").post(authMiddleWare, buyCoins);

router.post("/sellCoins/:coinId/:quantity", authMiddleWare, sellCoins);

router.route("/razorpay/payment").post(razorpayPayment);

export { router };

import { Router } from "express";
import { authMiddleWare } from "../middlewares/auth.middleware.js";
import {
  getPortfolio,
  buyCoins,
  removeCoins,
  sellCoins,
  updateCoins,
} from "../controllers/coin.controller.js";
import { razorpayPayment } from "../utils/Razorpay.utils.js";

const router = Router();

router.route("/getPortfolio").get(authMiddleWare, getPortfolio);

router.route("/buyCoins").post(authMiddleWare, buyCoins);

router.route("/removeCoins").post(authMiddleWare, removeCoins);

router.route("/sellCoins").post(authMiddleWare, sellCoins);

router.route("/updateCoins").post(authMiddleWare, updateCoins);

router.route("/razorpay/payment").post(razorpayPayment);

export { router };

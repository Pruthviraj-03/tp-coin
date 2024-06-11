import { Router } from "express";
import { authMiddleWare } from "../middlewares/auth.middleware.js";
import {
  buyCoins,
  getPortfolio,
  removeCoins,
  sellCoins,
  updateCoins,
} from "../controllers/coin.controller.js";

const router = Router();

router.route("/buyCoins").post(authMiddleWare, buyCoins);

router.route("/getPortfolio").get(authMiddleWare, getPortfolio);

router.route("/removeCoins").post(authMiddleWare, removeCoins);

router.route("/sellCoins").post(authMiddleWare, sellCoins);

router.route("/updateCoins").post(authMiddleWare, updateCoins);

export { router };

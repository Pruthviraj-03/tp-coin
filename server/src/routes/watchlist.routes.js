import { Router } from "express";
import { authMiddleWare } from "../middlewares/auth.middleware.js";
import {
  addToWatchlist,
  getWatchlist,
  removeAllWatchlist,
  removeFromWatchlist,
} from "../controllers/watchlist.controller.js";

const router = Router();

router.route("/addToWatchlist").post(authMiddleWare, addToWatchlist);

router.route("/getWatchlist").get(authMiddleWare, getWatchlist);

router.route("/removeAllWatchlist").get(authMiddleWare, removeAllWatchlist);

router.route("/removeFromWatchlist").post(authMiddleWare, removeFromWatchlist);

export { router };

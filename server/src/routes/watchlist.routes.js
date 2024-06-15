import { Router } from "express";
import { authMiddleWare } from "../middlewares/auth.middleware.js";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  removeAllWatchlist,
} from "../controllers/watchlist.controller.js";

const router = Router();

router.route("/getWatchlist").get(authMiddleWare, getWatchlist);

router.route("/addWatchlistCoin").post(authMiddleWare, addToWatchlist);

router
  .route("/removeWatchlistCoin/:coinName")
  .delete(authMiddleWare, removeFromWatchlist);

router.route("/removeAllWatchlist").delete(authMiddleWare, removeAllWatchlist);

export { router };

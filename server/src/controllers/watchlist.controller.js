import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { User } from "../models/user.model.js";

const getWatchlist = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("watchlists");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const userWatchlist = user.watchlists;

    res.json(
      new ApiResponse(
        200,
        { userWatchlist },
        "Get watchlist data successfully!"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to get watchlist data!");
  }
});

const addToWatchlist = asyncHandler(async (req, res) => {
  try {
    const { coin } = req.body;

    if (!coin) {
      throw new Error("Coin data is missing in the request body");
    }

    const watchlistCoin = {
      watchlist_coinId: coin.watchlist_coinId,
      watchlist_image: coin.watchlist_image,
      watchlist_symbol: coin.watchlist_symbol,
      watchlist_name: coin.watchlist_name,
    };

    const user = await User.findById(req.user.id);

    if (user) {
      throw new ApiError(404, "User not found!");
    }

    await user.addToWatchlist(watchlistCoin);

    res.json(
      new ApiResponse(
        200,
        { user },
        "Coin added to watchlist, please check watchlist!"
      )
    );
  } catch (error) {
    res
      .status(401)
      .json(
        new ApiError(401, error.message || "Failed to add coin to watchlist!")
      );
  }
});

const removeFromWatchlist = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    const { coinName } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const updatedWatchlists = await user.removeFromWatchlist(coinName);

    res.json(
      new ApiResponse(
        200,
        { watchlists: updatedWatchlists },
        "Coin removed from watchlist, please check watchlist!"
      )
    );
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Failed to remove coin from watchlist!"
    );
  }
});

const removeAllWatchlist = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.watchlists = [];
    await user.save();

    res.json(
      new ApiResponse(
        200,
        { watchlists: user.watchlists },
        "Watchlist is empty now!"
      )
    );
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Failed to remove watchlist data!"
    );
  }
});

export {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  removeAllWatchlist,
};

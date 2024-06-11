import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { User } from "../models/user.model.js";

const addToWatchlist = asyncHandler(async (req, res) => {
  try {
    const {
      watchlist_coinId,
      watchlist_image,
      watchlist_symbol,
      watchlist_name,
    } = req.body;

    const watchlistCoins = {
      watchlist_coinId,
      watchlist_image,
      watchlist_symbol,
      watchlist_name,
    };

    const loginUser = await User.findById(req.user.id);
    loginUser.watchlists.unshift(watchlistCoins);
    await loginUser.save();
    res.json(
      new ApiResponse(
        200,
        { loginUser },
        "Coin added to watchlist, please check watchlist!"
      )
    );
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Failed to added coins in watchlist!"
    );
  }
});

const getWatchlist = asyncHandler(async (req, res) => {
  try {
    const userProfile = await User.findById(req.user.id);

    userProfile.passwords = undefined;
    res.json(
      new ApiResponse(200, { userProfile }, "Get watchlist data successfully!")
    );
  } catch (error) {
    throw new ApiError(401, error?.message || "Failed to get watchlist data!");
  }
});

const removeAllWatchlist = asyncHandler(async (req, res) => {
  try {
    const loginUser = await User.findById(req.user.id);

    await User.findOneAndUpdate(
      {
        email: loginUser.email,
      },
      {
        watchlists: [],
      }
    );
    res.json(new ApiResponse(200, { loginUser }, "Watchlist is empty now!"));
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Failed to remove watchlist data!"
    );
  }
});

const removeFromWatchlist = asyncHandler(async (req, res) => {
  try {
    const {
      watchlist_coinId,
      watchlist_image,
      watchlist_symbol,
      watchlist_name,
    } = req.body;
    const loginUser = await User.findById(req.user.id);

    const watchlistCoins = {
      watchlist_coinId,
      watchlist_image,
      watchlist_symbol,
      watchlist_name,
    };

    await User.findOneAndUpdate(
      {
        email: loginUser.email,
      },
      {
        $pull: {
          watchlists: watchlistCoins,
        },
      }
    );
    res.json(
      new ApiResponse(
        200,
        { loginUser },
        "coin removed from watchlist, please check watchlist!"
      )
    );
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Failed to remove coin from watchlist!"
    );
  }
});

export {
  addToWatchlist,
  getWatchlist,
  removeAllWatchlist,
  removeFromWatchlist,
};

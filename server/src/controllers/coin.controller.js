import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { User } from "../models/user.model.js";

const getPortfolio = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("myCoins");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const userPortfolio = user.myCoins;

    res.json(
      new ApiResponse(
        200,
        { userPortfolio },
        "Get watchlist data successfully!"
      )
    );
  } catch (error) {
    throw new ApiError(401, error?.message || "Failed get portfolio data!");
  }
});

const buyCoins = asyncHandler(async (req, res) => {
  try {
    const { coin } = req.body;

    if (!coin) {
      throw new Error("Coin data is missing in the request body");
    }

    const addCoin = {
      coinId: coin.coinId,
      image: coin.image,
      symbol: coin.symbol,
      name: coin.name,
      quantity: coin.quantity,
      paymentToken: coin.paymentToken,
    };

    const user = await User.findById(req.user.id);

    if (user) {
      throw new ApiError(404, "User not found!");
    }

    await user.buyCoin(addCoin);

    res.json(new ApiResponse(200, { user }, "Coin buy Successfully !"));
  } catch (error) {
    res
      .status(401)
      .json(new ApiError(401, error.message || "Failed to buy coin!"));
  }
});

const removeCoins = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: {
        myCoins: { name: req.body.name },
      },
    });
  } catch (error) {
    throw new ApiError(401, error?.message || "Failed get remove coins!");
  }
});

const sellCoins = asyncHandler(async (req, res) => {
  try {
    const loginUser = await User.findById(req.user.id);
    const userRes = loginUser.myCoins.find(
      (e) => e.name === req.body.coins.name
    );
    userRes.quantity = req.body.coins.quantity;
    await loginUser.save();
    res.json(new ApiResponse(200, { loginUser }, "Coin sell Successfully!"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Failed to sell the coins!");
  }
});

const updateCoins = asyncHandler(async (req, res) => {
  try {
    const loginUser = await User.findById(req.user.id);
    const userRes = loginUser.myCoins.find(
      (e) => e.name === req.body.myCoins.name
    );
    userRes.quantity = req.body.myCoins.quantity;
    await loginUser.save();
    res.json(new ApiResponse(200, { loginUser }, "Coin buy Successfully!"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Failed to buy the coins!");
  }
});

export { getPortfolio, buyCoins, removeCoins, sellCoins, updateCoins };

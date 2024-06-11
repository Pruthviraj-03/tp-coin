import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { User } from "../models/user.model.js";

const buyCoins = asyncHandler(async (req, res) => {
  try {
    const loginUser = await User.findById(req.user.id);
    loginUser.myCoins.unshift(req.body.myCoins);
    await loginUser.save();
    res.json(new ApiResponse(200, { loginUser }, "Coin buy Successfully!"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Failed to buy coin!");
  }
});

const getPortfolio = asyncHandler(async (req, res) => {
  try {
    const userProfile = await User.findById(req.user.id);
    userProfile.passwords = undefined;
    res.json(
      new ApiResponse(200, { userProfile }, "Get portfolio data Successfully!")
    );
  } catch (error) {
    throw new ApiError(401, error?.message || "Failed get portfolio data!");
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

export { buyCoins, getPortfolio, removeCoins, sellCoins, updateCoins };

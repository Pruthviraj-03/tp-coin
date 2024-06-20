import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import dotenv from "dotenv";
import { mailHelper } from "../utils/MailHelper.utils.js";
import { CookieToken } from "../utils/CookieToken.utils.js";

dotenv.config({
  path: "./.env",
});

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const generateAccessAndRefreshTokens = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        reject(new Error("User not found"));
        return;
      }

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;

      await user.save({ validateBeforeSave: false });

      const tokens = { accessToken, refreshToken };
      resolve(tokens);
    } catch (error) {
      reject(error);
    }
  });
};

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?.id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or invalid");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const userLogin = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select(
      "-googleId -accessToken -refreshToken -otp -otpExpires"
    );

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    res.json(new ApiResponse(200, { user }, "User data found"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to fetch user data");
  }
});

const sendDetailToDB = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    let user = await User.findById(userId);

    const { email, name, phoneNumber } = req.body;

    if (!user) {
      user = new User({
        _id: userId,
        email,
        name,
        phoneNumber,
      });
    } else {
      user.email = email || user.email;
      user.name = name || user.name;
      user.phoneNumber = phoneNumber || user.phoneNumber;
    }

    await user.save();

    res.json(
      new ApiResponse(200, { user }, "User details saved successfully.")
    );
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to save the details.");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        throw new ApiError(401, err?.message || "Failed to logout");
      }

      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      };

      res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .clearCookie("userId", options)
        .clearCookie("user", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
    });
  } catch (error) {
    throw new ApiError(401, error?.message || "Failed to logout");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await User.findByIdAndDelete(req.user.id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    };

    await mailHelper({
      email,
      subject: "Account Delete At TP-Coin",
      message:
        "You've successfully Deleted your account at TP-Coin India's leading Crypto Currency Exchange!",
      htmlMessage:
        "<p>You've successfully Deleted your account at TP-Coin India's leading Crypto Currency Exchange!</p>",
    });

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .clearCookie("userId", options)
      .clearCookie("user", options)
      .json(new ApiResponse(200, {}, "Account deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to delete user account");
  }
});

const sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const formattedPhoneNumber = phoneNumber.startsWith("+91")
      ? phoneNumber
      : `+91${phoneNumber}`;

    if (!/^\+91\d{10}$/.test(formattedPhoneNumber)) {
      throw new ApiError(400, "Invalid phone number format");
    }

    let user = await User.findOne({ phoneNumber: phoneNumber });

    if (!user) {
      user = new User({ phoneNumber: phoneNumber });
    }

    const otp = user.generateOtp();
    await user.save();

    await client.messages.create({
      body: `[#] ${otp} is your OTP to login/register to TP-COIN. DO NOT share with anyone. TP-COIN never calls to ask for OTP. The otp expires in 10 mins.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhoneNumber,
    });

    res.json(new ApiResponse(200, {}, "OTP sent successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to send the otp");
  }
};

const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({
      phoneNumber,
    }).select("+otp +otpExpires");

    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const tokens = await generateAccessAndRefreshTokens(user);
    CookieToken(user, res, tokens);

    await client.messages.create({
      body: "You successfully logged in at TP-COIN!",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`,
    });

    res.json(new ApiResponse(200, { user }, "OTP verify successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to verify the otp");
  }
});

const resendOTP = asyncHandler(async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const otp = user.generateOtp();
    await user.save();

    await client.messages.create({
      body: `Your new OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    res.json(new ApiResponse(200, {}, "OTP resent successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to resend the otp");
  }
});

export {
  generateAccessAndRefreshTokens,
  refreshAccessToken,
  userLogin,
  sendDetailToDB,
  logoutUser,
  deleteUser,
  sendOTP,
  verifyOTP,
  resendOTP,
};

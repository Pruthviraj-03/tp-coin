import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import dotenv from "dotenv";
import { mailHelper } from "../utils/MailHelper.utils.js";
import { CookieToken } from "../utils/CookieToken.utils.js";
import cloudinary from "cloudinary";

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
      "-googleId -picture -accessToken -refreshToken -otp -otpExpires"
    );

    if (!user) {
      throw new ApiError(401, "User not found");
    }
    // console.log("User not found");

    res.json(new ApiResponse(200, { user }, "User data found"));
    // console.log("User data found", user);
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to fetch user data");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.log("Failed to logout:", err);
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
      // console.log("User logged out successfully");
    });
  } catch (error) {
    console.log("Failed to logout:", error);
    throw new ApiError(401, error?.message || "Failed to logout");
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

    // Proceed with OTP generation and sending
    let user = await User.findOne({ phoneNumber: phoneNumber });

    if (!user) {
      user = new User({ phoneNumber: phoneNumber });
    }

    const otp = user.generateOtp();
    await user.save();
    console.log("user is:", user);

    // await client.messages.create({
    //   body: `[#] ${otp} is your OTP to login/register to Modazen. DO NOT share with anyone. Modazen never calls to ask for OTP. The otp expires in 10 mins.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: formattedPhoneNumber,
    // });

    res.json(new ApiResponse(200, {}, "OTP sent successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to send the otp");
  }
};

const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // console.log("number is:", phoneNumber, "and", "otp is:", otp);

    const user = await User.findOne({
      phoneNumber,
    }).select("+otp +otpExpires");

    // console.log("user otp is:", user);

    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      // console.log("Invalid or expired otp");
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Clear the OTP and OTP expiration
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const tokens = await generateAccessAndRefreshTokens(user);
    // console.log("Generated tokens:", tokens);
    CookieToken(user, res, tokens);

    // await client.messages.create({
    //   body: "You successfully logged in at Modazen!",
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: `+91${phoneNumber}`,
    // });

    // Redirect to the homepage (assuming this is an API endpoint)
    res.json(new ApiResponse(200, { user }, "OTP verify successfully"));
    // console.log("otp verified successfully");
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

const sendEmail = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    await mailHelper({
      email,
      subject: "Welcome to ModaZen Newsletter!",
      message: "Thank you for subscribing to our newsletter!",
      htmlMessage: "<p>Thank you for subscribing to our newsletter!</p>",
    });

    res.json(new ApiResponse(200, { email }, "Email send successfully."));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to send an email.");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const imageID = user.profilePic.id;
    await cloudinary.v2.uploader.destroy(imageID);

    await User.findByIdAndRemove(req.user.id);

    res.clearCookie("token");

    await mailHelper({
      email: user.email,
      subject: "Account Delete At TP-Coin",
      message:
        "You've successfully Deleted your account at TP-Coin India's leading Crypto Currency Exchange!",
      htmlMessage:
        "<p>You've successfully Deleted your account at TP-Coin India's leading Crypto Currency Exchange!</p>",
    });

    res.json(new ApiResponse(200, {}, "Account deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to delete user account");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const userProfile = await User.findById(req.user.id);

    userProfile.passwords = undefined;

    res.json(
      new ApiResponse(200, { userProfile }, "Get user data successfully")
    );
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to get user data");
  }
});

const editUserProfile = asyncHandler(async (req, res) => {
  try {
    const newData = {
      fullName: req.body.fullName,
      email: req.body.email,
      contactNo: req.body.contactNo,
    };

    if (req.files) {
      const user = await User.findById(req.user.id);

      const imageID = user.profilePic.id;
      await cloudinary.v2.uploader.destroy(imageID);

      const result = await cloudinary.v2.uploader.upload(
        req.files.profilePic.tempFilePath,
        {
          folder: "users",
          width: 150,
          crop: "scale",
        }
      );

      newData.profilePic = {
        id: result.public_id,
        secure_url: result.secure_url,
      };
    }

    await User.findByIdAndUpdate(req.user.id, newData, {
      new: true,
      reunValidators: true,
      useFindAndModify: false,
    });

    res.json(new ApiResponse(200, {}, "Details Changed successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Failed to change the user details"
    );
  }
});

export {
  generateAccessAndRefreshTokens,
  logoutUser,
  refreshAccessToken,
  sendOTP,
  verifyOTP,
  resendOTP,
  sendEmail,
  userLogin,
  deleteUser,
  getUserProfile,
  editUserProfile,
};

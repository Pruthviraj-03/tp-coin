import { ApiError } from "../utils/ApiError.utils.js";
import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const authMiddleWare = asyncHandler(async (req, res, next) => {
  try {
    console.log("cookie:", req.cookies);
    const token = req.cookies.accessToken || req.cookies.tokens.accessToken;
    console.log("token:", token);
    if (!token) {
      console.log("Login first to access this page!");
      throw new ApiError(401, "Login first to access this page!");
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new ApiError(401, "Invalid or expired token");
    }

    const user = await User.findById(decodedToken.id).select("-refreshToken");
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Authentication error");
  }
});

export { authMiddleWare };

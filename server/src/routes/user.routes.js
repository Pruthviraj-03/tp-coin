import { Router } from "express";
import {
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
  sendDetailToDB,
} from "../controllers/user.controller.js";
import { razorpayPayment } from "../utils/Razorpay.utils.js";
import { authMiddleWare } from "../middlewares/auth.middleware.js";
import passport from "passport";
import("../utils/Passport.utils.js");
const router = Router();

router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.route("/google/callback").get(
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/login",
  })
);

router.route("/login/success").get(authMiddleWare, userLogin);

router.route("/logout").get(authMiddleWare, logoutUser);

router.route("/send-otp").post(sendOTP);

router.route("/verify-otp").post(verifyOTP);

router.route("/resend-otp").post(resendOTP);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/subscribe").post(sendEmail);

router.route("/razorpay/payment").post(authMiddleWare, razorpayPayment);

router.route("/deleteUser").delete(authMiddleWare, deleteUser);

router.route("/getUserProfile").get(authMiddleWare, getUserProfile);

router.route("/editUserProfile").post(authMiddleWare, editUserProfile);

router.route("/editprofile").post(authMiddleWare, sendDetailToDB);

export { router };

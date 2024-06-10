import { Router } from "express";
import {
  logoutUser,
  refreshAccessToken,
  sendOTP,
  verifyOTP,
  resendOTP,
  sendEmail,
  sendDetailToDB,
  userLogin,
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

router.route("/editprofile").post(authMiddleWare, sendDetailToDB);

router.route("/razorpay/payment").post(razorpayPayment);

export { router };

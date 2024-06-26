import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import { mailHelper } from "./MailHelper.utils.js";
import { CookieToken } from "./CookieToken.utils.js";
import { generateAccessAndRefreshTokens } from "../controllers/user.controller.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://tp-coin-api.vercel.app/api/v1/users/google/callback",
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : "";

        let user = await User.findOne({ email });

        if (!user) {
          const name = profile.displayName || "";
          const picture =
            profile.photos && profile.photos.length > 0
              ? profile.photos[0].value
              : "";
          user = new User({
            googleId: profile.id,
            email,
            name,
            picture,
            accessToken,
            refreshToken,
          });
          await user.save();

          await mailHelper({
            email,
            subject: "Login At Tp-Coin",
            message:
              "You've successfully Login at TP-Coin India's leading Crypto Currency Exchange!",
            htmlMessage:
              "<p>You've successfully Login at TP-Coin India's leading Crypto Currency Exchange!</p>",
          });
        }

        const tokens = await generateAccessAndRefreshTokens(user);
        CookieToken(user, req.res, tokens);

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

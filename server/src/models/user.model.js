import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    picture: { type: String },
    phoneNumber: {
      type: String,
    },
    accessToken: { type: String },
    refreshToken: { type: String },
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    myCoins: [
      {
        coinId: {
          type: String,
        },
        image: {
          type: String,
        },
        symbol: {
          type: String,
        },
        name: {
          type: String,
        },
        quantity: {
          type: Number,
        },
        paymentToken: {
          type: String,
        },
      },
    ],
    watchlists: [
      {
        watchlist_coinId: {
          type: String,
        },
        watchlist_image: {
          type: String,
        },
        watchlist_symbol: {
          type: String,
        },
        watchlist_name: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  try {
    return jwt.sign(
      { id: this._id, email: this.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
  } catch (error) {
    throw new Error("Error generating access token");
  }
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  try {
    return jwt.sign(
      { id: this._id, email: this.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
  } catch (error) {
    throw new Error("Error generating refresh token");
  }
};

// Generate OTP
userSchema.methods.generateOtp = function () {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    this.otp = otp;
    this.otpExpires = new Date(Date.now() + 10 * 60000);
    return otp;
  } catch (error) {
    throw new Error("Error generating OTP");
  }
};

// Add to Watchlist
userSchema.methods.addToWatchlist = async function (coin) {
  const existingCoin = this.watchlists.find(
    (coin) => coin.watchlist_coinId === coin.watchlist_coinId
  );
  if (!existingCoin) {
    this.watchlists.push(coin);
    await this.save();
  } else {
    throw new Error("Coin already exists in watchlist");
  }
};

// Remove from Watchlist
userSchema.methods.removeFromWatchlist = async function (coinName) {
  try {
    this.watchlists = this.watchlists.filter(
      (coin) => coin.watchlist_name !== coinName
    );
    await this.save();
    return this.watchlists;
  } catch (error) {
    throw new Error("Failed to remove coin from watchlists");
  }
};

// Add to cart
userSchema.methods.addToCart = async function (product) {
  if (!this.cart.includes(product)) {
    this.cart.push(product);
    await this.save();
  }
};

// Remove from cart
userSchema.methods.removeFromCart = async function (productId) {
  try {
    this.cart = this.cart.filter((product) => product.id !== productId);
    await this.save();
    return this.cart;
  } catch (error) {
    throw new Error("Failed to remove product from wishlist");
  }
};

const User = mongoose.model("User", userSchema);

export { User };

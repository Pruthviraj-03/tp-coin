import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const CookieToken = (user, res, tokens) => {
  if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
    // console.log("Tokens are undefined");
    throw new Error("Tokens are undefined");
  }

  const { accessToken, refreshToken } = tokens;

  const expirationTimeMs =
    parseInt(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000;
  const expirationDate = new Date(Date.now() + expirationTimeMs);

  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    expires: expirationDate,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  };

  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  console.log(user.phoneNumber, "registered successfully");
  console.log("Received tokens:", tokens);
};

export { CookieToken };

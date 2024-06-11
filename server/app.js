import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import("./src/utils/Passport.utils.js");
import twilio from "twilio";

// Load environment variables
dotenv.config({
  path: "./.env",
});

// Initialize Express app
const app = express();

// Configure middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

//routes import
import { router as userRouter } from "./src/routes/user.routes.js";
import { router as coinRouter } from "./src/routes/coin.routes.js";
import { router as watchlistRouter } from "./src/routes/watchlist.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v2", coinRouter);
app.use("/api/v3", watchlistRouter);

// http://localhost:8000/api/v1/users/google/callback
// http://localhost:8000/api/v2

export { app };

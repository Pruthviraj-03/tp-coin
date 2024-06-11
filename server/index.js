import dotenv from "dotenv";
import { connectDB } from "./src/configs/db.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB();

app.listen(process.env.PORT || 8000, () => {
  console.log(`⚙️  Server is running at port : ${process.env.PORT || 8000}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/Database.js";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

try {
  await db.authenticate();
  // db.sync();
} catch (error) {
  console.log(error);
}

app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(process.env.APP_PORT, ()=> {
  console.log(`Server up and running at PORT: ${process.env.APP_PORT}`);
});
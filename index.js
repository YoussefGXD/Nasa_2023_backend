import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserRouter } from "./routes/userRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MongodbURL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("DB Connection Failed");
    console.log(err);
  });

app.use("/api/user", UserRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log("Server started at 8080...");
});

import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import routes from "./routes";
import { errorHandler, NotFoundError } from "tickets-commonutils";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import dotenv from "dotenv"; //this only need in case of .env file means without k8s depl
dotenv.config();
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false, //disable encryption: (To be understood between diff languages!) / (JWT is already encrypted)
    secure: process.env.NODE_ENV !== "test", //True in PROD (only used with https)  //False in TEST (To work without https)
    //RQ: NODE_ENV variable are : development | production | test
  })
);

app.use("/api/users", routes);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
app.listen(3000, async () => {
  try {
    console.log("Starting up .....");
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined");
    }
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined");
    }
    console.log("Connecting to mongoDB", process.env.MONGO_URI!);
    await mongoose.connect(process.env.MONGO_URI!);
    console.log(await mongoose.connection.db.listCollections().toArray());
    console.log("Listening on port 3000!!!!!!!!");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
});

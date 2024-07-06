import mongoose from "mongoose";
import { app } from "./app";
import dotenv from "dotenv"; //this only need in case of .env file means without k8s depl
dotenv.config();

const start = async () => {
  console.log("Starting up....");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined");
    }
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined");
    }
    console.log("Connecting to mongoDB", process.env.MONGO_URI!);
    await mongoose.connect(process.env.MONGO_URI!);
    console.log(await mongoose.connection.db.listCollections().toArray());
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  app.listen(3000, async () => {
    console.log("Listening on port 3000");
  });
};
start();

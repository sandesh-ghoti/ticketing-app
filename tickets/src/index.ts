import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Starting up tickets...");
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined");
    }
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined");
    }
    console.log("Connecting to mongoDB", process.env.MONGO_URI!);
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  app.listen(3000, async () => {
    console.log("Listening on port 3000");
  });
};
start();

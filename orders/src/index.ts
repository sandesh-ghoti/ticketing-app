import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { Subjects } from "tickets-commonutils";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCreatedListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCompletedListener } from "./events/listeners/payment-completed-listener";

const start = async () => {
  console.log("Starting up orders...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.STREAM_NAME) {
    throw new Error("STREAM_NAME must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  try {
    console.log("Connecting to mongoDB", process.env.MONGO_URI!);
    await mongoose.connect(process.env.MONGO_URI!);

    // connect to nats
    await natsWrapper.connect(
      process.env.STREAM_NAME!,
      Object.values(Subjects),
      process.env.NATS_URL!
    );

    new TicketCreatedListener(natsWrapper.nc).consume();
    new TicketUpdatedListener(natsWrapper.nc).consume();
    new ExpirationCreatedListener(natsWrapper.nc).consume();
    new PaymentCompletedListener(natsWrapper.nc).consume();
    console.log("Connected to Nats");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  app.listen(3000, async () => {
    console.log("Listening on port 3000");
  });
};
start();

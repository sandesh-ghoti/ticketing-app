import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";
import { Subjects } from "tickets-commonutils";
const start = async () => {
  console.log("Starting up expiration service...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.STREAM_NAME) {
    throw new Error("STREAM_NAME must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  try {
    // connect to nats
    await natsWrapper.connect(
      process.env.STREAM_NAME!,
      Object.values(Subjects),
      process.env.NATS_URL!
    );
    new OrderCreatedListener(natsWrapper.nc).consume();
    console.log("Connected to Nats");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
start();

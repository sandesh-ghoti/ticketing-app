import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-completed-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
}

export const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});
//Define what we want to do whenever we receive a job
expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.nc).publish({
    orderId: job.data.orderId,
  });
});

import { NatsConnection } from "nats";
import { Event } from "./shared";

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  private nc: NatsConnection;
  constructor(nc: NatsConnection) {
    this.nc = nc;
  }

  //we will create a Promise to use async await:
  publish(data: T["data"]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const msg = await this.nc
          .jetstream()
          .publish(this.subject, JSON.stringify(data));
        console.log("Event published to subject", this.subject);
        console.log("Message seq: ", msg.seq);
        resolve();
      } catch (error) {
        return reject(error);
      }
    });
  }
}

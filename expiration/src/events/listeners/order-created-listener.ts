import { OrderCreatedEvent, Subjects, Subscriber } from "tickets-commonutils";
import { CONSUMER_NAME } from "./consumer-name";
import { JsMsg } from "nats";
import { expirationQueue } from "../../queues/queue";
export class OrderCreatedListener extends Subscriber<OrderCreatedEvent> {
  readonly subject = Subjects.ORDER_CREATED;
  consumerName = CONSUMER_NAME + this.subject.split(".").join("_");
  streamName: string = process.env.STREAM_NAME!;
  async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg) {
    console.log("OrderCreatedEvent!", data);
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("wait for " + delay + "ms");
    await expirationQueue.add({ orderId: data.id }, { delay });
    msg.ack();
    //Ack the message
  }
}

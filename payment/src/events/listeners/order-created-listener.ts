import { OrderCreatedEvent, Subjects, Subscriber } from "tickets-commonutils";
import { CONSUMER_NAME } from "./consumer-name";
import { JsMsg } from "nats";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Subscriber<OrderCreatedEvent> {
  readonly subject = Subjects.ORDER_CREATED;
  consumerName = CONSUMER_NAME + this.subject.split(".").join("_");
  streamName: string = process.env.STREAM_NAME!;
  async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg) {
    console.log("OrderCreatedEvent!", data);
    const order = await Order.build({
      id: data.id,
      status: data.status,
      userId: data.userId,
      price: data.ticket.price,
      version: data.version,
    });
    await order.save();
    //Ack the message
    msg.ack();
  }
}

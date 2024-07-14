import {
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
  Subscriber,
} from "tickets-commonutils";
import { CONSUMER_NAME } from "./consumer-name";
import { JsMsg } from "nats";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Subscriber<OrderCancelledEvent> {
  readonly subject = Subjects.ORDER_CANCELLED;
  consumerName = CONSUMER_NAME + this.subject.split(".").join("_");
  streamName: string = process.env.STREAM_NAME!;
  async onMessage(data: OrderCancelledEvent["data"], msg: JsMsg) {
    console.log("OrderCancelledEvent!");
    const order = await Order.findByEvent(data);
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    //Ack the message
    msg.ack();
  }
}

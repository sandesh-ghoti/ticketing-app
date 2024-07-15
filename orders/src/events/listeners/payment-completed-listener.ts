import {
  Subjects,
  Subscriber,
  PaymentCreatedEvent,
  OrderStatus,
} from "tickets-commonutils";
import { CONSUMER_NAME } from "./consumer-name";
import { JsMsg } from "nats";
import { Order } from "../../models/order";

export class PaymentCompletedListener extends Subscriber<PaymentCreatedEvent> {
  readonly subject = Subjects.PAYMENT_CREATED;
  consumerName = CONSUMER_NAME + this.subject.split(".").join("_");
  streamName: string = process.env.STREAM_NAME!;
  async onMessage(data: PaymentCreatedEvent["data"], msg: JsMsg) {
    console.log("PaymentCreatedEvent!");
    const { orderId } = data;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({ status: OrderStatus.Complete });
    await order.save();
    msg.ack();
  }
}

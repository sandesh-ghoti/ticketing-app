import {
  Subjects,
  Subscriber,
  ExpirationCompleteEvent,
  OrderStatus,
} from "tickets-commonutils";
import { CONSUMER_NAME } from "./consumer-name";
import { JsMsg } from "nats";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCreatedListener extends Subscriber<ExpirationCompleteEvent> {
  readonly subject = Subjects.EXPIRATION_COMPLETE;
  consumerName: string = CONSUMER_NAME;
  streamName: string = process.env.STREAM_NAME!;
  async onMessage(data: ExpirationCompleteEvent["data"], msg: JsMsg) {
    console.log("ExpirationCompleteEvent!", data);
    const { orderId } = data;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    await new OrderCancelledPublisher(natsWrapper.nc).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}

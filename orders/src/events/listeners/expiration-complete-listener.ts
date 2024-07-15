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
import { Ticket } from "../../models/ticket";

export class ExpirationCreatedListener extends Subscriber<ExpirationCompleteEvent> {
  readonly subject = Subjects.EXPIRATION_COMPLETE;
  consumerName = CONSUMER_NAME + this.subject.split(".").join("_");
  streamName: string = process.env.STREAM_NAME!;
  async onMessage(data: ExpirationCompleteEvent["data"], msg: JsMsg) {
    console.log("ExpirationCompleteEvent!", data);
    const { orderId } = data;
    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    console.log(
      "is ticket still available?",
      await Ticket.findById(order.ticket.id)
    );
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

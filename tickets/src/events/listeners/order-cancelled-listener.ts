import { OrderCancelledEvent, Subjects, Subscriber } from "tickets-commonutils";
import { CONSUMER_NAME } from "./consumer-name";
import { JsMsg } from "nats";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderCancelledListener extends Subscriber<OrderCancelledEvent> {
  readonly subject = Subjects.ORDER_CANCELLED;
  consumerName = CONSUMER_NAME + this.subject.split(".").join("_");
  streamName: string = process.env.STREAM_NAME!;
  async onMessage(data: OrderCancelledEvent["data"], msg: JsMsg) {
    console.log("OrderCancelledEvent!");
    console.log("data", data);
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket is not found");
    }

    ticket.set({ orderId: undefined }); //id of created order
    //Save the ticket
    await ticket.save();
    //RQ: here we are publishing an Event from inside of our listener !
    //we need to publish all updates to conserve versioning
    await new TicketUpdatedPublisher(natsWrapper.nc).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    //Ack the message
    msg.ack();
  }
}

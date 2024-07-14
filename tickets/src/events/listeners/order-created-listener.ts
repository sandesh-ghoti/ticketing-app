import { OrderCreatedEvent, Subjects, Subscriber } from "tickets-commonutils";
import { CONSUMER_NAME } from "./consumer-name";
import { JsMsg } from "nats";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderCreatedListener extends Subscriber<OrderCreatedEvent> {
  readonly subject = Subjects.ORDER_CREATED;
  consumerName = CONSUMER_NAME + this.subject.split(".").join("_");
  streamName: string = process.env.STREAM_NAME!;
  async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg) {
    console.log("OrderCreatedEvent!", data);
    const ticket = await Ticket.findById(data.ticket.id);
    //If no ticket, throw an error
    if (!ticket) {
      throw new Error("Ticket is not found");
    }
    //Mark he ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id }); //id of created order
    //Save the ticket
    await ticket.save();
    //RQ: here we are publishing an Event from inside of our listener !
    //we need to publish all updates to conserve versioning
    await new TicketUpdatedPublisher(natsWrapper.nc).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: data.id,
      version: ticket.version,
    });
    //Ack the message
    msg.ack();
  }
}

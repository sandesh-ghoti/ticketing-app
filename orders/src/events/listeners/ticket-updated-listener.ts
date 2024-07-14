import {
  NotFoundError,
  Subjects,
  Subscriber,
  TicketUpdatedEvent,
} from "tickets-commonutils";
import { CONSUMER_NAME } from "./consumer-name";
import { JsMsg } from "nats";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Subscriber<TicketUpdatedEvent> {
  readonly subject = Subjects.TICKET_UPDATED;
  consumerName = CONSUMER_NAME + this.subject.split(".").join("_");
  streamName: string = process.env.STREAM_NAME!;
  async onMessage(data: TicketUpdatedEvent["data"], msg: JsMsg) {
    console.log("TicketUpdatedEvent!", data);
    const { title, price } = data;
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    // save only in case of ticket modified
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}

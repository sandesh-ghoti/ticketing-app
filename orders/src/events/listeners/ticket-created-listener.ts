import { Subjects, Subscriber, TicketCreatedEvent } from "tickets-commonutils";
import { CONSUMER_NAME } from "./consumer-name";
import { JsMsg } from "nats";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Subscriber<TicketCreatedEvent> {
  readonly subject = Subjects.TICKET_CREATED;
  consumerName = CONSUMER_NAME + this.subject.split(".").join("_");
  streamName: string = process.env.STREAM_NAME!;
  async onMessage(data: TicketCreatedEvent["data"], msg: JsMsg) {
    console.log("TicketCreatedListener!");
    const { id, title, price } = data;

    const ticket = Ticket.build({ id, title, price });
    await ticket.save();

    msg.ack();
  }
}

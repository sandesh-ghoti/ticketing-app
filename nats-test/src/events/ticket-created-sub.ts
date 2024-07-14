import { JsMsg } from "nats";
import { Subscriber } from "./base-sub";
import { TicketCreatedEvent } from "./ticket-created-events";
import { Subjects } from "./shared";

export class TicketCreatedSubscriber extends Subscriber<TicketCreatedEvent> {
  readonly subject = Subjects.TICKET_CREATED;
  readonly consumerName = "nats-test" + this.subject.split(".").join("");
  onMessage(data: TicketCreatedEvent["data"], msg: JsMsg): void {
    console.log("seq:", msg.seq, data);
    msg.ack();
  }
}

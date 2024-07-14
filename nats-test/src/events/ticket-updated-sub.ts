import { JsMsg } from "nats";
import { Subscriber } from "./base-sub";
import { Subjects } from "./shared";
import { TicketUpdatedEvent } from "./ticket-updated-events";

export class TicketUpdatedSubscriber extends Subscriber<TicketUpdatedEvent> {
  readonly subject = Subjects.TICKET_UPDATED;
  readonly consumerName = "nats-test" + this.subject.split(".").join("");
  onMessage(data: TicketUpdatedEvent["data"], msg: JsMsg): void {
    console.log(
      this.consumerName,
      "seq:",
      msg.seq,
      data.id,
      data.title,
      data.price
    );
    msg.ack();
  }
}

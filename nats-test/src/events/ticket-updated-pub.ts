import { Publisher } from "./base-pub";
import { Subjects } from "./shared";
import { TicketUpdatedEvent } from "./ticket-updated-events";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;
}

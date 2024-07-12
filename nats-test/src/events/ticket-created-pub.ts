import { Publisher } from "./base-pub";
import { Subjects } from "./shared";
import { TicketCreatedEvent } from "./ticket-created-events";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
}

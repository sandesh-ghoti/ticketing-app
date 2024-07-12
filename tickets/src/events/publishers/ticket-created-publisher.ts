import { Publisher, Subjects, TicketCreatedEvent } from "tickets-commonutils";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TICKET_CREATED;
}

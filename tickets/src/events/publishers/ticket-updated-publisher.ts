import { Publisher, Subjects, TicketUpdatedEvent } from "tickets-commonutils";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TICKET_UPDATED;
}

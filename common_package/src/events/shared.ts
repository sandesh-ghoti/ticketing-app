/**
 * Enum of all subjects used in the ticketing system.
 */
export enum Subjects {
  TICKET_CREATED = "ticket.created",
  TICKET_UPDATED = "ticket.updated",

  ORDER_CANCELLED = "order.cancelled",
  ORDER_CREATED = "order.created",

  PAYMENT_CREATED = "payment.created",

  EXPIRATION_COMPLETE = "expiration.complete",
}

/**
 * Interface for all events in the ticketing system.
 */
export interface Event {
  subject: Subjects;
  data: any;
}

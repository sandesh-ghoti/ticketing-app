import { Subjects } from "./shared";

export interface TicketCreatedEvent {
  subject: Subjects.TICKET_CREATED;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
  };
}

export interface OrderCreatedEvent {
  subject: Subjects.ORDER_CREATED;
  data: {
    id: string;
    title: string;
    price: number;
  };
}

import { Publisher, Subjects, OrderCreatedEvent } from "tickets-commonutils";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.ORDER_CREATED;
}

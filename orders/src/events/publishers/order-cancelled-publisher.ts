import { OrderCancelledEvent, Publisher, Subjects } from "tickets-commonutils";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
}

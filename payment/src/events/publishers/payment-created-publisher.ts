import { PaymentCreatedEvent, Publisher, Subjects } from "tickets-commonutils";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PAYMENT_CREATED;
}

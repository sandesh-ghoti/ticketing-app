import { Subjects } from "./shared";

//We send min info that will be used by other services
export interface PaymentCreatedEvent {
  subject: Subjects.PAYMENT_CREATED;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}

import { Subjects } from "./shared";
import { OrderStatus } from "./types/order-status";

//We send min info that will be used by other services
export interface OrderCreatedEvent {
  subject: Subjects.ORDER_CREATED;
  data: {
    id: string;
    version: number;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}

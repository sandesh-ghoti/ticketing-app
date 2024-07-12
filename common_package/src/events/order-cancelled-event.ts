import { Subjects } from "./shared";

//We send min info that will be used by othre services
export interface OrderCancelledEvent {
  subject: Subjects.ORDER_CANCELLED;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}

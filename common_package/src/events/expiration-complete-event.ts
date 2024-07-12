import { Subjects } from "./shared";

//We send min info that will be used by othre services
export interface ExpirationCompleteEvent {
  subject: Subjects.EXPIRATION_COMPLETE;
  data: {
    orderId: string;
  };
}

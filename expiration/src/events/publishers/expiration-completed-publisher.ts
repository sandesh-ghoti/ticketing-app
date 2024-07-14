import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "tickets-commonutils";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.EXPIRATION_COMPLETE;
}

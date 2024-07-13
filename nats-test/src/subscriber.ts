import { NatsConnection } from "nats";
import { TicketCreatedSubscriber } from "./events/ticket-created-sub";
import {
  createOrUpdateTicketingStream,
  STREAM_NAME,
  Subjects,
} from "./events/shared";
import { natsWrapper } from "./nats-wrapper";
console.clear();
let nc: NatsConnection;
async function ListenerMod() {
  await natsWrapper.connect(
    STREAM_NAME,
    Object.values(Subjects),
    "nats://localhost:4222"
  );
  await createOrUpdateTicketingStream(natsWrapper.nc);
  await new TicketCreatedSubscriber(natsWrapper.nc).consume();
}
ListenerMod();

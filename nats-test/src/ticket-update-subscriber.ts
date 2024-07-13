import { connect, NatsConnection } from "nats";
import { createOrUpdateTicketingStream } from "./events/shared";
import { TicketUpdatedSubscriber } from "./events/ticket-updated-sub";
console.clear();
let nc: NatsConnection;
async function ListenerMod() {
  nc = await connect({ servers: "nats://localhost:4222" });
  const js = await createOrUpdateTicketingStream(nc);
  await new TicketUpdatedSubscriber(nc).consume();
}
ListenerMod();

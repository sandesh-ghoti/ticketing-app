import { connect, NatsConnection } from "nats";
import { TicketCreatedSubscriber } from "./events/ticket-created-sub";
import { createOrUpdateTicketingStream } from "./events/shared";
console.clear();
let nc: NatsConnection;
async function ListenerMod() {
  nc = await connect({ servers: "nats://localhost:4222" });
  const js = await createOrUpdateTicketingStream(nc);
  await new TicketCreatedSubscriber(nc, js).consume();
}
ListenerMod();

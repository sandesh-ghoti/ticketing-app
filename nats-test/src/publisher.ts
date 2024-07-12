import { connect } from "nats";
import { createOrUpdateTicketingStream } from "./events/shared";
import { TicketCreatedPublisher } from "./events/ticket-created-pub";

console.clear();
async function publishMod() {
  const nc = await connect({ servers: "nats://localhost:4222" });
  const js = await createOrUpdateTicketingStream(nc);
  const ticketCreater = new TicketCreatedPublisher(js);
  try {
    await ticketCreater.publish({ id: "1", title: "concert", price: 30 });
  } catch (error) {
    console.log(error);
  }
}
publishMod();

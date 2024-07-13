import {
  createOrUpdateTicketingStream,
  STREAM_NAME,
  Subjects,
} from "./events/shared";
import { TicketCreatedPublisher } from "./events/ticket-created-pub";
import { TicketUpdatedPublisher } from "./events/ticket-updated-pub";
import { natsWrapper } from "./nats-wrapper";
console.clear();
async function publishMod() {
  await natsWrapper.connect(
    STREAM_NAME,
    Object.values(Subjects),
    "nats://localhost:4222"
  );
  await createOrUpdateTicketingStream(natsWrapper.nc);
  const ticketCreater = new TicketCreatedPublisher(natsWrapper.nc);
  const ticketUpdater = new TicketUpdatedPublisher(natsWrapper.nc);
  try {
    await ticketCreater.publish({
      id: "1",
      title: "concert",
      price: 30,
      userId: "1",
      version: 0,
    });
    await ticketUpdater.publish({
      id: "1",
      title: "concert-1",
      price: 40,
      userId: "1",
      version: 1,
    });
  } catch (error) {
    console.log(error);
  }
}
publishMod();

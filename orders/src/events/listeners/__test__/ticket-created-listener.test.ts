import { TicketCreatedEvent } from "tickets-commonutils";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { JsMsg } from "nats";
import { Ticket } from "../../../models/ticket";

const setup = () => {
  const listener = new TicketCreatedListener(natsWrapper.nc);

  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };
  const msg: JsMsg = {
    ack: jest.fn(),
  } as unknown as JsMsg;

  return { listener, data, msg };
};
it("listen to ticket creation event and create and save ticket", async () => {
  const { listener, data, msg } = setup();
  await listener.onMessage(data, msg);
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});
it("acks the message", async () => {
  const { listener, data, msg } = setup();
  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  //write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

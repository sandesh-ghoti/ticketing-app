import { OrderCancelledEvent } from "tickets-commonutils";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { JsMsg } from "nats";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.nc);

  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "asdf",
  });
  await ticket.save();

  const orderId = new mongoose.Types.ObjectId().toHexString();
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };
  const msg = {
    ack: jest.fn(),
  } as unknown as JsMsg;
  return { listener, ticket, data, msg };
};

it("cancel order as per ticket id", async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);
  const ticketUpdated = await Ticket.findById(ticket.id);
  expect(ticketUpdated?.orderId).toBeUndefined();
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  console.log(data);
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(natsWrapper.nc.jetstream().publish).toHaveBeenCalled();
  // here will get second call because we already published ticket.created event
  const eventData = JSON.parse(
    (natsWrapper.nc.jetstream().publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.orderId).toBeUndefined();
});

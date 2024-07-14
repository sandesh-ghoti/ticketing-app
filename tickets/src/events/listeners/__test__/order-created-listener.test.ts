import { OrderCreatedEvent, OrderStatus } from "tickets-commonutils";
import { Ticket, TicketsDoc } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { createTestTicket } from "../../../routes/__test__/get.test";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { JsMsg } from "nats";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.nc);

  const cookie = global.signin();
  const ticket: TicketsDoc = await createTestTicket(cookie).then(
    (res) => res.body
  );

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: ticket.userId,
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  const msg = {
    ack: jest.fn(),
  } as unknown as JsMsg;
  return { listener, cookie, ticket, data, msg };
};

it("update ticket as per order id", async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);
  const ticketUpdated = await Ticket.findById(ticket.id);
  expect(ticketUpdated?.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  console.log(data);
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);
  const ticketUpdated = await Ticket.findById(ticket.id);
  expect(ticketUpdated?.orderId).toEqual(data.id);

  expect(natsWrapper.nc.jetstream().publish).toHaveBeenCalled();
  // here will get second call because we already published ticket.created event
  const eventData = JSON.parse(
    (natsWrapper.nc.jetstream().publish as jest.Mock).mock.calls[1][1]
  );
  expect(eventData.orderId).toEqual(data.id);
});

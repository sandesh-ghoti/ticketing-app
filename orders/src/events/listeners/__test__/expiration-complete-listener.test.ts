import {
  ExpirationCompleteEvent,
  OrderStatus,
  TicketCreatedEvent,
} from "tickets-commonutils";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { JsMsg } from "nats";
import { Ticket } from "../../../models/ticket";
import { ExpirationCreatedListener } from "../expiration-complete-listener";
import { createTestOrder } from "../../../routes/__test__/get.test";
import { Order, OrderDoc } from "../../../models/order";

const setup = async () => {
  const listener = new ExpirationCreatedListener(natsWrapper.nc);
  const order: OrderDoc = await createTestOrder().then((res) => res.body);
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  const msg: JsMsg = {
    ack: jest.fn(),
  } as unknown as JsMsg;

  return { listener, data, msg, order };
};
it("listen to expiration complete event and then expire the order", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const order = await Order.findById(data.orderId);
  expect(order).toBeDefined();
  expect(order?.status).toEqual(OrderStatus.Cancelled);
});
it("emit on OrderCancelled event", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.nc.jetstream().publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.nc.jetstream().publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

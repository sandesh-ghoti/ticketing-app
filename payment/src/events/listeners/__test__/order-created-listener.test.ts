import { OrderCreatedEvent, OrderStatus } from "tickets-commonutils";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { JsMsg } from "nats";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.nc);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "123",
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 123,
    },
  };
  const msg = {
    ack: jest.fn(),
  } as unknown as JsMsg;
  return { listener, data, msg };
};

it("create order as per order id", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const order = await Order.findById(data.id);
  expect(order?.id).toBeDefined();
  expect(order?.userId).toEqual(data.userId);
  expect(order?.status).toEqual(data.status);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

import { OrderCancelledEvent, OrderStatus } from "tickets-commonutils";
import { Payment } from "../../../models/payment";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { JsMsg } from "nats";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.nc);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: "abc123",
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1, //prev version + 1
    ticket: {
      id: "ticket123",
    },
  };

  const msg = {
    ack: jest.fn(),
  } as unknown as JsMsg;
  return { listener, order, data, msg };
};

it("cancel order as per order id", async () => {
  const { listener, data, order, msg } = await setup();
  await listener.onMessage(data, msg);
  const orderUpdated = await Order.findById(order.id);
  expect(orderUpdated?.id).toBe(order.id);
  expect(orderUpdated?.status).toBe(OrderStatus.Cancelled);
  expect(orderUpdated?.version).toBe(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  console.log(data);
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";
import { OrderStatus } from "tickets-commonutils";

it("has route handler listening to /api/orders/v1 for post request", async () => {
  const response = await request(app).post("/api/orders/v1").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed when the user logged in", async () => {
  await request(app).post("/api/orders/v1").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/orders/v1")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an invalidation error if ticketId invalid provided", async () => {
  await request(app)
    .post("/api/orders/v1")
    .set("Cookie", global.signin())
    .send({
      ticketId: "123",
    })
    .expect(403);
});

it("returns an NotFoundError if ticketId not found", async () => {
  await request(app)
    .post("/api/orders/v1")
    .set("Cookie", global.signin())
    .send({
      ticketId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("creates a ticket and returns error if ticket already registered ", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 15,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "123",
    expiresAt: new Date(),
    status: OrderStatus.Created,
  });
  await order.save();
  await request(app)
    .post("/api/orders/v1")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 15,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders/v1")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("should publish a order created event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 15,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders/v1")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  const orders = await Order.find({});
  expect(orders.length).toEqual(1);
  expect(natsWrapper.nc.jetstream().publish).toHaveBeenCalled();
});

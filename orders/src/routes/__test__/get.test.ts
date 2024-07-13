import request from "supertest";
import { app } from "../../app";
import { Order, OrderDoc } from "../../models/order";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";

export const createTestTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "title 1",
    price: 20,
  });
  await ticket.save();
  return ticket;
};
export const createTestOrder = async (cookie = global.signin()) => {
  const ticket = await createTestTicket();
  return request(app)
    .post("/api/orders/v1")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id });
};

it("has route handler listening to /api/orders/v1 for post request", async () => {
  const response = await request(app).get("/api/orders/v1").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed when the user logged in", async () => {
  await request(app).get("/api/orders/v1").send({}).expect(401);
});

it("can fetch a list of orders", async () => {
  const cookie = global.signin();
  await createTestOrder(cookie);
  await createTestOrder(cookie);
  await createTestOrder(cookie);
  await createTestOrder(global.signin());
  const response = await request(app)
    .get("/api/orders/v1")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});

// test api/orders/v1/:id

it("can only be accessed when the user logged in", async () => {
  await request(app).get("/api/orders/v1/123456").send({}).expect(401);
});

it("get not found if the order is not found", async () => {
  const randomID = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/orders/v1/${randomID}`)
    .set("Cookie", global.signin())
    .send()
    .expect(404);
});

it("can fetch a single order", async () => {
  const cookie = global.signin();
  const res = await createTestOrder(cookie);
  const order: OrderDoc = res.body;
  const response = await request(app)
    .get(`/api/orders/v1/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);
  const fetchedOrder: OrderDoc = response.body;
  expect(fetchedOrder.ticket.title).toEqual(order.ticket.title);
});

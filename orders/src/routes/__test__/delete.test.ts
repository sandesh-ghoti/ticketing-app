import mongoose from "mongoose";
import { app } from "../../app";
import request from "supertest";
import { OrderDoc } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import { createTestOrder } from "./get.test";

it("check route handler listening to /api/orders/v1/:id for delete request", async () => {
  const response = await request(app).delete("/api/orders/v1/123").send({});

  expect(response.status).not.toEqual(404);
});

it("raise unautherized error if not logged in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).delete(`/api/Orders/v1/${id}`).expect(401);
});
it("raise not found error if Order not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .delete(`/api/Orders/v1/${id}`)
    .set("Cookie", global.signin())
    .expect(404);
});
it("raise unautherized error if user is not owner of Order", async () => {
  const response: OrderDoc = await createTestOrder(global.signin()).then(
    (res) => res.body
  );
  await request(app)
    .delete(`/api/Orders/v1/${response.id}`)
    .set("Cookie", global.signin())
    .expect(401);
});

it("cancel Order successfully if everything is fine", async () => {
  const session = global.signin();
  const Order: OrderDoc = await createTestOrder(session).then(
    (res) => res.body
  );
  await request(app)
    .delete(`/api/Orders/v1/${Order.id}`)
    .set("Cookie", session)
    .expect(204);
});

it("publish an event if Order is deleted", async () => {
  const session = global.signin();
  const Order: OrderDoc = await createTestOrder(session).then(
    (res) => res.body
  );
  await request(app)
    .delete(`/api/Orders/v1/${Order.id}`)
    .set("Cookie", session)
    .expect(204);
  expect(natsWrapper.nc.jetstream().publish).toHaveBeenCalled();
});

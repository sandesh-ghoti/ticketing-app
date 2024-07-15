import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import mongoose from "mongoose";
import { OrderStatus } from "tickets-commonutils";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";
import { natsWrapper } from "../../nats-wrapper";
it("has route handler listening to /api/payments/v1 for post request", async () => {
  const response = await request(app).post("/api/payments/v1").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed when the user logged in", async () => {
  await request(app).post("/api/payments/v1").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/payments/v1")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an validation error if invalid input provided", async () => {
  await request(app)
    .post("/api/payments/v1")
    .set("Cookie", global.signin())
    .send({ token: "123" })
    .expect(403);
  await request(app)
    .post("/api/payments/v1")
    .set("Cookie", global.signin())
    .send({ orderId: "123" })
    .expect(403);
});

it("returns an NotFoundError if invalid orderId provided", async () => {
  await request(app)
    .post("/api/payments/v1")
    .set("Cookie", global.signin())
    .send({
      token: "123",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});
it("returns an NotAuthorizedError if trying to access others orders", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments/v1")
    .set("Cookie", global.signin())
    .send({ token: "123", orderId: order.id })
    .expect(401);
});
it("returns an BadRequestError if order was cancelled", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Cancelled,
    userId: userId,
    version: 1,
  });
  await order.save();

  await request(app)
    .post("/api/payments/v1")
    .set("Cookie", global.signin(userId))
    .send({ token: "123", orderId: order.id })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const randomPrice = Math.floor(Math.random() * 1000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: randomPrice,
    status: OrderStatus.Created,
    userId: userId,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments/v1")
    .set("Cookie", global.signin(userId))
    .send({ token: "tok_visa", orderId: order.id })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === randomPrice * 100
  );

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual("usd");

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
  expect(natsWrapper.nc.jetstream().publish).toHaveBeenCalled();
});

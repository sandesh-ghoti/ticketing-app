import request from "supertest";
import { app } from "../../app";
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

it("returns an error if invalid title provided", async () => {});

it("returns an error if invalid price provided", async () => {});

it("should publish a ticket created event", async () => {});

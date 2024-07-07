import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("has route handler listening to /api/tickets/v1 for post request", async () => {
  const response = await request(app).post("/api/tickets/v1").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed when the user logged in", async () => {
  await request(app).post("/api/tickets/v1").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets/v1")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if invalid title provided", async () => {
  await request(app)
    .post("/api/tickets/v1")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(403);

  await request(app)
    .post("/api/tickets/v1")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(403);
});

it("returns an error if invalid price provided", async () => {
  await request(app)
    .post("/api/tickets/v1")
    .set("Cookie", global.signin())
    .send({
      title: "test",
      price: -10,
    })
    .expect(403);

  await request(app)
    .post("/api/tickets/v1")
    .set("Cookie", global.signin())
    .send({
      title: "test",
    })
    .expect(403);
});

it("creates a ticket with valid parameters", async () => {
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets/v1")
    .set("Cookie", global.signin())
    .send({
      title: "test",
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
});

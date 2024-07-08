import request from "supertest";
import { app } from "../../app";
import { TicketsDoc } from "../../models/ticket";
import mongoose from "mongoose";

export const createTestTicket = () => {
  return request(app)
    .post("/api/tickets/v1")
    .set("Cookie", global.signin())
    .send({ title: "title 1", price: 20 });
};

it("can fetch a list of tickets", async () => {
  const res = await createTestTicket();
  await createTestTicket();
  await createTestTicket();

  const response = await request(app).get("/api/tickets/v1").send().expect(200);

  expect(response.body.length).toEqual(3);
});
it("get not found if the ticket is not found", async () => {
  const randomID = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/v1/${randomID}`).send().expect(404);
});
it("can fetch a single ticket", async () => {
  const res = await createTestTicket();
  const ticket: TicketsDoc = res.body;
  const response = await request(app)
    .get(`/api/tickets/v1/${ticket.id}`)
    .send()
    .expect(200);

  expect(response.body.title).toEqual(ticket.title);
});

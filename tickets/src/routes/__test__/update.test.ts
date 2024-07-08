import { mongo } from "mongoose";
import { app } from "../../app";
import request from "supertest";
import { createTestTicket } from "./get.test";
import { Ticket, TicketsDoc } from "../../models/ticket";

it("raise unautherized error if not logged in", async () => {
  const id = new mongo.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/v1/${id}`)
    .send({
      title: "test",
      price: 10,
    })
    .expect(401);
});
it("raise not found error if ticket not found", async () => {
  const id = new mongo.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/v1/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "test",
      price: 10,
    })
    .expect(404);
});
it("raise unautherized error if user is not owner of ticket", async () => {
  const response = await createTestTicket();
  await request(app)
    .put(`/api/tickets/v1/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "test", price: 99 })
    .expect(401);
});
it("raise request validation error if invalid title or price", async () => {
  const session = global.signin();
  const res = await request(app)
    .post(`/api/tickets/v1/`)
    .set("Cookie", session)
    .send({
      title: "test",
      price: 20,
    });
  const ticket: TicketsDoc = res.body;
  await request(app)
    .put(`/api/tickets/v1/${ticket.id}`)
    .set("Cookie", session)
    .send({
      title: "",
      price: 20,
    })
    .expect(403);
  await request(app)
    .put(`/api/tickets/v1/${ticket.id}`)
    .set("Cookie", session)
    .send({
      title: "test",
      price: -10,
    })
    .expect(403);
});
it("update ticket successfully if everything is fine", async () => {
  const session = global.signin();
  const res = await request(app)
    .post(`/api/tickets/v1/`)
    .set("Cookie", session)
    .send({
      title: "test",
      price: 20,
    });
  const ticket: TicketsDoc = res.body;
  const updatedTicket = await request(app)
    .put(`/api/tickets/v1/${ticket.id}`)
    .set("Cookie", session)
    .send({
      title: "test1",
      price: 30,
    })
    .expect(200);
  expect(updatedTicket.body.title).toEqual("test1");
  expect(updatedTicket.body.price).toEqual(30);
});
it("reject updates if the ticket is reserved", async () => {
  const session = global.signin();
  const res = await request(app)
    .post(`/api/tickets/v1/`)
    .set("Cookie", session)
    .send({
      title: "test",
      price: 20,
    });
  const ticket = await Ticket.findById(res.body.id);
  ticket?.set({ orderId: "1234" });
  await ticket?.save();
  await request(app)
    .put(`/api/tickets/v1/${res.body.id}`)
    .set("Cookie", session)
    .send({
      title: "test",
      price: 10,
    })
    .expect(400);
});

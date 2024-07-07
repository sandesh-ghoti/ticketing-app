import request from "supertest";
import { app } from "../../app";

const createTicket = () => {
  return request(app)
    .post("/api/tickets/v1")
    .set("Cookie", global.signin())
    .send({ title: "title 1", price: 20 });
};

it("can fetch a list of tickets", async () => {
  const res = await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets/v1").send().expect(200);

  expect(response.body.length).toEqual(3);
});

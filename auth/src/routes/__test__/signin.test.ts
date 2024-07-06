import request from "supertest";
import { app } from "../../app";

it("fails when a user not exist", async () => {
  const response = await request(app)
    .post("/api/users/v1/signin")
    .send({ email: "test@test.com", password: "123456" })
    .expect(400);
});
it("fails when an invalid password provided for signin", async () => {
  await request(app)
    .post("/api/users/v1/signup")
    .send({ name: "test", email: "test@test.com", password: "test" })
    .expect(201);
  await request(app)
    .post("/api/users/v1/signin")
    .send({ email: "test@test.com", password: "adsfd" })
    .expect(400);
});
it("set cookie after successful signup", async () => {
  await request(app)
    .post("/api/users/v1/signup")
    .send({ name: "test", email: "test@test.com", password: "test" })
    .expect(201);
  const response = await request(app)
    .post("/api/users/v1/signin")
    .send({ email: "test@test.com", password: "test" })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});

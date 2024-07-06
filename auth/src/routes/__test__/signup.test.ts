import request from "supertest";
import { app } from "../../app";

it("should return 201 on signup", async () => {
  return request(app)
    .post("/api/users/v1/signup")
    .send({ name: "test", email: "test@test.com", password: "test" })
    .expect(201);
});
it("should return 403 on invalid email request for signup", async () => {
  return request(app)
    .post("/api/users/v1/signup")
    .send({ name: "test", email: "test.com", password: "test" })
    .expect(403);
});
it("should return 403 on invalid password request for signup", async () => {
  return request(app)
    .post("/api/users/v1/signup")
    .send({ name: "test", email: "test@test.com", password: "t" })
    .expect(403);
});
it("should return 403 on missing email or password request for signup", async () => {
  await request(app)
    .post("/api/users/v1/signup")
    .send({ name: "test", password: "t" })
    .expect(403);
  await request(app)
    .post("/api/users/v1/signup")
    .send({ name: "test", email: "test@test.com" })
    .expect(403);
});
it("duplicate email not allowed", async () => {
  await request(app)
    .post("/api/users/v1/signup")
    .send({ name: "test", email: "test@test.com", password: "test" })
    .expect(201);
  await request(app)
    .post("/api/users/v1/signup")
    .send({ name: "test", email: "test@test.com", password: "test" })
    .expect(400);
});
it("set cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/v1/signup")
    .send({ name: "test", email: "test@test.com", password: "test" })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});

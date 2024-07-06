import request from "supertest";
import { app } from "../../app";

it("clear cookies after logout", async () => {
  await request(app)
    .post("/api/users/v1/signup")
    .send({ name: "test", email: "test@test.com", password: "test" })
    .expect(201);
  const response = await request(app)
    .post("/api/users/v1/signout")
    .send()
    .expect(200);
  expect(response.get("Set-Cookie")).toEqual([
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly",
  ]);
});

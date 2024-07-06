import request from "supertest";
import { app } from "../../app";
import { currentUser } from "tickets-commonutils";

it("get current user details", async () => {
  const cookie = await getCookie();
  const response = await request(app)
    .get("/api/users/v1/current_user")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(response.body.user.email).toEqual("test@test.com");
});
it("get current user null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/v1/current_user")
    .send()
    .expect(200);
  expect(response.body.user).toBeNull();
});

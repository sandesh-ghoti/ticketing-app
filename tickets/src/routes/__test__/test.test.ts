import request from "supertest";
import { app } from "../../app";

it("should return ok on test", async () => {
  return request(app).post("/api/tickets/v1/test").expect(201);
});

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
declare global {
  var getCookie: () => Promise<string[]>;
}

let mongo: any;
//THIS will starts before Testing ...

beforeAll(async () => {
  process.env.JWT_KEY = "anything"; //This line to prevent THe necessity of ENV var
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri(); //Get URL to connect to it

  await mongoose.connect(mongoUri);
});

//THIS will starts before each Test ...
beforeEach(async () => {
  //We will reach into this MongoDB DB & delete / reset all the data inside there
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({}); //delete All Docs
  }
});

//THIS will starts after All Tests ...
afterAll(async () => {
  await mongo?.stop();
  await mongoose.connection.close();
});

global.getCookie = async () => {
  const name = "test";
  const email = "test@test.com";
  const password = "test";

  const response = await request(app)
    .post("/api/users/v1/signup")
    .send({ name, email, password })
    .expect(201);
  const cookie = response.get("Set-Cookie");
  return cookie || [];
};

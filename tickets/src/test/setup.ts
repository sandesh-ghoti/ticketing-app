import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

jest.mock("../nats-wrapper");

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
  jest.clearAllMocks();

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

// sign as test user and send cookie

global.signin = () => {
  const payload = {
    name: "test",
    email: "test@test.com",
    id: new mongoose.Types.ObjectId().toHexString(),
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`session=${base64}`];
};

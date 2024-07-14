jest.mock("../nats-wrapper");

//THIS will starts before Testing ...

beforeAll(async () => {
  process.env.JWT_KEY = "anything"; //This line to prevent THe necessity of ENV var
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
});

//THIS will starts before each Test ...
beforeEach(async () => {
  jest.clearAllMocks();

  //We will reach into this MongoDB DB & delete / reset all the data inside there
});

//THIS will starts after All Tests ...
afterAll(async () => {});

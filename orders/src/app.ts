import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import { currentUser, errorHandler, NotFoundError } from "tickets-commonutils";
import cookieSession from "cookie-session";
import routes from "./routes";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);
app.use("/api/orders", routes);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };

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
    signed: false, //disable encryption: (To be understood between diff languages!) / (JWT is already encrypted)
    secure: false, //True in PROD (only used with https)  //False in TEST (To work without https)
    //RQ: NODE_ENV variable are : development | production | test
  })
);

app.use(currentUser);
app.use("/api/payments", routes);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };

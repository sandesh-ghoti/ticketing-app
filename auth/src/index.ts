import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import routes from "./routes";
import { errorHandler, NotFoundError } from "tickets-commonutils";

const app = express();
app.use(json());

app.use("/api/users", routes);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!");
});

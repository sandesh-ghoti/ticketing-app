import { Request, Response } from "express";
import { CustomError } from "../errors";
export const errorHandler = (err: Error, req: Request, res: Response) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  console.error(err.message, err.stack);
  return res
    .status(500)
    .send({ errors: [{ message: "Something went wrong" }] });
};

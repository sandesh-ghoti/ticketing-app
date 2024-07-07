import express, { Request, Response } from "express";
import { validateRequest } from "tickets-commonutils";

const router = express.Router();

router.post("/", [], validateRequest, async (req: Request, res: Response) => {
  res.status(201).send("ok");
});

export { router as testRouter };

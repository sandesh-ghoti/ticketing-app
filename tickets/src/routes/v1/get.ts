import express, { Request, Response } from "express";
import { NotFoundError } from "tickets-commonutils";
import { Ticket } from "../../models/ticket";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined,
  });

  res.send(tickets);
});

router.get("/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as getRouter };

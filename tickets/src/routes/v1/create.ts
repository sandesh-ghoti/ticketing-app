import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "tickets-commonutils";
import { body } from "express-validator";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { TicketCreatedPublisher } from "../../events/publishers/ticket-created-publisher";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("price must be grater by 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.user!.id,
    });
    await ticket.save();
    const ticketPub = new TicketCreatedPublisher(natsWrapper.nc);
    await ticketPub.publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(201).send(ticket);
  }
);

export { router as createRouter };

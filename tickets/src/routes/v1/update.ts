import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "tickets-commonutils";
import { body } from "express-validator";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.put(
  "/:id",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }
    if (ticket.userId !== req.user!.id) {
      throw new NotAuthorizedError();
    }
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
    const ticketUpdatedPublisher = new TicketUpdatedPublisher(natsWrapper.nc);
    await ticketUpdatedPublisher.publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    res.send(ticket);
  }
);

export { router as updateRouter };

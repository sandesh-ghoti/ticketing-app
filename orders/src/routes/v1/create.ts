import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "tickets-commonutils";
import { body } from "express-validator";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCreatedPublisher } from "../../events/publishers/order-created-publisher";
import mongoose from "mongoose";
import { Order } from "../../models/order";

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

const router = express.Router();

router.post(
  "/",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("ticketId is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    //Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // create order
    const order = Order.build({
      userId: req.user!.id,
      status: OrderStatus.Created,
      ticket,
      expiresAt: expiration,
    });

    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.nc).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).send(order);
  }
);

export { router as createRouter };

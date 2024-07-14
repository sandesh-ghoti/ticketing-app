import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "tickets-commonutils";
import { natsWrapper } from "../../nats-wrapper";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../../events/publishers/order-cancelled-publisher";

const router = express.Router();

router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("ticket");
  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.user!.id) {
    throw new NotAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();

  //Publishing an event saying order was cancelled!
  new OrderCancelledPublisher(natsWrapper.nc).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(204).send(order);
});

export { router as deleteRouter };

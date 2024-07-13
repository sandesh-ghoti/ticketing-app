import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "tickets-commonutils";
import { Order } from "../../models/order";

const router = express.Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.user!.id }).populate("ticket");
  res.send(orders);
});

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate("ticket");

  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId != req.user!.id) {
    throw new NotAuthorizedError();
  }
  res.send(order);
});

export { router as getRouter };

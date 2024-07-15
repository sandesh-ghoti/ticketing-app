import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "tickets-commonutils";
import { body } from "express-validator";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";
import { PaymentCreatedPublisher } from "../../events/publishers/payment-created-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("token is required"),
    body("orderId").not().isEmpty().withMessage("orderId is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.user!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("order was cancelled");
    }

    const chargeOptions = {
      amount: order.price * 100,
      currency: "usd",
      source: token,
    };
    const charge = await stripe.charges.create(chargeOptions);

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    // publish payment created event
    new PaymentCreatedPublisher(natsWrapper.nc).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createRouter };

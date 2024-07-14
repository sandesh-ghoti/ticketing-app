import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "tickets-commonutils";
import { body } from "express-validator";

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

    res.status(201).send();
  }
);

export { router as createRouter };

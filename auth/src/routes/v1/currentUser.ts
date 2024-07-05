import express from "express";
import { currentUser } from "tickets-commonutils";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({ user: req.user || null });
});

export { router as currentUserRouter };

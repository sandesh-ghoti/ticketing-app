import { Router } from "express";
import { signupRouter } from "./signup";
import { signoutRouter } from "./signout";
import { signinRouter } from "./signin";
import { currentUser } from "tickets-commonutils";

const router = Router();

router.get("/", (req, res) => {
  return res.send("Hello World!");
});
router.use("/signup", signupRouter);
router.use("/signin", signinRouter);
router.use("/signout", signoutRouter);
router.use("/current_user", currentUser);
export default router;

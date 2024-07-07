import { Router } from "express";
import { testRouter } from "./test";

const router = Router();

router.get("/", (req, res) => {
  return res.send("Hello!, tickets-srv is up!");
});
router.use("/test", testRouter);
export default router;

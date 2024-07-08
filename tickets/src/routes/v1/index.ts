import { Router } from "express";
import { createRouter } from "./create";
import { getRouter } from "./get";
import { updateRouter } from "./update";

const router = Router();

router.use("/", createRouter);
router.use("/", getRouter);
router.use("/", updateRouter);
export default router;

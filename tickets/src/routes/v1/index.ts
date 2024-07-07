import { Router } from "express";
import { createRouter } from "./create";
import { getRouter } from "./get";

const router = Router();

router.use("/", createRouter);
router.use("/", getRouter);
export default router;

import { Router } from "express";
import { createRouter } from "./create";
import { getRouter } from "./get";
import { deleteRouter } from "./delete";

const router = Router();

router.use("/", createRouter);
router.use("/", getRouter);
router.use("/", deleteRouter);
export default router;

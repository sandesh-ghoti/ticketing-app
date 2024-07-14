import { Router } from "express";
import { createRouter } from "./create";

const router = Router();

router.use("/", createRouter);
export default router;

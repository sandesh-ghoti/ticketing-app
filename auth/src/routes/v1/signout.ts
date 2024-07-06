import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  req.session = undefined;
  res.send({});
});

export { router as signoutRouter };

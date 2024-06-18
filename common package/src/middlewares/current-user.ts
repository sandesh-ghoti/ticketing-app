import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}
interface SessionPayload {
  jwt: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      session?: SessionPayload;
    }
  }
}
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.user = payload;
    next();
  } catch (error) {
    next();
  }
};

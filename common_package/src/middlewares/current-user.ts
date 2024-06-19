import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../types/types";
type userPayloadType = Extract<Request, UserPayload>;

/**
 * Middleware to attach the current user to the request object.
 *
 * This middleware verifies the JWT token stored in the user's session and attaches the decoded user payload to the request object.
 * If the JWT token is invalid or not found, the middleware simply calls next() without attaching any user information.
 *
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The Express next function.
 */
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
    ) as userPayloadType;
    req.user = payload;
    next();
  } catch (error) {
    next();
  }
};

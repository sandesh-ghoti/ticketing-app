import type { SessionPayload, UserPayload } from "./types";
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      session?: SessionPayload;
    }
  }
}

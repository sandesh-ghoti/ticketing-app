export interface global {}
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

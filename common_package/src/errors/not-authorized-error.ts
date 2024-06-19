import { CustomError } from "./custom-error";

/**
 * Represents a "Not Authorized" error.
 *
 * This error is thrown when a user is not authorized to perform a requested action.
 */
export class NotAuthorizedError extends CustomError {
  constructor() {
    super("Not Authorized");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  statusCode = 401;
  serializeErrors() {
    return [{ message: "Not Authorized" }];
  }
}

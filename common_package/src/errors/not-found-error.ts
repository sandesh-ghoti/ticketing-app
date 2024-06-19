import { CustomError } from "./custom-error";

/**
 * Represents a "Not Found" error.
 *
 * This error is thrown when a requested resource is not found.
 */
export class NotFoundError extends CustomError {
  reason = "NotFoundError";
  constructor() {
    super("NotFoundError");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  statusCode = 404;
  serializeErrors() {
    return [{ message: this.reason }];
  }
}

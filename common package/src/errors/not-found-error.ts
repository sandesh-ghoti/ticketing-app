import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  reason = "NotFoundError";
  constructor() {
    super("NotFoundError");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  statusCode: 404;
  serializeErrors() {
    return [{ message: this.reason }];
  }
}

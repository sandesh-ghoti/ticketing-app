import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  constructor() {
    super("Error connecting to database");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  reason = "Error connecting to database";
  statusCode: 500;
  serializeErrors() {
    return [{ message: this.reason }];
  }
}

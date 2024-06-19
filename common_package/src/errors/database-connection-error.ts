import { CustomError } from "./custom-error";

/**
 * Represents an error related to database connection.
 *
 * This error is thrown when there is a problem connecting to the database.
 */
export class DatabaseConnectionError extends CustomError {
  constructor() {
    super("Error connecting to database");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  reason = "Error connecting to database";
  statusCode = 500;
  serializeErrors() {
    return [{ message: this.reason }];
  }
}

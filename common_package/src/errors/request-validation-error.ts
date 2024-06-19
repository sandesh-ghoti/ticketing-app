import { CustomError } from "./custom-error";
import { ValidationError } from "express-validator";

/**
 * Represents an error that occurs when request parameters fail validation.
 *
 * This class extends `CustomError` and provides a specific error message and status code for invalid request parameters.
 * It also serializes the validation errors into a format suitable for client-side consumption.
 */
export class RequestValidationError extends CustomError {
  /**
   * Constructs a new `RequestValidationError` instance.
   *
   * @param errors An array of `ValidationError` objects from `express-validator`.
   */
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters passed");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  /**
   * The HTTP status code associated with this error.
   */
  statusCode = 403;

  /**
   * Serializes the validation errors into a format suitable for client-side consumption.
   *
   * @returns An array of objects containing the error message and the field that failed validation.
   */
  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === "field") {
        return { message: err.msg, field: err.path };
      } else {
        return { message: err.msg };
      }
    });
  }
}

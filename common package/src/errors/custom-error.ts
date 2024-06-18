/**
 * Abstract class representing a custom error.
 *
 * This class provides a base structure for creating custom errors with specific status codes and serialized error messages.
 */
export abstract class CustomError extends Error {
  /**
   * The HTTP status code associated with the error.
   */
  abstract statusCode: number;

  /**
   * Constructs a new CustomError instance.
   *
   * @param message The error message.
   */
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  /**
   * Serializes the error into an array of objects containing error messages and optional field names.
   *
   * @returns An array of error objects.
   */
  abstract serializeErrors(): { message: string; field?: string }[];
}

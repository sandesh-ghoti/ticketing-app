# Common Utilities for Express Applications

A collection of reusable utilities and middleware for Express.js applications, aimed at handling common tasks such as error handling, user authentication, and request validation.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Error Handling Middleware](#error-handling-middleware)
  - [Current User Middleware](#current-user-middleware)
  - [Request Validation Middleware](#request-validation-middleware)
- [Custom Errors](#custom-errors)
  - [CustomError](#customerror)
  - [DatabaseConnectionError](#databaseconnectionerror)
  - [RequestValidationError](#requestvalidationerror)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install the package via npm:

```bash
npm install @sandeshghoti/tickets-commonutils
```

## Usage

### Error Handling Middleware

This middleware is used to handle errors thrown during request processing. It catches custom errors and responds with appropriate HTTP status codes and messages.

#### Example

```javascript
import express from "express";
import { errorHandler } from "@sandeshghoti/tickets-commonutils";
import { CustomError } from "@sandeshghoti/tickets-commonutils/errors";

const app = express();

// Middleware to handle errors
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

### Current User Middleware

This middleware attaches the current user to the request object if a valid JWT token is present in the session. It decodes the JWT token and attaches the user payload to `req.user`.

#### Example

```javascript
import express from "express";
import { currentUser } from "@sandeshghoti/tickets-commonutils";

const app = express();

// Middleware to attach current user
app.use(currentUser);

app.get("/profile", (req, res) => {
  if (req.user) {
    res.send(`Hello, ${req.user.email}`);
  } else {
    res.send("Hello, Guest");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

### Request Validation Middleware

This middleware validates incoming requests based on the validation rules defined using `express-validator`. It throws a `RequestValidationError` if the validation fails.

#### Example

```javascript
import express from "express";
import { body } from "express-validator";
import { validateRequest } from "@sandeshghoti/tickets-commonutils";

const app = express();
app.use(express.json());

app.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    validateRequest,
  ],
  (req, res) => {
    res.send("User signed up successfully");
  }
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

## Custom Errors

### `CustomError`

An abstract class for defining custom errors with specific HTTP status codes and error messages.

#### Example

```javascript
import { CustomError } from "@sandeshghoti/tickets-commonutils/errors";

class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Resource not found");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: "Resource not found" }];
  }
}
```

### `DatabaseConnectionError`

An error thrown when there is an issue connecting to the database. Extends `CustomError`.

#### Example

```javascript
import { DatabaseConnectionError } from "@sandeshghoti/tickets-commonutils/errors";

app.get("/connect", (req, res) => {
  try {
    // Simulate database connection
    throw new DatabaseConnectionError();
  } catch (err) {
    next(err);
  }
});
```

### `RequestValidationError`

An error thrown when request validation fails. Extends `CustomError` and provides details about the validation errors.

#### Example

```javascript
import { body } from "express-validator";
import { RequestValidationError } from "@sandeshghoti/tickets-commonutils/errors";

app.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").notEmpty().withMessage("Password is required"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
      }
      next();
    },
  ],
  (req, res) => {
    res.send("User logged in successfully");
  }
);
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you find any bugs or have suggestions for improvements.

## License

This package is open source and available under the [MIT License](LICENSE).

---

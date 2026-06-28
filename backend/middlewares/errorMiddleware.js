const ApiError = require("../utils/ApiError");

// 404 handler: runs when no route matched the request.
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Central error handler: every error (thrown or passed to next) ends up
// here, so we format error responses in ONE place. Express knows this
// is the error handler because it has four arguments.
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  // Mongoose: invalid ObjectId (e.g. a bad :id in the URL).
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose: schema validation failed.
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  // MongoDB: duplicate key (e.g. an email that already exists).
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = { notFound, errorHandler };

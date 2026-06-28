// ApiError is a small custom error class that also carries an HTTP
// status code. Controllers throw this when something is wrong, and the
// central error middleware reads the status code to build the response.
//
// Usage:
//   throw new ApiError(404, "Test not found");
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;

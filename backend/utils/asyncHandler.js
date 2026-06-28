// asyncHandler wraps an async route handler in a try/catch so we do
// NOT have to repeat try/catch in every controller. If the handler
// throws, the error is forwarded to the central error middleware.
//
// Usage:
//   router.get("/", asyncHandler(async (req, res) => { ... }));
const asyncHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = asyncHandler;

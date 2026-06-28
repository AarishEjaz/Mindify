const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

// "validate" runs after a list of express-validator rules. If any rule
// failed, it stops the request with the first error message. Putting it
// here means every route validates the same way.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    throw new ApiError(400, firstError.msg);
  }
  next();
};

module.exports = { validate };

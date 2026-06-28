const ApiError = require("../utils/ApiError");

// "adminOnly" must run AFTER "protect" (so req.userType is set). It blocks
// anyone whose token is not an admin token from reaching admin routes.
const adminOnly = (req, res, next) => {
  if (req.userType !== "admin") {
    throw new ApiError(403, "Access denied, admin only");
  }
  next();
};

module.exports = { adminOnly };

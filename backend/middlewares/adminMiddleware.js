const ApiError = require("../utils/ApiError");

// "adminOnly" must run AFTER "protect" (so req.user already exists).
// It blocks anyone who is not an admin from reaching admin routes.
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Access denied, admin only");
  }
  next();
};

module.exports = { adminOnly };

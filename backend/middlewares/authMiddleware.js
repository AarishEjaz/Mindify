const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// "protect" checks that the request has a valid JWT. If it does, it
// loads the matching user (without the password) and attaches it to
// req.user so later code knows who is making the request.
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized, no token provided");
  }

  // Header looks like: "Bearer <token>"
  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, "Not authorized, token is invalid or expired");
  }

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    throw new ApiError(401, "Not authorized, user no longer exists");
  }

  req.user = user;
  next();
});

module.exports = { protect };

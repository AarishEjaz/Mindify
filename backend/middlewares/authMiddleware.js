const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// "protect" checks that the request has a valid JWT. The token's "kind"
// says whether it belongs to a user or an admin, so we load the account
// from the correct collection and attach it to req.user. req.userType
// holds "user" or "admin" for later checks (e.g. adminOnly).
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized, no token provided");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, "Not authorized, token is invalid or expired");
  }

  // Older tokens without a "kind" are treated as regular users.
  const kind = decoded.kind === "admin" ? "admin" : "user";

  const Model = kind === "admin" ? Admin : User;
  const account = await Model.findById(decoded.id).select("-password");
  if (!account) {
    throw new ApiError(401, "Not authorized, account no longer exists");
  }

  req.user = account;
  req.userType = kind;
  next();
});

module.exports = { protect };

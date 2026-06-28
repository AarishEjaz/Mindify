const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const { sendSuccess } = require("../utils/apiResponse");

// Build the safe user object we send back (never include the password).
const toPublicUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

// POST /api/auth/register  (public)
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  // Password gets hashed automatically by the User model's pre-save hook.
  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  sendSuccess(res, 201, "Registration successful", {
    user: toPublicUser(user),
    token,
  });
});

// POST /api/auth/login  (public)
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id);

  sendSuccess(res, 200, "Login successful", {
    user: toPublicUser(user),
    token,
  });
});

// GET /api/auth/me  (protected) - who am I?
const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Current user", { user: toPublicUser(req.user) });
});

module.exports = { register, login, getMe };

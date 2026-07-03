const User = require("../models/User");
const Admin = require("../models/Admin");
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
  const token = generateToken(user._id, "user");

  // Token is returned in the body; the client stores it and sends it back
  // as an "Authorization: Bearer <token>" header on each request.
  sendSuccess(res, 201, "Registration successful", {
    user: toPublicUser(user),
    token,
  });
});

// Shared login logic: look an account up in the given model, verify the
// password, and return it. Written once, used by both logins.
const authenticate = async (Model, email, password) => {
  const account = await Model.findOne({ email });
  if (!account) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await account.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  return account;
};

// POST /api/auth/login  (public) - USER login (User collection)
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticate(User, email, password);
  const token = generateToken(user._id, "user");

  sendSuccess(res, 200, "Login successful", {
    user: toPublicUser(user),
    token,
  });
});

// POST /api/auth/admin/login  (public) - ADMIN login (Admin collection)
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await authenticate(Admin, email, password);
  const token = generateToken(admin._id, "admin");

  sendSuccess(res, 200, "Admin login successful", {
    user: toPublicUser(admin),
    token,
  });
});

// GET /api/auth/me  (protected) - who am I?
const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Current user", { user: toPublicUser(req.user) });
});

module.exports = { register, login, adminLogin, getMe };

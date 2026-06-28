const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validate");
const { authLimiter } = require("../middlewares/rateLimiter");
const { registerRules, loginRules } = require("../validators/authValidator");

// The stricter authLimiter guards register and login against brute force.
router.post("/register", authLimiter, registerRules, validate, register);
router.post("/login", authLimiter, loginRules, validate, login);
router.get("/me", protect, getMe);

module.exports = router;

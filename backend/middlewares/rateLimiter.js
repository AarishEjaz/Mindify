const rateLimit = require("express-rate-limit");

// Rate limiting protects the API from too many requests (spam, brute
// force, accidental loops). We keep two limiters:

// 1) A general limiter for the whole API.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // each IP may make up to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// 2) A stricter limiter for login/register, where brute-force is a risk.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // only 20 auth attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

module.exports = { apiLimiter, authLimiter };

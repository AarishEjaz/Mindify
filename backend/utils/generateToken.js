const jwt = require("jsonwebtoken");

// Create a signed JWT for an account. "kind" tells us which collection
// the id belongs to ("user" or "admin"), so the auth middleware can load
// the account from the right model.
const generateToken = (id, kind = "user") => {
  return jwt.sign({ id, kind }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = generateToken;

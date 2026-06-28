const jwt = require("jsonwebtoken");

// Create a signed JWT for a given user id. The token is what the
// frontend stores and sends back on protected requests.
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = generateToken;

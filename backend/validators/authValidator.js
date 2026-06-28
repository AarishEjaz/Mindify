const { body } = require("express-validator");

// Rules for the register form.
const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Rules for the login form.
const loginRules = [
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = { registerRules, loginRules };

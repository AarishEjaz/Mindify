const { body } = require("express-validator");

const allowedTypes = ["personality", "career", "aptitude", "behavioral"];

// Rules for creating a test. On update we reuse the same fields but make
// them optional, because the admin may change only one field.
const createTestRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("type")
    .isIn(allowedTypes)
    .withMessage(`Type must be one of: ${allowedTypes.join(", ")}`),
  body("traits")
    .optional()
    .isArray()
    .withMessage("Traits must be an array"),
];

const updateTestRules = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("type")
    .optional()
    .isIn(allowedTypes)
    .withMessage(`Type must be one of: ${allowedTypes.join(", ")}`),
  body("traits").optional().isArray().withMessage("Traits must be an array"),
];

module.exports = { createTestRules, updateTestRules };

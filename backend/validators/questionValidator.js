const { body } = require("express-validator");

// Rules for creating a question. Each question needs text, a trait, the
// owning test, and at least one scored option.
const createQuestionRules = [
  body("testId").notEmpty().withMessage("testId is required"),
  body("questionText")
    .trim()
    .notEmpty()
    .withMessage("Question text is required"),
  body("trait").trim().notEmpty().withMessage("Trait is required"),
  body("reverseScored")
    .optional()
    .isBoolean()
    .withMessage("reverseScored must be true or false"),
  body("options")
    .isArray({ min: 1 })
    .withMessage("Options must be a non-empty array"),
  body("options.*.text")
    .trim()
    .notEmpty()
    .withMessage("Each option needs text"),
  body("options.*.score")
    .isInt({ min: 1, max: 5 })
    .withMessage("Each option score must be between 1 and 5"),
];

const updateQuestionRules = [
  body("questionText")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Question text cannot be empty"),
  body("trait").optional().trim().notEmpty().withMessage("Trait cannot be empty"),
  body("reverseScored")
    .optional()
    .isBoolean()
    .withMessage("reverseScored must be true or false"),
  body("options")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Options must be a non-empty array"),
];

module.exports = { createQuestionRules, updateQuestionRules };

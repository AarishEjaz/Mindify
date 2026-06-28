const { body } = require("express-validator");

// Rules for starting an attempt.
const startAttemptRules = [
  body("testId").notEmpty().withMessage("testId is required"),
];

// Rules for autosaving answers. The frontend sends an array of answers,
// each with the question id and the option text the user picked. It must
// NOT send scores; the backend calculates those itself.
const saveAnswersRules = [
  body("answers").isArray({ min: 1 }).withMessage("Answers must be a non-empty array"),
  body("answers.*.questionId")
    .notEmpty()
    .withMessage("Each answer needs a questionId"),
  body("answers.*.selectedOptionText")
    .trim()
    .notEmpty()
    .withMessage("Each answer needs a selectedOptionText"),
];

module.exports = { startAttemptRules, saveAnswersRules };

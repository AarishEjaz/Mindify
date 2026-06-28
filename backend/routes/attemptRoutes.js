const express = require("express");
const router = express.Router();

const {
  startAttempt,
  saveAnswers,
  submitAttempt,
} = require("../controllers/attemptController");
const { protect } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validate");
const {
  startAttemptRules,
  saveAnswersRules,
} = require("../validators/attemptValidator");

// All attempt routes require a logged-in user.
router.post("/start", protect, startAttemptRules, validate, startAttempt);
router.patch(
  "/:attemptId/answers",
  protect,
  saveAnswersRules,
  validate,
  saveAnswers
);
router.post("/:attemptId/submit", protect, submitAttempt);

module.exports = router;

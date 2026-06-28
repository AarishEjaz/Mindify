const express = require("express");
const router = express.Router();

const {
  createTest,
  listTestsAdmin,
  updateTest,
  createQuestion,
  listQuestionsAdmin,
  updateQuestion,
  getReports,
} = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");
const { validate } = require("../middlewares/validate");
const {
  createTestRules,
  updateTestRules,
} = require("../validators/testValidator");
const {
  createQuestionRules,
  updateQuestionRules,
} = require("../validators/questionValidator");

// Every admin route requires a logged-in user who is also an admin.
// Applying both middlewares here means we do not repeat them on each line.
router.use(protect, adminOnly);

// Tests
router.post("/tests", createTestRules, validate, createTest);
router.get("/tests", listTestsAdmin);
router.patch("/tests/:id", updateTestRules, validate, updateTest);

// Questions
router.post("/questions", createQuestionRules, validate, createQuestion);
router.get("/questions", listQuestionsAdmin);
router.patch("/questions/:id", updateQuestionRules, validate, updateQuestion);

// Reports
router.get("/reports", getReports);

module.exports = router;

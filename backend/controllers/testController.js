const Test = require("../models/Test");
const Question = require("../models/Question");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { getPagination, buildPageMeta } = require("../utils/pagination");

// GET /api/tests  (user) - list active tests, paginated.
const listTests = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { isActive: true };

  // Run the count and the page query together for speed.
  const [tests, totalItems] = await Promise.all([
    Test.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Test.countDocuments(filter),
  ]);

  sendSuccess(res, 200, "Active tests", {
    tests,
    pagination: buildPageMeta(page, limit, totalItems),
  });
});

// GET /api/tests/:id  (user) - test details + instructions + questions.
// Note: we send option text and score for display only. The backend
// still recalculates scores at submit time, so this is not a security
// risk (there is no "correct" answer to hide on a Likert scale).
const getTestById = asyncHandler(async (req, res) => {
  const test = await Test.findOne({ _id: req.params.id, isActive: true });
  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  const questions = await Question.find({
    testId: test._id,
    isActive: true,
  }).sort({ order: 1, createdAt: 1 });

  sendSuccess(res, 200, "Test details", { test, questions });
});

module.exports = { listTests, getTestById };

const Test = require("../models/Test");
const Question = require("../models/Question");
const Result = require("../models/Result");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { getPagination, buildPageMeta } = require("../utils/pagination");

// ---------- Tests ----------

// POST /api/admin/tests
const createTest = asyncHandler(async (req, res) => {
  const test = await Test.create(req.body);
  sendSuccess(res, 201, "Test created", { test });
});

// GET /api/admin/tests - list every test (active or not), paginated.
const listTestsAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const [tests, totalItems] = await Promise.all([
    Test.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Test.countDocuments(),
  ]);

  sendSuccess(res, 200, "All tests", {
    tests,
    pagination: buildPageMeta(page, limit, totalItems),
  });
});

// PATCH /api/admin/tests/:id
const updateTest = asyncHandler(async (req, res) => {
  const test = await Test.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!test) {
    throw new ApiError(404, "Test not found");
  }
  sendSuccess(res, 200, "Test updated", { test });
});

// ---------- Questions ----------

// POST /api/admin/questions
const createQuestion = asyncHandler(async (req, res) => {
  // Make sure the question is attached to a real test.
  const test = await Test.findById(req.body.testId);
  if (!test) {
    throw new ApiError(404, "Cannot add question: test not found");
  }
  const question = await Question.create(req.body);
  sendSuccess(res, 201, "Question created", { question });
});

// GET /api/admin/questions - list questions, optionally filtered by test.
const listQuestionsAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};
  if (req.query.testId) {
    filter.testId = req.query.testId;
  }

  const [questions, totalItems] = await Promise.all([
    Question.find(filter).sort({ order: 1, createdAt: 1 }).skip(skip).limit(limit),
    Question.countDocuments(filter),
  ]);

  sendSuccess(res, 200, "Questions", {
    questions,
    pagination: buildPageMeta(page, limit, totalItems),
  });
});

// PATCH /api/admin/questions/:id
const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!question) {
    throw new ApiError(404, "Question not found");
  }
  sendSuccess(res, 200, "Question updated", { question });
});

// ---------- Reports ----------

// GET /api/admin/reports - every user's result, paginated.
const getReports = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const [reports, totalItems] = await Promise.all([
    Result.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email")
      .populate("testId", "title type"),
    Result.countDocuments(),
  ]);

  sendSuccess(res, 200, "All reports", {
    reports,
    pagination: buildPageMeta(page, limit, totalItems),
  });
});

module.exports = {
  createTest,
  listTestsAdmin,
  updateTest,
  createQuestion,
  listQuestionsAdmin,
  updateQuestion,
  getReports,
};

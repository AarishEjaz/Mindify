const Result = require("../models/Result");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

// GET /api/results/:attemptId  (user) - view OWN result only.
const getResultByAttempt = asyncHandler(async (req, res) => {
  const result = await Result.findOne({ attemptId: req.params.attemptId })
    .populate("testId", "title type")
    .populate("userId", "name email");

  if (!result) {
    throw new ApiError(404, "Result not found");
  }

  // SECURITY: a user may only see their own result.
  const ownerId = result.userId._id ? result.userId._id : result.userId;
  if (ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to view this result");
  }

  sendSuccess(res, 200, "Result", { result });
});

module.exports = { getResultByAttempt };

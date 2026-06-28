const Attempt = require("../models/Attempt");
const Test = require("../models/Test");
const Result = require("../models/Result");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildScoredAnswers } = require("../utils/answerScoring");
const {
  calculateTraitScores,
  buildFinalSummary,
} = require("../utils/scoring");
const { DISCLAIMER } = require("../utils/constants");

// Small helper: load an attempt and make sure it belongs to this user.
// Reused by saveAnswers and submitAttempt so the ownership check is
// written only once.
const getOwnedAttempt = async (attemptId, userId) => {
  const attempt = await Attempt.findById(attemptId);
  if (!attempt) {
    throw new ApiError(404, "Attempt not found");
  }
  if (attempt.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to use this attempt");
  }
  return attempt;
};

// POST /api/attempts/start  (user)
// Start a new attempt. If the user already has an in-progress attempt
// for this test, we return that one so they can resume instead of
// creating duplicates.
const startAttempt = asyncHandler(async (req, res) => {
  const { testId } = req.body;

  const test = await Test.findOne({ _id: testId, isActive: true });
  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  let attempt = await Attempt.findOne({
    userId: req.user._id,
    testId: test._id,
    status: "in-progress",
  });

  if (!attempt) {
    attempt = await Attempt.create({
      userId: req.user._id,
      testId: test._id,
      answers: [],
      status: "in-progress",
    });
  }

  sendSuccess(res, 201, "Attempt started", { attempt });
});

// PATCH /api/attempts/:attemptId/answers  (user)
// Autosave answers. The frontend sends [{ questionId, selectedOptionText }].
// The backend scores them and merges them into the attempt (replacing any
// previous answer for the same question).
const saveAnswers = asyncHandler(async (req, res) => {
  const attempt = await getOwnedAttempt(req.params.attemptId, req.user._id);

  if (attempt.status === "completed") {
    throw new ApiError(400, "This attempt is already submitted and cannot be changed");
  }

  // Turn the raw answers into securely scored answers.
  const scoredAnswers = await buildScoredAnswers(attempt.testId, req.body.answers);

  // Merge: start from existing answers indexed by question, then apply
  // the new ones on top.
  const answersByQuestion = {};
  attempt.answers.forEach((answer) => {
    answersByQuestion[answer.questionId.toString()] = answer;
  });
  scoredAnswers.forEach((answer) => {
    answersByQuestion[answer.questionId.toString()] = answer;
  });

  attempt.answers = Object.values(answersByQuestion);
  await attempt.save();

  sendSuccess(res, 200, "Answers saved", { attempt });
});

// POST /api/attempts/:attemptId/submit  (user)
// Submit the attempt: recalculate scores from scratch on the server,
// build the result report, and mark the attempt completed.
const submitAttempt = asyncHandler(async (req, res) => {
  const attempt = await getOwnedAttempt(req.params.attemptId, req.user._id);

  // Prevent submitting the same attempt twice.
  if (attempt.status === "completed") {
    throw new ApiError(400, "This attempt has already been submitted");
  }

  if (attempt.answers.length === 0) {
    throw new ApiError(400, "Cannot submit an attempt with no answers");
  }

  const test = await Test.findById(attempt.testId);
  if (!test) {
    throw new ApiError(404, "Test not found for this attempt");
  }

  // SECURITY: re-score from the database using only the saved option
  // choices, so we never trust any score the frontend might have sent.
  const rawAnswers = attempt.answers.map((answer) => ({
    questionId: answer.questionId.toString(),
    selectedOptionText: answer.selectedOptionText,
  }));
  const scoredAnswers = await buildScoredAnswers(attempt.testId, rawAnswers);

  const traitScores = calculateTraitScores(scoredAnswers, test.traits);
  const finalSummary = buildFinalSummary(traitScores);

  // Save the re-scored answers and mark the attempt completed.
  attempt.answers = scoredAnswers;
  attempt.status = "completed";
  attempt.submittedAt = new Date();
  await attempt.save();

  const result = await Result.create({
    userId: req.user._id,
    testId: test._id,
    attemptId: attempt._id,
    traitScores,
    finalSummary,
    disclaimer: test.disclaimer || DISCLAIMER,
  });

  sendSuccess(res, 201, "Attempt submitted", { result });
});

module.exports = { startAttempt, saveAnswers, submitAttempt };

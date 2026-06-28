const Question = require("../models/Question");
const ApiError = require("./ApiError");
const { getFinalScore } = require("./scoring");

// SECURITY: the frontend only sends which option text the user picked.
// It never sends scores. This helper looks each question up in the
// database, finds the chosen option, and calculates the scores on the
// server. This is the single place where raw answers become scored
// answers, used by both autosave and submit.
//
// rawAnswers: [{ questionId, selectedOptionText }]
// returns:    [{ questionId, selectedOptionText, rawScore, finalScore, trait }]
const buildScoredAnswers = async (testId, rawAnswers) => {
  const questionIds = rawAnswers.map((answer) => answer.questionId);

  // Fetch only the questions that belong to this test.
  const questions = await Question.find({
    _id: { $in: questionIds },
    testId: testId,
  });

  // Index questions by id for quick lookup.
  const questionById = {};
  questions.forEach((question) => {
    questionById[question._id.toString()] = question;
  });

  return rawAnswers.map((answer) => {
    const question = questionById[answer.questionId];
    if (!question) {
      throw new ApiError(400, `Question not found for this test: ${answer.questionId}`);
    }

    const option = question.options.find(
      (item) => item.text === answer.selectedOptionText
    );
    if (!option) {
      throw new ApiError(
        400,
        `Invalid option "${answer.selectedOptionText}" for question ${answer.questionId}`
      );
    }

    const rawScore = option.score;
    const finalScore = getFinalScore(rawScore, question.reverseScored);

    return {
      questionId: question._id,
      selectedOptionText: option.text,
      rawScore: rawScore,
      finalScore: finalScore,
      trait: question.trait,
    };
  });
};

module.exports = { buildScoredAnswers };

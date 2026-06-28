const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attempt",
      required: true,
    },
    traitScores: [
      {
        trait: { type: String, required: true },
        score: { type: Number, required: true },
        maxScore: { type: Number, required: true },
        percentage: { type: Number, required: true },
        level: {
          type: String,
          enum: ["Low", "Moderate", "High"],
          required: true,
        },
        interpretation: { type: String, required: true },
      },
    ],
    finalSummary: { type: String },
    disclaimer: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);

const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
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
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedOptionText: { type: String, required: true },
        rawScore: { type: Number, required: true },
        finalScore: { type: Number, required: true },
        trait: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attempt", attemptSchema);

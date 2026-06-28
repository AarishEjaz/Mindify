const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    questionText: { type: String, required: true, trim: true },
    trait: { type: String, required: true },
    reverseScored: { type: Boolean, default: false },
    options: [
      {
        text: { type: String, required: true },
        score: { type: Number, required: true, min: 1, max: 5 },
      },
    ],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);

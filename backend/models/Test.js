const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["personality", "career", "aptitude", "behavioral"],
      required: true,
    },
    durationInMinutes: { type: Number, default: 30 },
    instructions: { type: String },
    disclaimer: { type: String },
    traits: [
      {
        name: { type: String, required: true },
        description: { type: String },
        lowInterpretation: { type: String },
        moderateInterpretation: { type: String },
        highInterpretation: { type: String },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);

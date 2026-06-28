require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Test = require("../models/Test");
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");
const Result = require("../models/Result");
const { LIKERT_OPTIONS, DISCLAIMER } = require("../utils/constants");

// The five career/personality traits for the MVP test.
const traits = [
  {
    name: "Technical",
    description: "Problem solving, systems thinking, logical work.",
    lowInterpretation:
      "You may prefer work that is less focused on technical detail and systems.",
    moderateInterpretation:
      "You enjoy technical problem-solving when it is paired with other kinds of work.",
    highInterpretation:
      "You show a strong preference for logical problem-solving and structured, technical tasks.",
  },
  {
    name: "Creative",
    description: "Original thinking, design, ideas, expression.",
    lowInterpretation:
      "You may prefer structured tasks over open-ended creative work.",
    moderateInterpretation:
      "You may enjoy creative work, especially when ideas are combined with clear goals.",
    highInterpretation:
      "You show a strong preference for original thinking, design, and creative expression.",
  },
  {
    name: "Social",
    description: "Communication, helping, teamwork, mentoring.",
    lowInterpretation:
      "You may prefer working independently rather than in highly social roles.",
    moderateInterpretation:
      "You are comfortable working with people while also valuing focused solo time.",
    highInterpretation:
      "You show a strong preference for communication, helping others, and teamwork.",
  },
  {
    name: "Business",
    description: "Leadership, planning, growth, persuasion.",
    lowInterpretation:
      "You may prefer supporting roles over leading and persuading others.",
    moderateInterpretation:
      "You enjoy planning and leading in the right situations.",
    highInterpretation:
      "You show a strong preference for leadership, planning, and driving growth.",
  },
  {
    name: "Research",
    description: "Analysis, curiosity, deep learning, investigation.",
    lowInterpretation:
      "You may prefer applying knowledge over deep investigation.",
    moderateInterpretation:
      "You enjoy investigation and analysis alongside practical work.",
    highInterpretation:
      "You show a strong preference for analysis, curiosity, and deep investigation.",
  },
];

// Six question texts per trait (30 total). A few are reverse-scored to
// show that the scoring logic handles them correctly.
const questionsByTrait = {
  Technical: [
    { text: "I enjoy solving complex logical problems.", reverse: false },
    { text: "I like understanding how systems work step by step.", reverse: false },
    { text: "I feel comfortable working with technical tools and software.", reverse: false },
    { text: "Debugging or fixing things piece by piece is satisfying to me.", reverse: false },
    { text: "I avoid tasks that require careful logical reasoning.", reverse: true },
    { text: "I enjoy breaking a big problem into smaller parts.", reverse: false },
  ],
  Creative: [
    { text: "I often come up with original ideas.", reverse: false },
    { text: "I enjoy designing or creating new things.", reverse: false },
    { text: "I like expressing myself through creative work.", reverse: false },
    { text: "I prefer following fixed rules over inventing new approaches.", reverse: true },
    { text: "Brainstorming many possibilities excites me.", reverse: false },
    { text: "I enjoy imagining how things could be different.", reverse: false },
  ],
  Social: [
    { text: "I enjoy helping other people learn.", reverse: false },
    { text: "Working in a team energizes me.", reverse: false },
    { text: "I communicate easily with different kinds of people.", reverse: false },
    { text: "I would rather work alone than with a group.", reverse: true },
    { text: "I like mentoring or supporting others.", reverse: false },
    { text: "I pay attention to how other people are feeling.", reverse: false },
  ],
  Business: [
    { text: "I enjoy planning toward long-term goals.", reverse: false },
    { text: "I like taking the lead on group projects.", reverse: false },
    { text: "I am comfortable persuading others to my point of view.", reverse: false },
    { text: "I am interested in how organizations grow.", reverse: false },
    { text: "I dislike being responsible for important decisions.", reverse: true },
    { text: "I enjoy organizing people and resources to get results.", reverse: false },
  ],
  Research: [
    { text: "I enjoy investigating questions deeply.", reverse: false },
    { text: "I like learning new things just out of curiosity.", reverse: false },
    { text: "I enjoy analyzing data to find patterns.", reverse: false },
    { text: "I prefer quick answers over careful investigation.", reverse: true },
    { text: "I like reading and studying a topic in depth.", reverse: false },
    { text: "I enjoy testing ideas to see if they hold up.", reverse: false },
  ],
};

const seed = async () => {
  await connectDB();

  // Start clean so the seed can be run again safely.
  await Promise.all([
    User.deleteMany({}),
    Test.deleteMany({}),
    Question.deleteMany({}),
    Attempt.deleteMany({}),
    Result.deleteMany({}),
  ]);
  console.log("Cleared existing data.");

  // Create a demo admin and a demo user. Passwords are hashed by the
  // User model, so we create them one by one (not with insertMany).
  await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  });
  await User.create({
    name: "Test User",
    email: "user@example.com",
    password: "user123",
    role: "user",
  });
  console.log("Created admin@example.com / admin123 and user@example.com / user123");

  // Create the one MVP test.
  const test = await Test.create({
    title: "Career Personality Assessment",
    description:
      "A short career and personality guidance assessment across five traits.",
    type: "career",
    durationInMinutes: 30,
    instructions:
      "Answer honestly using the 5-point scale. There are no right or wrong answers.",
    disclaimer: DISCLAIMER,
    traits: traits,
    isActive: true,
  });
  console.log("Created test:", test.title);

  // Build all 30 questions, keeping a running order number.
  const questionDocs = [];
  let order = 1;
  Object.keys(questionsByTrait).forEach((traitName) => {
    questionsByTrait[traitName].forEach((item) => {
      questionDocs.push({
        testId: test._id,
        questionText: item.text,
        trait: traitName,
        reverseScored: item.reverse,
        options: LIKERT_OPTIONS,
        order: order,
        isActive: true,
      });
      order = order + 1;
    });
  });

  await Question.insertMany(questionDocs);
  console.log(`Created ${questionDocs.length} questions.`);

  console.log("Seed complete.");
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.connection.close();
  process.exit(1);
});

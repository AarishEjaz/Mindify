// Values that are reused in more than one place live here, so there is
// a single source of truth (no copy-pasting strings around).

// The non-diagnostic disclaimer required by the project. Shown on the
// instructions page and saved onto every result.
const DISCLAIMER =
  "This assessment is for guidance and self-reflection only. It is not a medical or clinical diagnosis.";

// The 5-point Likert scale used by every question.
const LIKERT_OPTIONS = [
  { text: "Strongly Disagree", score: 1 },
  { text: "Disagree", score: 2 },
  { text: "Neutral", score: 3 },
  { text: "Agree", score: 4 },
  { text: "Strongly Agree", score: 5 },
];

module.exports = { DISCLAIMER, LIKERT_OPTIONS };

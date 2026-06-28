// All scoring math lives in this one file so the rules are defined
// exactly once. Controllers and the seed script import from here.

// Reverse-scored questions flip the value: a 5 becomes a 1, etc.
const getFinalScore = (rawScore, reverseScored) => {
  if (reverseScored) {
    return 6 - rawScore;
  }
  return rawScore;
};

// Turn a percentage into a friendly, non-judgmental level.
const getLevel = (percentage) => {
  if (percentage >= 75) {
    return "High";
  }
  if (percentage >= 50) {
    return "Moderate";
  }
  return "Low";
};

// Pick the interpretation text for a trait + level. We first try the
// admin-written text stored on the test; if it is missing we fall back
// to neutral default wording. "traits" is the test.traits array.
const getInterpretation = (traitName, level, traits) => {
  const traitList = traits || [];
  const trait = traitList.find((item) => item.name === traitName);

  if (trait) {
    if (level === "High" && trait.highInterpretation) {
      return trait.highInterpretation;
    }
    if (level === "Moderate" && trait.moderateInterpretation) {
      return trait.moderateInterpretation;
    }
    if (level === "Low" && trait.lowInterpretation) {
      return trait.lowInterpretation;
    }
  }

  return `You show a ${level.toLowerCase()} preference for ${traitName.toLowerCase()} related activities.`;
};

// Group the scored answers by trait and build the per-trait result.
// "answers" is an array of { trait, finalScore }.
// "traits" is the test.traits array (used for interpretation text).
const calculateTraitScores = (answers, traits) => {
  const traitMap = {};

  answers.forEach((answer) => {
    if (!traitMap[answer.trait]) {
      traitMap[answer.trait] = { totalScore: 0, count: 0 };
    }
    traitMap[answer.trait].totalScore += answer.finalScore;
    traitMap[answer.trait].count += 1;
  });

  return Object.keys(traitMap).map((traitName) => {
    const data = traitMap[traitName];
    const maxScore = data.count * 5;
    const percentage = Math.round((data.totalScore / maxScore) * 100);
    const level = getLevel(percentage);

    return {
      trait: traitName,
      score: data.totalScore,
      maxScore: maxScore,
      percentage: percentage,
      level: level,
      interpretation: getInterpretation(traitName, level, traits),
    };
  });
};

// Build a short, encouraging summary that names the strongest trait.
const buildFinalSummary = (traitScores) => {
  if (traitScores.length === 0) {
    return "";
  }

  let topTrait = traitScores[0];
  traitScores.forEach((traitScore) => {
    if (traitScore.percentage > topTrait.percentage) {
      topTrait = traitScore;
    }
  });

  return `Your strongest tendency is ${topTrait.trait} (${topTrait.percentage}%). Use this result for self-reflection and career guidance, not as a clinical diagnosis.`;
};

module.exports = {
  getFinalScore,
  getLevel,
  getInterpretation,
  calculateTraitScores,
  buildFinalSummary,
};

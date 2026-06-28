// Shared TypeScript types for the whole frontend. Keeping them in one
// file means every page describes the data the same way.

export type Role = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface TraitDefinition {
  name: string;
  description?: string;
  lowInterpretation?: string;
  moderateInterpretation?: string;
  highInterpretation?: string;
}

export interface Test {
  _id: string;
  title: string;
  description: string;
  type: string;
  durationInMinutes: number;
  instructions?: string;
  disclaimer?: string;
  traits: TraitDefinition[];
  isActive: boolean;
  createdAt?: string;
}

export interface QuestionOption {
  text: string;
  score: number;
}

export interface Question {
  _id: string;
  testId: string;
  questionText: string;
  trait: string;
  reverseScored: boolean;
  options: QuestionOption[];
  order: number;
}

export interface Attempt {
  _id: string;
  userId: string;
  testId: string;
  answers: {
    questionId: string;
    selectedOptionText: string;
    rawScore: number;
    finalScore: number;
    trait: string;
  }[];
  status: "in-progress" | "completed";
}

export interface TraitScore {
  trait: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: "Low" | "Moderate" | "High";
  interpretation: string;
}

export interface Result {
  _id: string;
  userId: string | { _id: string; name: string; email: string };
  testId: string | { _id: string; title: string; type: string };
  attemptId: string;
  traitScores: TraitScore[];
  finalSummary?: string;
  disclaimer?: string;
  createdAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

// The answer shape the frontend sends to the backend (no scores).
export interface AnswerInput {
  questionId: string;
  selectedOptionText: string;
}

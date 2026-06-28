"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api, { getErrorMessage } from "@/lib/api";
import { Test, Question, QuestionOption } from "@/lib/types";

// The standard 5-point Likert options every new question starts with.
const defaultOptions: QuestionOption[] = [
  { text: "Strongly Disagree", score: 1 },
  { text: "Disagree", score: 2 },
  { text: "Neutral", score: 3 },
  { text: "Agree", score: 4 },
  { text: "Strongly Agree", score: 5 },
];

function AdminQuestionsContent() {
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTestId, setSelectedTestId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // New-question form state.
  const [questionText, setQuestionText] = useState("");
  const [trait, setTrait] = useState("");
  const [reverseScored, setReverseScored] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load all tests once so the admin can pick one.
  useEffect(() => {
    const loadTests = async () => {
      try {
        const response = await api.get("/admin/tests?page=1&limit=50");
        setTests(response.data.data.tests);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };
    loadTests();
  }, []);

  // Load the questions for the selected test.
  const loadQuestions = async (testId: string) => {
    if (!testId) {
      setQuestions([]);
      return;
    }
    try {
      const response = await api.get(
        `/admin/questions?testId=${testId}&page=1&limit=100`
      );
      setQuestions(response.data.data.questions);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleSelectTest = (testId: string) => {
    setSelectedTestId(testId);
    setTrait("");
    loadQuestions(testId);
  };

  // The traits available for the selected test (for the trait dropdown).
  const selectedTest = tests.find((test) => test._id === selectedTestId);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      await api.post("/admin/questions", {
        testId: selectedTestId,
        questionText,
        trait,
        reverseScored,
        options: defaultOptions,
      });
      setMessage("Question created.");
      setQuestionText("");
      setReverseScored(false);
      loadQuestions(selectedTestId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // Flip the reverse-scored flag on an existing question.
  const toggleReverse = async (question: Question) => {
    try {
      await api.patch(`/admin/questions/${question._id}`, {
        reverseScored: !question.reverseScored,
      });
      loadQuestions(selectedTestId);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const inputClass =
    "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-800">
        Manage Questions
      </h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-700">{message}</p>}

      {/* Choose a test */}
      <div className="mb-8">
        <label className="mb-1 block text-sm text-zinc-600">Select a test</label>
        <select
          className={inputClass}
          value={selectedTestId}
          onChange={(e) => handleSelectTest(e.target.value)}
        >
          <option value="">-- choose a test --</option>
          {tests.map((test) => (
            <option key={test._id} value={test._id}>
              {test.title}
            </option>
          ))}
        </select>
      </div>

      {selectedTestId && (
        <>
          {/* Existing questions */}
          <div className="mb-10">
            <h2 className="mb-3 font-semibold text-zinc-700">
              Questions ({questions.length})
            </h2>
            <div className="flex flex-col gap-2">
              {questions.map((question, index) => (
                <div
                  key={question._id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3"
                >
                  <div className="pr-4">
                    <p className="text-sm text-zinc-800">
                      {index + 1}. {question.questionText}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Trait: {question.trait}
                      {question.reverseScored ? " · reverse-scored" : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleReverse(question)}
                    className="shrink-0 rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100"
                  >
                    {question.reverseScored
                      ? "Make normal"
                      : "Make reverse"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Create question form */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-zinc-700">Add a question</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm text-zinc-600">
                  Question text
                </label>
                <textarea
                  className={inputClass}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-zinc-600">Trait</label>
                {selectedTest && selectedTest.traits.length > 0 ? (
                  <select
                    className={inputClass}
                    value={trait}
                    onChange={(e) => setTrait(e.target.value)}
                    required
                  >
                    <option value="">-- choose a trait --</option>
                    {selectedTest.traits.map((traitDef) => (
                      <option key={traitDef.name} value={traitDef.name}>
                        {traitDef.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className={inputClass}
                    value={trait}
                    onChange={(e) => setTrait(e.target.value)}
                    placeholder="Trait name"
                    required
                  />
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={reverseScored}
                  onChange={(e) => setReverseScored(e.target.checked)}
                />
                Reverse-scored question
              </label>

              <p className="text-xs text-zinc-500">
                The 5-point Likert options (Strongly Disagree to Strongly Agree)
                are added automatically.
              </p>

              <button
                type="submit"
                disabled={saving}
                className="self-start rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Add question"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminQuestionsPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminQuestionsContent />
    </ProtectedRoute>
  );
}

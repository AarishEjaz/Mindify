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
    "w-full rounded-[2px] border border-zinc-300 px-3 py-2.5 text-sm transition-colors focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600";

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">
        Admin
      </p>
      <h1 className="mb-8 mt-3 text-3xl font-extrabold tracking-tight text-zinc-900">
        Manage Questions
      </h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {message && (
        <p className="mb-4 rounded-[2px] border-l-2 border-emerald-500 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      )}

      {/* Choose a test */}
      <div className="mb-8">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">Select a test</label>
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
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Questions ({questions.length})
            </h2>
            <div className="flex flex-col gap-2">
              {questions.map((question, index) => (
                <div
                  key={question._id}
                  className="flex items-center justify-between rounded-[3px] border border-zinc-200 bg-white p-3"
                >
                  <div className="flex gap-2.5 pr-4">
                    <span className="text-xs font-bold tabular-nums text-indigo-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm text-zinc-800">{question.questionText}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        Trait: {question.trait}
                        {question.reverseScored ? " · reverse-scored" : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleReverse(question)}
                    className="shrink-0 cursor-pointer rounded-[2px] border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 transition-colors hover:bg-zinc-100"
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
          <div className="rounded-[3px] border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Add a question
            </h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
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
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">Trait</label>
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

              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={reverseScored}
                  onChange={(e) => setReverseScored(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-indigo-600"
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
                className="cursor-pointer self-start rounded-[2px] bg-indigo-600 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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

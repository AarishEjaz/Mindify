"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import api, { getErrorMessage } from "@/lib/api";
import { Question, Test, AnswerInput } from "@/lib/types";

function TestRunner() {
  const params = useParams<{ testId: string }>();
  const router = useRouter();
  const testId = params.testId;

  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState("");

  // answers maps a questionId to the option text the user picked.
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // "dirty" is true only after the user changes an answer, so we do not
  // autosave the answers we just loaded from the server.
  const dirty = useRef(false);
  // Holds the autosave timer so we can cancel/restart it (debounce).
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On open: start (or resume) the attempt, then load the questions.
  useEffect(() => {
    const setup = async () => {
      try {
        // Start or resume. The backend returns an existing in-progress
        // attempt if one exists, so we never create duplicates.
        const startResponse = await api.post("/attempts/start", { testId });
        const attempt = startResponse.data.data.attempt;
        setAttemptId(attempt._id);

        // Pre-fill any answers that were already saved.
        const savedAnswers: Record<string, string> = {};
        attempt.answers.forEach((answer: AnswerInput) => {
          savedAnswers[answer.questionId] = answer.selectedOptionText;
        });
        setAnswers(savedAnswers);

        // Load the test details and its questions.
        const testResponse = await api.get(`/tests/${testId}`);
        setTest(testResponse.data.data.test);
        setQuestions(testResponse.data.data.questions);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    setup();
  }, [testId]);

  // Turn the answers map into the array the backend expects.
  const buildAnswerArray = (): AnswerInput[] => {
    return Object.keys(answers).map((questionId) => ({
      questionId: questionId,
      selectedOptionText: answers[questionId],
    }));
  };

  // Autosave: whenever answers change (after a user edit), wait 800ms
  // then save. The timer restarts on every change, so we only send one
  // request once the user pauses.
  useEffect(() => {
    if (!dirty.current || !attemptId) {
      return;
    }

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(async () => {
      setSaveStatus("Saving...");
      try {
        await api.patch(`/attempts/${attemptId}/answers`, {
          answers: buildAnswerArray(),
        });
        setSaveStatus("Saved");
      } catch (err) {
        setSaveStatus(getErrorMessage(err));
      }
    }, 800);

    // Cleanup if answers change again before the timer fires.
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [answers, attemptId]);

  const handleSelect = (questionId: string, optionText: string) => {
    dirty.current = true;
    setSaveStatus("Unsaved changes...");
    setAnswers((previous) => ({ ...previous, [questionId]: optionText }));
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = questions.length > 0 && answeredCount === questions.length;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      // Save the latest answers first, then submit.
      await api.patch(`/attempts/${attemptId}/answers`, {
        answers: buildAnswerArray(),
      });
      await api.post(`/attempts/${attemptId}/submit`);
      router.push(`/results/${attemptId}`);
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return <p className="p-10 text-zinc-500">Loading test...</p>;
  }
  if (error && questions.length === 0) {
    return <p className="p-10 text-red-600">{error}</p>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-semibold text-zinc-800">{test?.title}</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Answer every question to enable the submit button.
      </p>

      {/* Sticky progress bar so the user always sees how far along they are */}
      <div className="sticky top-0 z-10 mb-6 bg-zinc-50 py-3">
        <ProgressBar answered={answeredCount} total={questions.length} />
        {saveStatus && (
          <p className="mt-1 text-right text-xs text-zinc-500">{saveStatus}</p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={question._id}
            question={question}
            index={index}
            selectedOptionText={answers[question._id]}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8 flex items-center justify-end gap-4">
        {!allAnswered && (
          <span className="text-sm text-zinc-500">
            {questions.length - answeredCount} question(s) left
          </span>
        )}
        <button
          onClick={() => setShowConfirm(true)}
          disabled={!allAnswered || submitting}
          className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit Test
        </button>
      </div>

      {/* Confirmation dialog before final submission */}
      {showConfirm && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6">
            <h2 className="mb-2 text-lg font-semibold text-zinc-800">
              Submit your test?
            </h2>
            <p className="mb-5 text-sm text-zinc-600">
              You will not be able to change your answers after submitting.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Yes, submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TestStartPage() {
  return (
    <ProtectedRoute>
      <TestRunner />
    </ProtectedRoute>
  );
}

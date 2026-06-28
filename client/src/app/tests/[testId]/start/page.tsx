"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProgressBar from "@/components/ProgressBar";
import ProgressDonut from "@/components/ProgressDonut";
import QuestionCard from "@/components/QuestionCard";
import api, { getErrorMessage } from "@/lib/api";
import { Question, Test, AnswerInput } from "@/lib/types";
import { fadeUp } from "@/lib/motion";

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

  // Smoothly scroll to a question when its number is clicked in the
  // navigator on the left.
  const scrollToQuestion = (questionIndex: number) => {
    const element = document.getElementById(`question-${questionIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-zinc-500">
        Loading test...
      </div>
    );
  }
  if (error && questions.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">
          In progress
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900">
          {test?.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Answer every question to enable the submit button.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* LEFT sidebar: progress donut + question navigator (lg+) */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 flex flex-col gap-5">
              <div className="flex flex-col items-center rounded-[3px] border border-zinc-200 bg-white p-5">
                <h2 className="mb-3 self-start text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Progress
                </h2>
                <ProgressDonut answered={answeredCount} total={questions.length} />
                {saveStatus && (
                  <p className="mt-3 text-xs text-zinc-400">{saveStatus}</p>
                )}
              </div>

              <div className="rounded-[3px] border border-zinc-200 bg-white p-5">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Questions
                </h2>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((question, index) => {
                    const answered = Boolean(answers[question._id]);
                    return (
                      <button
                        key={question._id}
                        onClick={() => scrollToQuestion(index)}
                        aria-label={`Go to question ${index + 1}`}
                        className={
                          answered
                            ? "flex h-9 cursor-pointer items-center justify-center rounded-[2px] bg-indigo-600 text-xs font-semibold text-white transition-colors"
                            : "flex h-9 cursor-pointer items-center justify-center rounded-[2px] border border-zinc-300 text-xs font-medium text-zinc-600 transition-colors hover:border-indigo-400"
                        }
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: questions */}
          <div>
            {/* Mobile progress bar (sidebar is hidden on small screens) */}
            <div className="sticky top-14 z-10 mb-6 border-b border-zinc-200 bg-zinc-50/95 py-3 backdrop-blur lg:hidden">
              <ProgressBar answered={answeredCount} total={questions.length} />
              {saveStatus && (
                <p className="mt-1.5 text-right text-xs text-zinc-400">{saveStatus}</p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {questions.map((question, index) => (
                <motion.div
                  key={question._id}
                  id={`question-${index}`}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                >
                  <QuestionCard
                    question={question}
                    index={index}
                    selectedOptionText={answers[question._id]}
                    onSelect={handleSelect}
                  />
                </motion.div>
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
                className="cursor-pointer rounded-[2px] bg-indigo-600 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation dialog before final submission */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full max-w-sm rounded-[3px] border border-zinc-200 bg-white p-6"
            >
              <h2 className="text-lg font-bold tracking-tight text-zinc-900">
                Submit your test?
              </h2>
              <p className="mb-5 mt-1 text-sm text-zinc-600">
                You will not be able to change your answers after submitting.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={submitting}
                  className="cursor-pointer rounded-[2px] border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="cursor-pointer rounded-[2px] bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Yes, submit"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

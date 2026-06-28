"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Disclaimer from "@/components/Disclaimer";
import api, { getErrorMessage } from "@/lib/api";
import { Test } from "@/lib/types";
import { containerVariants, itemVariants } from "@/lib/motion";

function InstructionsContent() {
  const params = useParams<{ testId: string }>();
  const router = useRouter();
  const testId = params.testId;

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const loadTest = async () => {
      try {
        const response = await api.get(`/tests/${testId}`);
        setTest(response.data.data.test);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadTest();
  }, [testId]);

  // Start (or resume) an attempt, then go to the test page.
  const handleStart = async () => {
    setStarting(true);
    setError("");
    try {
      const response = await api.post("/attempts/start", { testId });
      const attemptId = response.data.data.attempt._id;
      router.push(`/tests/${testId}/start?attemptId=${attemptId}`);
    } catch (err) {
      setError(getErrorMessage(err));
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-zinc-500">
        Loading...
      </div>
    );
  }
  if (error && !test) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-red-600">
        {error}
      </div>
    );
  }
  if (!test) {
    return null;
  }

  const pad = "px-6 sm:px-10 lg:px-16";

  // The little fact rows shown in the sticky "what to expect" card.
  const facts = [
    { label: "Duration", value: `${test.durationInMinutes} min` },
    { label: "Traits", value: `${test.traits.length}` },
    { label: "Scale", value: "5-point Likert" },
  ];

  return (
    <div className="flex-1 bg-zinc-50">
      {/* Header band */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="border-b border-zinc-200 bg-white"
      >
        <div className={`${pad} py-10`}>
          <motion.p
            variants={itemVariants}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600"
          >
            Assessment
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl"
          >
            {test.title}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600"
          >
            {test.description}
          </motion.p>
        </div>
      </motion.section>

      {/* Body: instructions + sticky start card */}
      <div className={`${pad} grid gap-6 py-10 lg:grid-cols-[1.6fr_1fr]`}>
        {/* Left column */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="flex flex-col gap-6"
        >
          <motion.div
            variants={itemVariants}
            className="rounded-[3px] border border-zinc-200 bg-white p-6"
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Instructions
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              {test.instructions ||
                "Answer honestly using the 5-point scale. There are no right or wrong answers — choose the option that feels most true for you."}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Disclaimer text={test.disclaimer} />
          </motion.div>
        </motion.div>

        {/* Right column: sticky card */}
        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          className="h-fit rounded-[3px] border border-zinc-200 bg-white p-6 lg:sticky lg:top-24"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            What to expect
          </h2>

          <dl className="mt-4 divide-y divide-zinc-100">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-center justify-between py-2.5">
                <dt className="text-sm text-zinc-500">{fact.label}</dt>
                <dd className="text-sm font-semibold text-zinc-900">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            onClick={handleStart}
            disabled={starting}
            className="mt-5 w-full cursor-pointer rounded-[2px] bg-indigo-600 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {starting ? "Starting..." : "Start Test"}
          </button>
        </motion.aside>
      </div>
    </div>
  );
}

export default function InstructionsPage() {
  return (
    <ProtectedRoute>
      <InstructionsContent />
    </ProtectedRoute>
  );
}

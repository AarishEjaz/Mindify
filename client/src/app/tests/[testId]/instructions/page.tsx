"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Disclaimer from "@/components/Disclaimer";
import api, { getErrorMessage } from "@/lib/api";
import { Test } from "@/lib/types";

function InstructionsContent() {
  const params = useParams<{ testId: string }>();
  const router = useRouter();
  const testId = params.testId;

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  // Load the test details (and its disclaimer/instructions).
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
    return <p className="p-10 text-zinc-500">Loading...</p>;
  }
  if (error && !test) {
    return <p className="p-10 text-red-600">{error}</p>;
  }
  if (!test) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-semibold text-zinc-800">{test.title}</h1>
      <p className="mb-6 text-zinc-600">{test.description}</p>

      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="mb-2 font-semibold text-zinc-800">Instructions</h2>
        <p className="mb-3 text-sm text-zinc-600">
          {test.instructions ||
            "Answer honestly using the 5-point scale. There are no right or wrong answers."}
        </p>
        <p className="text-sm text-zinc-500">
          Estimated time: {test.durationInMinutes} minutes
        </p>
      </div>

      <div className="mb-6">
        <Disclaimer text={test.disclaimer} />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <button
        onClick={handleStart}
        disabled={starting}
        className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {starting ? "Starting..." : "Start Test"}
      </button>
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

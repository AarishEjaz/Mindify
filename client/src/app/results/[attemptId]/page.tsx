"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ResultChart from "@/components/ResultChart";
import TraitScoreCard from "@/components/TraitScoreCard";
import Disclaimer from "@/components/Disclaimer";
import api, { getErrorMessage } from "@/lib/api";
import { Result } from "@/lib/types";

function ResultContent() {
  const params = useParams<{ attemptId: string }>();
  const attemptId = params.attemptId;

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResult = async () => {
      try {
        const response = await api.get(`/results/${attemptId}`);
        setResult(response.data.data.result);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadResult();
  }, [attemptId]);

  if (loading) {
    return <p className="p-10 text-zinc-500">Loading result...</p>;
  }
  if (error || !result) {
    return <p className="p-10 text-red-600">{error || "Result not found"}</p>;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-semibold text-zinc-800">Your Result</h1>

      {result.finalSummary && (
        <p className="mb-6 rounded-md bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          {result.finalSummary}
        </p>
      )}

      {/* Charts */}
      <div className="mb-8">
        <ResultChart traitScores={result.traitScores} />
      </div>

      {/* Per-trait detail cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {result.traitScores.map((traitScore) => (
          <TraitScoreCard key={traitScore.trait} traitScore={traitScore} />
        ))}
      </div>

      <div className="mb-8">
        <Disclaimer text={result.disclaimer} />
      </div>

      <Link
        href="/dashboard"
        className="inline-block rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

export default function ResultPage() {
  return (
    <ProtectedRoute>
      <ResultContent />
    </ProtectedRoute>
  );
}

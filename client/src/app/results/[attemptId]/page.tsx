"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ResultChart from "@/components/ResultChart";
import RingChart from "@/components/RingChart";
import TraitScoreCard from "@/components/TraitScoreCard";
import Disclaimer from "@/components/Disclaimer";
import api, { getErrorMessage } from "@/lib/api";
import { Result } from "@/lib/types";
import { containerVariants, itemVariants } from "@/lib/motion";

function SparkIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2z" />
    </svg>
  );
}

// A sharp "stat tile". `highlight` adds an indigo accent for the top stat.
function StatTile({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3 }}
      className={`rounded-[3px] border bg-white p-5 ${
        highlight ? "border-l-2 border-l-indigo-600 border-zinc-200" : "border-zinc-200"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-zinc-900">
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>}
    </motion.div>
  );
}

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
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-zinc-500">
        Loading result...
      </div>
    );
  }
  if (error || !result) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-red-600">
        {error || "Result not found"}
      </div>
    );
  }

  // ---- Derived values for the summary tiles ----
  const traitScores = result.traitScores;
  const topTrait = traitScores.reduce(
    (best, current) => (current.percentage > best.percentage ? current : best),
    traitScores[0]
  );
  const average = Math.round(
    traitScores.reduce((sum, t) => sum + t.percentage, 0) / traitScores.length
  );
  const testTitle =
    typeof result.testId === "object" ? result.testId.title : "Assessment";
  const dateText = result.createdAt
    ? new Date(result.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  // Consistent edge-to-edge horizontal padding (no wasted side space).
  const pad = "px-6 sm:px-10 lg:px-16";

  return (
    <div className="flex-1 bg-zinc-50">
      {/* ---- Full-bleed dark header band ---- */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="relative overflow-hidden bg-zinc-950 text-white"
      >
        {/* faint Swiss grid lines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className={`relative ${pad} py-12`}>
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 text-indigo-400"
          >
            <SparkIcon />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Mindify · Assessment Report
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl"
          >
            Your Career Personality Profile
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-3 text-sm text-zinc-400">
            {testTitle} · {dateText}
          </motion.p>

          {result.finalSummary && (
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-3xl border-l-2 border-indigo-500 bg-white/5 px-4 py-3 text-sm leading-relaxed text-zinc-200"
            >
              {result.finalSummary}
            </motion.p>
          )}
        </div>
      </motion.section>

      {/* ---- Body ---- */}
      <div className={`${pad} py-10`}>
        {/* Summary stat tiles */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatTile
            label="Top Strength"
            value={topTrait.trait}
            sub={`${topTrait.percentage}% · ${topTrait.level}`}
            highlight
          />
          <StatTile label="Overall Average" value={`${average}%`} sub="across all traits" />
          <StatTile
            label="Traits Measured"
            value={`${traitScores.length}`}
            sub="career dimensions"
          />
          <StatTile label="Date Completed" value={dateText} sub="report generated" />
        </motion.div>

        {/* Trait rings (one donut gauge per trait) */}
        <h2 className="mb-4 mt-10 text-lg font-bold tracking-tight text-zinc-900">
          At a Glance
        </h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {traitScores.map((traitScore) => (
            <motion.div key={traitScore.trait} variants={itemVariants}>
              <RingChart
                percentage={traitScore.percentage}
                level={traitScore.level}
                label={traitScore.trait}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={itemVariants}
          className="mt-10"
        >
          <ResultChart traitScores={traitScores} />
        </motion.div>

        {/* Trait breakdown */}
        <h2 className="mb-4 mt-10 text-lg font-bold tracking-tight text-zinc-900">
          Trait Breakdown
        </h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {traitScores.map((traitScore) => (
            <motion.div key={traitScore.trait} variants={itemVariants}>
              <TraitScoreCard traitScore={traitScore} />
            </motion.div>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <div className="mt-8">
          <Disclaimer text={result.disclaimer} />
        </div>

        {/* Footer: branding + back button */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-6 sm:flex-row">
          <p className="flex items-center gap-1.5 text-sm text-zinc-400">
            <span className="text-indigo-500">
              <SparkIcon />
            </span>
            Generated with <span className="font-semibold text-zinc-700">Mindify</span>
          </p>
          <Link
            href="/dashboard"
            className="cursor-pointer rounded-[2px] bg-indigo-600 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-indigo-700"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
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

import { TraitScore } from "@/lib/types";

// Each level gets its own accent for the progress bar + badge. The level
// text is always shown, so meaning never depends on colour alone.
const levelStyles: Record<string, { bar: string; badge: string }> = {
  High: {
    bar: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  Moderate: {
    bar: "bg-indigo-600",
    badge: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  },
  Low: {
    bar: "bg-zinc-400",
    badge: "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200",
  },
};

// A sharp, professional card showing one trait's score, percentage,
// level, and interpretation. Crisp borders, low radius (Swiss style).
export default function TraitScoreCard({ traitScore }: { traitScore: TraitScore }) {
  const styles = levelStyles[traitScore.level] || levelStyles.Low;

  return (
    <div className="h-full rounded-[3px] border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
          {traitScore.trait}
        </h3>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles.badge}`}>
          {traitScore.level}
        </span>
      </div>

      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-zinc-900">
          {traitScore.percentage}%
        </span>
        <span className="text-xs font-medium tabular-nums text-zinc-400">
          {traitScore.score} / {traitScore.maxScore}
        </span>
      </div>

      {/* Sharp progress bar (squared edges) */}
      <div className="mb-3 h-1.5 w-full overflow-hidden bg-zinc-100">
        <div
          className={`h-full ${styles.bar} transition-all duration-700`}
          style={{ width: `${traitScore.percentage}%` }}
        />
      </div>

      <p className="text-sm leading-relaxed text-zinc-600">
        {traitScore.interpretation}
      </p>
    </div>
  );
}

import { TraitScore } from "@/lib/types";

// Pick a color for each level so the report is easy to scan.
const levelColors: Record<string, string> = {
  High: "bg-green-100 text-green-800",
  Moderate: "bg-blue-100 text-blue-800",
  Low: "bg-zinc-100 text-zinc-700",
};

// Shows one trait's score, percentage, level, and interpretation text.
export default function TraitScoreCard({ traitScore }: { traitScore: TraitScore }) {
  const badgeColor = levelColors[traitScore.level] || "bg-zinc-100 text-zinc-700";

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-zinc-800">{traitScore.trait}</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColor}`}>
          {traitScore.level}
        </span>
      </div>

      <p className="mb-2 text-2xl font-bold text-indigo-600">
        {traitScore.percentage}%
        <span className="ml-2 text-sm font-normal text-zinc-500">
          ({traitScore.score} / {traitScore.maxScore})
        </span>
      </p>

      <p className="text-sm text-zinc-600">{traitScore.interpretation}</p>
    </div>
  );
}

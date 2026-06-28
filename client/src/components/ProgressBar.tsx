// A sharp progress bar that shows how many questions are answered.
export default function ProgressBar({
  answered,
  total,
}: {
  answered: number;
  total: number;
}) {
  // Avoid dividing by zero if there are no questions yet.
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="mb-1.5 flex justify-between text-xs font-medium uppercase tracking-wide text-zinc-500">
        <span>
          {answered} of {total} answered
        </span>
        <span className="tabular-nums text-zinc-900">{percent}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden bg-zinc-200">
        <div
          className="h-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

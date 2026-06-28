// A simple progress bar that shows how many questions are answered.
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
      <div className="mb-1 flex justify-between text-sm text-zinc-600">
        <span>
          {answered} of {total} answered
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-zinc-200">
        <div
          className="h-2.5 rounded-full bg-indigo-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

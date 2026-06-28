"use client";

import { PieChart, Pie, Cell } from "recharts";

// A small donut (pie) chart showing how much of the test is answered.
// The percentage and the answered/total count sit in the centre.
export default function ProgressDonut({
  answered,
  total,
}: {
  answered: number;
  total: number;
}) {
  const remaining = Math.max(total - answered, 0);
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;

  // Two slices: answered (indigo) and remaining (grey).
  const data = [
    { name: "Answered", value: answered },
    { name: "Remaining", value: remaining },
  ];
  const size = 160;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <PieChart width={size} height={size}>
        <defs>
          {/* Light-to-dark indigo gradient for the answered slice */}
          <linearGradient id="donutGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
        </defs>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={56}
          outerRadius={76}
          startAngle={90}
          endAngle={-270}
          stroke="none"
        >
          <Cell fill="url(#donutGradient)" />
          <Cell fill="#e4e4e7" />
        </Pie>
      </PieChart>

      {/* Centre label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold tracking-tight text-zinc-900">
          {percent}%
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
          {answered}/{total}
        </span>
      </div>
    </div>
  );
}

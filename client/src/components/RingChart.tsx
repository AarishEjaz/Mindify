"use client";

import { motion } from "motion/react";

// Ring colour by level (matches the trait cards: green / indigo / grey).
const levelHex: Record<string, string> = {
  High: "#10b981",
  Moderate: "#6366f1",
  Low: "#a1a1aa",
};

// A circular "ring" gauge for one trait. The coloured arc draws itself in
// when it scrolls into view, with the percentage shown in the centre.
export default function RingChart({
  percentage,
  level,
  label,
}: {
  percentage: number;
  level: string;
  label: string;
}) {
  const size = 132; // px
  const stroke = 11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  // How much of the ring stays "empty" (offset) for this percentage.
  const offset = circumference * (1 - percentage / 100);
  const color = levelHex[level] || "#6366f1";

  return (
    <div className="flex flex-col items-center rounded-[3px] border border-zinc-200 bg-white p-5">
      <div className="relative" style={{ width: size, height: size }}>
        {/* -rotate-90 makes the arc start at the top */}
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e4e4e7"
            strokeWidth={stroke}
          />
          {/* Animated progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </svg>

        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold tracking-tight text-zinc-900">
            {percentage}%
          </span>
          <span
            className="text-[11px] font-medium uppercase tracking-wide"
            style={{ color }}
          >
            {level}
          </span>
        </div>
      </div>

      <span className="mt-3 text-sm font-semibold text-zinc-700">{label}</span>
    </div>
  );
}

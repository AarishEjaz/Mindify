"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { TraitScore } from "@/lib/types";

// Shows the trait results as two charts: a radar chart (overall shape)
// and a bar chart (easy side-by-side comparison, with values printed on
// top so meaning never depends on colour alone). Recharts runs in the
// browser, so this is a client component.
export default function ResultChart({ traitScores }: { traitScores: TraitScore[] }) {
  const data = traitScores.map((item) => ({
    trait: item.trait,
    percentage: item.percentage,
  }));

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Radar chart */}
      <div className="rounded-[3px] border border-zinc-200 bg-white p-5">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Trait Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data} outerRadius="72%">
            <defs>
              <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.25} />
              </linearGradient>
            </defs>
            <PolarGrid stroke="#e4e4e7" />
            <PolarAngleAxis
              dataKey="trait"
              tick={{ fill: "#52525b", fontSize: 12 }}
            />
            <PolarRadiusAxis
              domain={[0, 100]}
              tick={{ fill: "#a1a1aa", fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="Score"
              dataKey="percentage"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#radarFill)"
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "Score"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e4e4e7",
                fontSize: 12,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart */}
      <div className="rounded-[3px] border border-zinc-200 bg-white p-5">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Trait Scores
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f3" vertical={false} />
            <XAxis
              dataKey="trait"
              tick={{ fill: "#52525b", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#e4e4e7" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#a1a1aa", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(99,102,241,0.06)" }}
              formatter={(value) => [`${value}%`, "Score"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e4e4e7",
                fontSize: 12,
              }}
            />
            <Bar dataKey="percentage" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry) => (
                <Cell key={entry.trait} fill="url(#barFill)" />
              ))}
              <LabelList
                dataKey="percentage"
                position="top"
                formatter={(value: string | number | boolean | null | undefined) =>
                  `${value}%`
                }
                style={{ fill: "#6366f1", fontSize: 11, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

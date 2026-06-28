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
} from "recharts";
import { TraitScore } from "@/lib/types";

// Shows the trait results as two charts: a radar chart (overall shape)
// and a bar chart (easy side-by-side comparison). Recharts needs to run
// in the browser, so this is a client component.
export default function ResultChart({ traitScores }: { traitScores: TraitScore[] }) {
  // Recharts wants a plain array of { trait, percentage }.
  const data = traitScores.map((item) => ({
    trait: item.trait,
    percentage: item.percentage,
  }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Radar chart */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-zinc-700">Trait Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="trait" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Radar
              name="Percentage"
              dataKey="percentage"
              stroke="#4f46e5"
              fill="#4f46e5"
              fillOpacity={0.5}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-zinc-700">Trait Scores</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="trait" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="percentage" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

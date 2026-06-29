"use client";

/**
 * ResultPreview — a 3D-style report dashboard with sample trait scores on one
 * side and the list of what users receive on the other.
 */

import { motion } from "motion/react";
import {
  Check,
  FileDown,
  Sparkles,
  Target,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import {
  Section,
  Eyebrow,
  Reveal,
  GlassCard,
  TraitBar,
  DonutScore,
  ParallaxBlob,
} from "./primitives";

const SCORES = [
  { label: "Analytical Thinking", value: 82, gradient: "from-indigo-500 to-violet-500" },
  { label: "Creativity", value: 68, gradient: "from-violet-500 to-fuchsia-500" },
  { label: "Communication", value: 74, gradient: "from-sky-500 to-indigo-500" },
  { label: "Leadership", value: 59, gradient: "from-cyan-500 to-blue-500" },
];

const DELIVERABLES = [
  { icon: Sparkles, text: "Overall personality summary" },
  { icon: TrendingUp, text: "Trait-wise score breakdown" },
  { icon: Target, text: "Strength areas" },
  { icon: Lightbulb, text: "Improvement areas" },
  { icon: Check, text: "Career or role suggestions" },
  { icon: FileDown, text: "Downloadable PDF report" },
];

export default function ResultPreview() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/30 dark:via-slate-950 dark:to-slate-950">
      <ParallaxBlob
        speed={70}
        className="left-1/2 top-20 h-[26rem] w-[26rem] -translate-x-1/2 bg-violet-200/40"
      />
      <Section id="results">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: the 3D report dashboard */}
          <Reveal y={36}>
            <motion.div
              initial={{ rotate: -1.5 }}
              whileInView={{ rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative [perspective:1200px]"
            >
              <GlassCard className="p-6 sm:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                      Sample Report
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                      Your Trait Profile
                    </h3>
                  </div>
                  <DonutScore value={78} label="Overall" size={104} />
                </div>

                <div className="mt-7 space-y-4">
                  {SCORES.map((score, i) => (
                    <TraitBar
                      key={score.label}
                      label={score.label}
                      value={score.value}
                      gradient={score.gradient}
                      delay={i * 0.12}
                    />
                  ))}
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-emerald-50 p-3.5 dark:bg-emerald-400/10">
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      Top strength
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      Analytical Thinking
                    </p>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-3.5 dark:bg-amber-400/10">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                      Growth area
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-amber-900 dark:text-amber-200">
                      Leadership
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </Reveal>

          {/* Right: what you receive */}
          <div>
            <Reveal>
              <Eyebrow>Your report</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                A clear picture, not a confusing score
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Every assessment ends with a structured report designed to be
                read and acted on — not decoded.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {DELIVERABLES.map((item, i) => (
                <Reveal key={item.text} delay={0.05 * i} y={20}>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {item.text}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

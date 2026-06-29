"use client";

/**
 * HowItWorks — a 3-step scroll-revealed process. Each step pairs copy with a
 * small floating 3D-style visual card that alternates sides on desktop.
 */

import { motion } from "motion/react";
import { ListChecks, BarChart3, FileText } from "lucide-react";
import { Section, Eyebrow, Reveal, GlassCard, TraitBar, DonutScore } from "./primitives";

const STEPS = [
  {
    n: "01",
    icon: ListChecks,
    title: "Answer Structured Questions",
    body: "Move through a clean, focused set of questions at your own pace. No jargon, no pressure — just honest reflection.",
  },
  {
    n: "02",
    icon: BarChart3,
    title: "Get Trait-Based Scoring",
    body: "Your responses are translated into clear trait scores, so patterns in how you think and act become visible.",
  },
  {
    n: "03",
    icon: FileText,
    title: "Receive Your Insight Report",
    body: "Get an easy-to-read report with strengths, growth areas, and practical career direction you can actually use.",
  },
];

/* A small floating visual that differs per step, for visual variety. */
function StepVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <GlassCard className="lp-float w-full max-w-sm p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
          Question 4 of 24
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
          I enjoy breaking complex problems into smaller parts.
        </p>
        <div className="mt-4 space-y-2">
          {["Strongly agree", "Agree", "Neutral", "Disagree"].map((opt, i) => (
            <div
              key={opt}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                i === 0
                  ? "border-indigo-300 bg-indigo-50 font-medium text-indigo-700 dark:border-indigo-400/40 dark:bg-indigo-400/15 dark:text-indigo-200"
                  : "border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      </GlassCard>
    );
  }
  if (index === 1) {
    return (
      <GlassCard className="lp-float w-full max-w-sm p-6">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          Trait breakdown
        </p>
        <div className="mt-5 space-y-4">
          <TraitBar label="Analytical Thinking" value={82} />
          <TraitBar
            label="Creativity"
            value={68}
            gradient="from-violet-500 to-fuchsia-500"
          />
          <TraitBar
            label="Communication"
            value={74}
            gradient="from-sky-500 to-indigo-500"
          />
        </div>
      </GlassCard>
    );
  }
  return (
    <GlassCard className="lp-float flex w-full max-w-sm flex-col items-center p-6">
      <DonutScore value={78} label="Overall" />
      <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
        A clear summary of your personality, strengths and suggested
        directions — ready to download.
      </p>
    </GlassCard>
  );
}

export default function HowItWorks() {
  return (
    <div
      id="how-it-works"
      className="relative scroll-mt-24 bg-gradient-to-b from-white to-indigo-50/50 dark:from-slate-950 dark:to-indigo-950/30"
    >
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Three simple steps to real clarity
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              A guided flow that turns a few thoughtful minutes into a report
              you can act on.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 space-y-16 lg:space-y-24">
          {STEPS.map((step, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={step.n}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                {/* Copy */}
                <Reveal
                  y={36}
                  className={reversed ? "lg:order-2" : "lg:order-1"}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-black text-indigo-100 dark:text-white/10">
                      {step.n}
                    </span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
                      <step.icon className="h-6 w-6" />
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    {step.body}
                  </p>
                </Reveal>

                {/* Visual */}
                <motion.div
                  initial={{ opacity: 0, y: 40, rotate: reversed ? -2 : 2 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex justify-center ${
                    reversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <StepVisual index={i} />
                </motion.div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

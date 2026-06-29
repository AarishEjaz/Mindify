"use client";

/**
 * Features — a responsive grid of animated feature cards.
 */

import { motion } from "motion/react";
import {
  Gauge,
  FileBarChart,
  LayoutDashboard,
  LineChart,
  Lock,
  SlidersHorizontal,
  PieChart,
  Download,
} from "lucide-react";
import { Section, Eyebrow, Reveal, StaggerGroup, staggerItem } from "./primitives";

const FEATURES = [
  {
    icon: Gauge,
    title: "Trait-based scoring system",
    body: "Clear, consistent scoring that turns answers into meaningful traits.",
  },
  {
    icon: FileBarChart,
    title: "Personalized result report",
    body: "A report written around you — your strengths, style and direction.",
  },
  {
    icon: LayoutDashboard,
    title: "Clean assessment interface",
    body: "A calm, distraction-free flow that keeps you focused on reflecting.",
  },
  {
    icon: LineChart,
    title: "Progress tracking",
    body: "See how far you are and revisit results as you grow over time.",
  },
  {
    icon: Lock,
    title: "Secure user login",
    body: "Your account and responses are kept private and protected.",
  },
  {
    icon: SlidersHorizontal,
    title: "Admin-managed questions",
    body: "Question sets are curated and maintained for quality and relevance.",
  },
  {
    icon: PieChart,
    title: "Visual charts & score breakdown",
    body: "Intuitive charts make every score easy to read at a glance.",
  },
  {
    icon: Download,
    title: "PDF report download",
    body: "Save and share a polished PDF of your complete results anytime.",
  },
];

export default function Features() {
  return (
    <Section id="features">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow>Features</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Everything you need to understand yourself
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Thoughtful tools that make self-assessment clear, structured, and
            genuinely useful.
          </p>
        </Reveal>
      </div>

      <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <motion.div
            key={feature.title}
            variants={staggerItem}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur transition-shadow hover:shadow-xl hover:shadow-indigo-600/5 dark:border-white/10 dark:bg-white/[0.04] dark:hover:shadow-indigo-500/10"
          >
            {/* Soft gradient glow on hover */}
            <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-200/0 to-violet-200/0 blur-2xl transition-colors duration-500 group-hover:from-indigo-200/60 group-hover:to-violet-200/60 dark:group-hover:from-indigo-500/20 dark:group-hover:to-violet-500/20" />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 ring-1 ring-indigo-100 dark:from-indigo-400/15 dark:to-violet-400/15 dark:text-indigo-300 dark:ring-white/10">
              <feature.icon className="h-5.5 w-5.5" />
            </span>
            <h3 className="relative mt-4 text-base font-bold text-slate-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {feature.body}
            </p>
          </motion.div>
        ))}
      </StaggerGroup>
    </Section>
  );
}

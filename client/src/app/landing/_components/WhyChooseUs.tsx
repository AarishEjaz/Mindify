"use client";

/**
 * WhyChooseUs — reassurance section. "Built for clarity, not confusion."
 * Presented as subtle animated blocks.
 */

import { motion } from "motion/react";
import {
  BookOpenCheck,
  Workflow,
  Focus,
  Users,
  Sprout,
} from "lucide-react";
import { Section, Eyebrow, Reveal, StaggerGroup, staggerItem } from "./primitives";

const POINTS = [
  {
    icon: BookOpenCheck,
    title: "Easy-to-understand reports",
    body: "Plain-language insights with visuals — no psychology degree required.",
  },
  {
    icon: Workflow,
    title: "Structured question flow",
    body: "A logical, guided path that keeps the experience consistent and fair.",
  },
  {
    icon: Focus,
    title: "Distraction-free experience",
    body: "A calm interface that helps you stay present and answer honestly.",
  },
  {
    icon: Users,
    title: "For students & professionals",
    body: "Useful whether you're choosing a stream or planning your next move.",
  },
  {
    icon: Sprout,
    title: "Designed for personal growth",
    body: "Focused on self-awareness and progress, never labels or diagnoses.",
  },
];

export default function WhyChooseUs() {
  return (
    <Section id="why-us">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow>Why choose us</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Built for clarity, not confusion
          </h2>
        </Reveal>
      </div>

      <StaggerGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {POINTS.map((point, i) => (
          <motion.div
            key={point.title}
            variants={staggerItem}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            // Make the last item span two columns on large screens for a
            // balanced 5-card layout.
            className={`group rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white/90 to-indigo-50/40 p-7 shadow-sm backdrop-blur transition-shadow hover:shadow-xl hover:shadow-indigo-600/5 dark:border-white/10 dark:from-white/[0.06] dark:to-indigo-500/[0.06] dark:hover:shadow-indigo-500/10 ${
              i === POINTS.length - 1 ? "lg:col-span-1" : ""
            }`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100 dark:bg-white/10 dark:text-indigo-300 dark:ring-white/10">
              <point.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              {point.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {point.body}
            </p>
          </motion.div>
        ))}
      </StaggerGroup>
    </Section>
  );
}

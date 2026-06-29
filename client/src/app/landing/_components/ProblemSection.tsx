"use client";

/**
 * ProblemSection — frames the "why" with four animated pain-point cards.
 * Tone is supportive and growth-focused (never clinical).
 */

import { Compass, Gauge, UserSearch, ClipboardList } from "lucide-react";
import { Section, Eyebrow, Reveal, StaggerGroup, staggerItem } from "./primitives";
import { motion } from "motion/react";

const PAINS = [
  {
    icon: Compass,
    title: "Confused about career direction?",
    body: "Too many options and no clear way to tell which path actually fits you.",
  },
  {
    icon: Gauge,
    title: "Unsure about your strengths?",
    body: "You sense what you're good at, but can't quite put numbers or words to it.",
  },
  {
    icon: UserSearch,
    title: "Want to understand your personality better?",
    body: "Generic quizzes feel shallow and rarely explain how you actually behave.",
  },
  {
    icon: ClipboardList,
    title: "Need a structured self-assessment tool?",
    body: "You're looking for something organised, consistent, and easy to act on.",
  },
];

export default function ProblemSection() {
  return (
    <Section id="problem">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow>The challenge</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Most people are unsure about their real strengths
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Choosing a career path or understanding your personality can feel
            confusing without a structured way to reflect. A little clarity
            goes a long way.
          </p>
        </Reveal>
      </div>

      <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PAINS.map((pain) => (
          <motion.div
            key={pain.title}
            variants={staggerItem}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur transition-shadow hover:shadow-xl hover:shadow-indigo-600/5 dark:border-white/10 dark:bg-white/[0.04] dark:hover:shadow-indigo-500/10"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100 dark:bg-indigo-400/10 dark:text-indigo-300 dark:group-hover:bg-indigo-400/20">
              <pain.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
              {pain.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {pain.body}
            </p>
          </motion.div>
        ))}
      </StaggerGroup>
    </Section>
  );
}

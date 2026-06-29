"use client";

/**
 * FinalCta — closing call-to-action on a rich gradient panel, plus a compact
 * footer with placeholder routes.
 */

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Brain } from "lucide-react";
import { Reveal } from "./primitives";

export default function FinalCta() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative px-6 pb-16 pt-8 sm:px-10 lg:px-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-16 text-center shadow-2xl shadow-indigo-600/30 sm:px-12 sm:py-20">
        {/* Decorative drifting orbs inside the panel */}
        <span
          className={`pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-3xl ${
            reduceMotion ? "" : "lp-blob"
          }`}
        />
        <span
          className={`pointer-events-none absolute -bottom-12 -right-8 h-56 w-56 rounded-full bg-white/10 blur-3xl ${
            reduceMotion ? "" : "lp-blob"
          }`}
        />

        <Reveal>
          <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Ready to understand yourself better?
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="relative mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-indigo-100">
            Start your assessment and get a clear picture of your personality,
            strengths, and growth areas.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <motion.div
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            className="relative mt-9 inline-block"
          >
            <Link
              href="/tests"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-7 py-4 text-base font-bold text-indigo-700 shadow-xl transition-shadow hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Start Assessment
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </Reveal>
      </div>

      {/* Footer */}
      <footer className="mx-auto mt-14 max-w-6xl border-t border-slate-200 pt-8 dark:border-white/10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="#home" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
              <Brain className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
            </span>
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              Mindify
            </span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
            <a href="#how-it-works" className="hover:text-indigo-700 dark:hover:text-indigo-300">
              How It Works
            </a>
            <a href="#features" className="hover:text-indigo-700 dark:hover:text-indigo-300">
              Features
            </a>
            <a href="#assessments" className="hover:text-indigo-700 dark:hover:text-indigo-300">
              Assessments
            </a>
            <a href="#faq" className="hover:text-indigo-700 dark:hover:text-indigo-300">
              FAQ
            </a>
            {/* Placeholder route for login */}
            <Link href="/login" className="hover:text-indigo-700 dark:hover:text-indigo-300">
              Login
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          For self-awareness and career guidance only — not a medical or
          diagnostic tool. © {2026} Mindify.
        </p>
      </footer>
    </section>
  );
}

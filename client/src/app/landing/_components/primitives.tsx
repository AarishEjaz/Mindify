"use client";

/**
 * Shared building blocks for the immersive landing page.
 *
 * Everything here is intentionally small and reusable so each section file
 * stays focused on layout + copy rather than re-implementing animation logic.
 *
 * Accessibility / performance notes:
 *  - All reveal/parallax motion respects `prefers-reduced-motion` via
 *    `useReducedMotion()` and gracefully degrades to a static layout.
 *  - We animate `transform`/`opacity` only (GPU-friendly, no layout thrash).
 */

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Reveal — fades + slides content in the first time it scrolls into view */
/* ------------------------------------------------------------------ */

type RevealProps = {
  children: ReactNode;
  /** Extra delay (seconds) for manual staggering. */
  delay?: number;
  /** Direction the element travels in from. */
  y?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* A container + child pair for staggered grids/lists. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * StaggerGroup — wraps a grid so children (using `staggerItem`) animate in
 * one after another as the group scrolls into view.
 */
export function StaggerGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial={reduceMotion ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Section — consistent vertical rhythm + scroll anchor                 */
/* ------------------------------------------------------------------ */

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-20 sm:px-10 sm:py-28 lg:px-16 ${className}`}
    >
      {children}
    </section>
  );
}

/* A small uppercase label above section headings. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-300">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* GlassCard — the glassmorphism surface used for floating UI cards     */
/* ------------------------------------------------------------------ */

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-[0_18px_40px_-18px_rgba(30,27,75,0.25)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)] ${className}`}
    >
      {/* Soft top highlight — the glass "shine" that sells the glassmorphism. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/20"
      />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TraitBar — animated horizontal score bar for trait charts            */
/* ------------------------------------------------------------------ */

export function TraitBar({
  label,
  value,
  delay = 0,
  gradient = "from-indigo-500 to-violet-500",
}: {
  label: string;
  value: number; // 0–100
  delay?: number;
  gradient?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
        <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
          {value}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          initial={reduceMotion ? false : { width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay }}
          // When reduced motion is on, ensure the final width is set.
          style={reduceMotion ? { width: `${value}%` } : undefined}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DonutScore — animated circular score ring for the report previews    */
/* ------------------------------------------------------------------ */

export function DonutScore({
  value,
  label,
  size = 132,
}: {
  value: number; // 0–100
  label: string;
  size?: number;
}) {
  const reduceMotion = useReducedMotion();
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 text-slate-200 dark:text-white/10"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#donutGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reduceMotion ? false : { strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, ease: "easeOut" }}
          style={reduceMotion ? { strokeDashoffset: offset } : undefined}
        />
        <defs>
          <linearGradient id="donutGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white">
          {value}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ParallaxBlob — a gradient orb that drifts on scroll (depth layer)    */
/* ------------------------------------------------------------------ */

export function ParallaxBlob({
  className = "",
  speed = 60,
}: {
  className?: string;
  /** How many px the blob travels across the full page scroll. */
  speed?: number;
}) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, speed]);

  return (
    <motion.div
      aria-hidden
      style={reduceMotion ? undefined : { y }}
      className={`lp-blob pointer-events-none absolute rounded-full blur-3xl ${className}`}
    />
  );
}

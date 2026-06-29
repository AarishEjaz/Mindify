"use client";

/**
 * Hero — the opening section with headline, CTAs and a tilting 3D-style
 * report dashboard preview.
 *
 * The "3D" effect is built purely from CSS perspective + layered transforms
 * (translateZ depth stacking) and a pointer-driven tilt (Framer Motion
 * springs) — no WebGL/Three.js, so it stays lightweight and performant.
 * Tilt + ambient motion are disabled under prefers-reduced-motion.
 */

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  FileDown,
  Brain,
} from "lucide-react";
import { GlassCard, ParallaxBlob, TraitBar } from "./primitives";

/* The interactive, mouse-tilting report card on the right of the hero. */
function TiltDashboard() {
  const reduceMotion = useReducedMotion();

  // Raw pointer position (-0.5 .. 0.5), smoothed with a spring for a
  // natural, weighty feel.
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 150, damping: 18 });
  const springY = useSpring(mvY, { stiffness: 150, damping: 18 });

  const rotateY = useTransform(springX, [-0.5, 0.5], [14, -14]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [-12, 12]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    mvX.set(0);
    mvY.set(0);
  }

  return (
    <div
      className="relative [perspective:1500px]"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <motion.div
        style={
          reduceMotion
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
        className="relative [transform-style:preserve-3d]"
      >
        {/* Depth layer 1: a rotating gradient ring far behind the card. */}
        <div
          aria-hidden
          style={reduceMotion ? undefined : { transform: "translateZ(-120px)" }}
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[125%] w-[125%] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="lp-spin-slow h-full w-full rounded-full bg-[conic-gradient(from_0deg,#6366f1,#a855f7,#22d3ee,#6366f1)] opacity-20 blur-[2px] [mask:radial-gradient(farthest-side,transparent_calc(100%-14px),#000_calc(100%-13px))] dark:opacity-30" />
        </div>

        {/* Depth layer 2: a tilted back-plate for stacked-card depth. */}
        <div
          aria-hidden
          style={reduceMotion ? undefined : { transform: "translateZ(-60px)" }}
          className="absolute inset-0 -z-10 translate-x-5 translate-y-6 rounded-3xl bg-gradient-to-br from-indigo-200/60 to-violet-200/50 blur-xl dark:from-indigo-500/20 dark:to-violet-500/15"
        />

        {/* Main report card */}
        <GlassCard className="p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                Insight Report
              </p>
              <h3 className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
                Personality Summary
              </h3>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>

          {/* Trait scores */}
          <div className="mt-6 space-y-4">
            <TraitBar label="Analytical Thinking" value={82} delay={0.1} />
            <TraitBar
              label="Creativity"
              value={68}
              delay={0.25}
              gradient="from-violet-500 to-fuchsia-500"
            />
            <TraitBar
              label="Communication"
              value={74}
              delay={0.4}
              gradient="from-sky-500 to-indigo-500"
            />
            <TraitBar
              label="Leadership"
              value={59}
              delay={0.55}
              gradient="from-cyan-500 to-blue-500"
            />
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-50/80 p-3.5 dark:bg-white/5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
              <TrendingUp className="h-5 w-5" />
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">
                Strength:{" "}
              </span>
              Structured problem-solving &amp; clear reasoning.
            </p>
          </div>
        </GlassCard>

        {/* Floating mini-card: overall score (pulled forward in 3D space). */}
        <motion.div
          style={reduceMotion ? undefined : { transform: "translateZ(80px)" }}
          className="lp-float absolute -left-6 -top-6 hidden sm:block"
        >
          <GlassCard className="flex items-center gap-3 px-4 py-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
              78
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Overall fit
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Strong match
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Floating mini-card: PDF ready (top-right, deepest float). */}
        <motion.div
          style={reduceMotion ? undefined : { transform: "translateZ(55px)" }}
          className="lp-float absolute -right-5 top-10 hidden lg:block"
        >
          <GlassCard className="flex items-center gap-2.5 px-3.5 py-2.5">
            <FileDown className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-300" />
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
              PDF ready
            </p>
          </GlassCard>
        </motion.div>

        {/* Floating mini-card: secure badge */}
        <motion.div
          style={reduceMotion ? undefined : { transform: "translateZ(70px)" }}
          className="lp-float absolute -bottom-6 -right-5 hidden sm:block"
        >
          <GlassCard className="flex items-center gap-2.5 px-4 py-3">
            <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Private &amp; secure
            </p>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative scroll-mt-24 overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      {/* Parallax background depth layers (gradient mesh) */}
      <ParallaxBlob
        speed={80}
        className="-left-24 top-10 h-96 w-96 bg-indigo-300/40 dark:bg-indigo-600/20"
      />
      <ParallaxBlob
        speed={-60}
        className="right-0 top-40 h-[28rem] w-[28rem] bg-violet-300/40 dark:bg-violet-600/20"
      />
      <ParallaxBlob
        speed={40}
        className="bottom-0 left-1/3 h-80 w-80 bg-cyan-200/40 dark:bg-cyan-500/10"
      />
      <div className="lp-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] dark:opacity-30" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 sm:px-10 lg:grid-cols-2 lg:gap-10 lg:px-16">
        {/* Left: copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur dark:border-indigo-400/20 dark:bg-white/10 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              Self-awareness, made structured
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
            className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            Discover Your{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400">
              Personality, Strengths,
            </span>{" "}
            and Career Direction
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.16 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300"
          >
            Take a structured psychometric assessment designed to help you
            understand your behavior patterns, decision-making style,
            strengths, and areas for improvement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.24 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/tests"
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-indigo-600/25 transition-all hover:shadow-2xl hover:shadow-indigo-600/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Start Assessment
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-6 py-3.5 text-base font-semibold text-slate-700 backdrop-blur transition-all hover:border-slate-300 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              View How It Works
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />{" "}
              No medical diagnosis
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />{" "}
              Trait-based scoring
            </span>
            <span className="flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />{" "}
              Built for growth
            </span>
          </motion.div>
        </div>

        {/* Right: 3D dashboard preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <TiltDashboard />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none mt-16 flex justify-center">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-slate-300/80 p-1.5 dark:border-white/20">
          <span className="lp-scroll-cue h-2 w-1 rounded-full bg-indigo-500 dark:bg-indigo-400" />
        </div>
      </div>
      <div className="mt-2 flex justify-center text-slate-400 dark:text-slate-500">
        <ChevronDown className="lp-scroll-cue h-4 w-4" />
      </div>
    </section>
  );
}

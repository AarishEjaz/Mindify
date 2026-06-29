"use client";

/**
 * Categories — assessment category cards with a depth/tilt hover effect.
 * Each card lifts and tilts slightly toward the cursor for a 3D feel,
 * using CSS perspective + Framer Motion (no 3D engine required).
 */

import { motion, useReducedMotion } from "motion/react";
import { Brain, Briefcase, Activity, GraduationCap } from "lucide-react";
import { Section, Eyebrow, Reveal, staggerItem, StaggerGroup } from "./primitives";

const CATEGORIES = [
  {
    icon: Brain,
    title: "Personality Assessment",
    body: "Understand your core traits, tendencies and how you naturally operate.",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    icon: Briefcase,
    title: "Career Interest Assessment",
    body: "Map your interests to roles and directions that genuinely suit you.",
    gradient: "from-sky-500 to-indigo-600",
  },
  {
    icon: Activity,
    title: "Behavioral Assessment",
    body: "See your patterns in decisions, collaboration and everyday responses.",
    gradient: "from-violet-500 to-fuchsia-600",
  },
  {
    icon: GraduationCap,
    title: "Student Guidance Assessment",
    body: "Get direction on streams, skills and study paths with confidence.",
    gradient: "from-cyan-500 to-blue-600",
  },
];

/* One tilting category card. */
function CategoryCard({
  category,
}: {
  category: (typeof CATEGORIES)[number];
}) {
  const reduceMotion = useReducedMotion();

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${
      -py * 10
    }deg) translateY(-6px)`;
  }

  function handleLeave(e: React.MouseEvent<HTMLDivElement>) {
    e.currentTarget.style.transform =
      "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0px)";
  }

  return (
    <motion.div variants={staggerItem}>
      <div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-7 shadow-sm backdrop-blur transition-[transform,box-shadow] duration-200 ease-out [transform-style:preserve-3d] hover:shadow-2xl hover:shadow-indigo-600/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:shadow-indigo-500/20"
      >
        {/* Decorative gradient corner */}
        <span
          className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${category.gradient} opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-25`}
        />
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.gradient} text-white shadow-lg`}
        >
          <category.icon className="h-7 w-7" />
        </span>
        <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-white">
          {category.title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {category.body}
        </p>
      </div>
    </motion.div>
  );
}

export default function Categories() {
  return (
    <Section id="assessments">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow>Assessments</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Choose the assessment that fits your goal
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Focused assessment tracks for self-discovery, career planning and
            student guidance.
          </p>
        </Reveal>
      </div>

      <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.title} category={category} />
        ))}
      </StaggerGroup>
    </Section>
  );
}

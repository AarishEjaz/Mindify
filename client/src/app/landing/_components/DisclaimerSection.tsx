"use client";

/**
 * DisclaimerSection — required, non-clinical disclaimer. Calm and clearly
 * separated, but not alarming.
 */

import { Info } from "lucide-react";
import { Section, Reveal } from "./primitives";

export default function DisclaimerSection() {
  return (
    <Section className="!py-10">
      <Reveal>
        <div className="mx-auto flex max-w-4xl items-start gap-4 rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur dark:border-white/10 dark:bg-white/[0.04] sm:p-7">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300">
            <Info className="h-5 w-5" />
          </span>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            This assessment is designed for self-awareness, career guidance,
            and personal development. It is not a medical, clinical, or
            diagnostic tool. For mental health concerns, please consult a
            qualified professional.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

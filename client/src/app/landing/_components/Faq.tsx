"use client";

/**
 * Faq — accessible accordion. Uses native <button> with aria-expanded and an
 * animated height/opacity reveal for each answer.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Section, Eyebrow, Reveal } from "./primitives";

const FAQS = [
  {
    q: "How long does the assessment take?",
    a: "Most assessments take around 10–15 minutes. You can move at your own pace and there's no time pressure to answer.",
  },
  {
    q: "Is this a medical test?",
    a: "No. This is a self-awareness and career-guidance tool. It is not a medical, clinical, or diagnostic test of any kind.",
  },
  {
    q: "Will I get a report after completion?",
    a: "Yes. As soon as you finish, you receive a structured insight report with your trait scores, strengths, growth areas, and suggested directions.",
  },
  {
    q: "Can I download my result?",
    a: "Absolutely. Your full report can be downloaded as a clean PDF so you can save it or share it whenever you like.",
  },
  {
    q: "Is my data secure?",
    a: "Your account is protected with secure login, and your responses are kept private. We only use your answers to generate your report.",
  },
  {
    q: "Can students use this test?",
    a: "Yes. There's a dedicated student-guidance track to help with streams, skills, and study direction, alongside the other assessments.",
  },
];

function FaqItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4.5 text-left sm:px-6"
      >
        <span className="text-base font-semibold text-slate-900 dark:text-white">
          {q}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-indigo-600 transition-transform duration-300 dark:text-indigo-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:px-6">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow>FAQ</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Questions, answered
          </h2>
        </Reveal>
      </div>

      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {FAQS.map((faq, i) => (
          <Reveal key={faq.q} delay={0.04 * i} y={18}>
            <FaqItem
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

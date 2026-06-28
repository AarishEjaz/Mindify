"use client";

import Link from "next/link";
import { motion } from "motion/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { containerVariants, itemVariants } from "@/lib/motion";

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const cards = [
  {
    href: "/admin/tests",
    index: "01",
    title: "Tests",
    description: "Create and manage tests and their traits.",
  },
  {
    href: "/admin/questions",
    index: "02",
    title: "Questions",
    description: "Add and edit questions for each test.",
  },
  {
    href: "/admin/reports",
    index: "03",
    title: "Reports",
    description: "View all user attempts and results.",
  },
];

function AdminContent() {
  const pad = "px-6 sm:px-10 lg:px-16";

  return (
    <div className="flex-1 bg-zinc-50">
      {/* Dark hero band */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="relative overflow-hidden bg-zinc-950 text-white"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className={`relative ${pad} py-12`}>
          <motion.p
            variants={itemVariants}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400"
          >
            Admin
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl"
          >
            Admin Dashboard
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-3 text-sm text-zinc-400">
            Manage tests, questions, and view all user reports.
          </motion.p>
        </div>
      </motion.section>

      {/* Cards */}
      <div className={`${pad} py-10`}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {cards.map((card) => (
            <motion.div key={card.href} variants={itemVariants}>
              <Link
                href={card.href}
                className="group flex h-full flex-col rounded-[3px] border border-zinc-200 bg-white p-6 transition-colors hover:border-indigo-300"
              >
                <span className="text-xs font-bold tabular-nums text-indigo-600">
                  {card.index}
                </span>
                <h2 className="mt-3 font-semibold text-zinc-900">{card.title}</h2>
                <p className="mt-1 flex-1 text-sm text-zinc-600">{card.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                  Manage
                  <span className="transition-transform group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminContent />
    </ProtectedRoute>
  );
}

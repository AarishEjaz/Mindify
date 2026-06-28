"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import api, { getErrorMessage } from "@/lib/api";
import { Test } from "@/lib/types";
import { containerVariants, itemVariants } from "@/lib/motion";

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTests = async () => {
      try {
        const response = await api.get("/tests?page=1&limit=6");
        setTests(response.data.data.tests);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadTests();
  }, []);

  const pad = "px-6 sm:px-10 lg:px-16";

  return (
    <div className="flex-1 bg-zinc-50">
      {/* Full-bleed dark hero band */}
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
            Dashboard
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl"
          >
            Welcome, {user?.name}
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-3 text-sm text-zinc-400">
            Choose an assessment below to begin your career &amp; personality guidance.
          </motion.p>
        </div>
      </motion.section>

      {/* Body */}
      <div className={`${pad} py-10`}>
        <h2 className="mb-4 text-lg font-bold tracking-tight text-zinc-900">
          Available assessments
        </h2>

        {loading && <p className="text-zinc-500">Loading tests...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && tests.length === 0 && (
          <p className="text-zinc-500">No tests are available yet.</p>
        )}

        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {tests.map((test, index) => (
            <motion.div key={test._id} variants={itemVariants}>
              <Link
                href={`/tests/${test._id}/instructions`}
                className="group flex h-full flex-col rounded-[3px] border border-zinc-200 bg-white p-6 transition-colors hover:border-indigo-300"
              >
                <span className="text-xs font-bold tabular-nums text-indigo-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-semibold text-zinc-900">{test.title}</h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-zinc-600">
                  {test.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                  View test
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

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

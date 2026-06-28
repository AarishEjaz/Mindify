"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api, { getErrorMessage } from "@/lib/api";
import { Test, Pagination } from "@/lib/types";
import { containerVariants, itemVariants } from "@/lib/motion";

function TestListContent() {
  const [tests, setTests] = useState<Test[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTests = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/tests?page=${page}&limit=5`);
        setTests(response.data.data.tests);
        setPagination(response.data.data.pagination);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadTests();
  }, [page]);

  const pad = "px-6 sm:px-10 lg:px-16";
  const pagerBtn =
    "cursor-pointer rounded-[2px] border border-zinc-300 px-3 py-1.5 text-sm transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex-1 bg-zinc-50">
      {/* Header band */}
      <section className="border-b border-zinc-200 bg-white">
        <div className={`${pad} py-10`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">
            Assessments
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            All Tests
          </h1>
        </div>
      </section>

      {/* Body */}
      <div className={`${pad} py-10`}>
        {loading && <p className="text-zinc-500">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="flex flex-col gap-4"
        >
          {tests.map((test, index) => (
            <motion.div
              key={test._id}
              variants={itemVariants}
              className="flex flex-col gap-4 rounded-[3px] border border-zinc-200 bg-white p-6 transition-colors hover:border-indigo-300 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <span className="text-xs font-bold tabular-nums text-indigo-600">
                  {String((page - 1) * 5 + index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-semibold text-zinc-900">{test.title}</h2>
                  <p className="mt-0.5 text-sm text-zinc-600">{test.description}</p>
                </div>
              </div>
              <Link
                href={`/tests/${test._id}/instructions`}
                className="shrink-0 cursor-pointer rounded-[2px] bg-indigo-600 px-4 py-2 text-center text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-indigo-700"
              >
                View test
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button onClick={() => setPage(page - 1)} disabled={page <= 1} className={pagerBtn}>
              Previous
            </button>
            <span className="text-sm text-zinc-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.totalPages}
              className={pagerBtn}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestListPage() {
  return (
    <ProtectedRoute>
      <TestListContent />
    </ProtectedRoute>
  );
}

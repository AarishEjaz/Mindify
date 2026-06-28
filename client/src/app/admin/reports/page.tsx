"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api, { getErrorMessage } from "@/lib/api";
import { Result, Pagination } from "@/lib/types";
import { fadeUp } from "@/lib/motion";

function AdminReportsContent() {
  const [reports, setReports] = useState<Result[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/admin/reports?page=${page}&limit=10`);
        setReports(response.data.data.reports);
        setPagination(response.data.data.pagination);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, [page]);

  // The populated fields can be either an id string or an object, so we
  // read them safely with small helpers.
  const userName = (report: Result) => {
    if (typeof report.userId === "object") {
      return report.userId.name;
    }
    return "Unknown";
  };
  const testTitle = (report: Result) => {
    if (typeof report.testId === "object") {
      return report.testId.title;
    }
    return "Unknown";
  };

  const pad = "px-6 sm:px-10 lg:px-16";
  const pagerBtn =
    "cursor-pointer rounded-[2px] border border-zinc-300 px-3 py-1.5 text-sm transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex-1 bg-zinc-50">
      {/* Header band */}
      <section className="border-b border-zinc-200 bg-white">
        <div className={`${pad} py-10`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            All Reports
          </h1>
        </div>
      </section>

      {/* Body */}
      <div className={`${pad} py-10`}>
        {loading && <p className="text-zinc-500">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && reports.length === 0 && (
          <p className="text-zinc-500">No reports yet.</p>
        )}

        {reports.length > 0 && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="overflow-x-auto rounded-[3px] border border-zinc-200 bg-white"
          >
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-[11px] uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Test</th>
                  <th className="px-4 py-3 font-semibold">Top traits</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report._id}
                    className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {userName(report)}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{testTitle(report)}</td>
                    <td className="px-4 py-3 text-zinc-600">
                      {report.traitScores
                        .map((t) => `${t.trait} ${t.percentage}%`)
                        .join(", ")}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

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

export default function AdminReportsPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminReportsContent />
    </ProtectedRoute>
  );
}

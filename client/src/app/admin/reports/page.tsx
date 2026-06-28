"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api, { getErrorMessage } from "@/lib/api";
import { Result, Pagination } from "@/lib/types";

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

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-800">All Reports</h1>

      {loading && <p className="text-zinc-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && reports.length === 0 && (
        <p className="text-zinc-500">No reports yet.</p>
      )}

      {reports.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Test</th>
                <th className="px-4 py-3">Top traits</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-b border-zinc-100">
                  <td className="px-4 py-3 text-zinc-800">{userName(report)}</td>
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
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-zinc-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= pagination.totalPages}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
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

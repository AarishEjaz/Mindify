"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import api, { getErrorMessage } from "@/lib/api";
import { Test, Pagination } from "@/lib/types";

function TestListContent() {
  const [tests, setTests] = useState<Test[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reload whenever the page number changes.
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

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-800">All Tests</h1>

      {loading && <p className="text-zinc-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex flex-col gap-4">
        {tests.map((test) => (
          <div
            key={test._id}
            className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="font-semibold text-zinc-800">{test.title}</h2>
              <p className="text-sm text-zinc-600">{test.description}</p>
            </div>
            <Link
              href={`/tests/${test._id}/instructions`}
              className="shrink-0 rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700"
            >
              View test
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination controls (only shown when there is more than one page) */}
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

export default function TestListPage() {
  return (
    <ProtectedRoute>
      <TestListContent />
    </ProtectedRoute>
  );
}

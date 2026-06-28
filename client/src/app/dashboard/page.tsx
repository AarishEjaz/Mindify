"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import api, { getErrorMessage } from "@/lib/api";
import { Test } from "@/lib/types";

function DashboardContent() {
  const { user } = useAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the active tests when the page opens.
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

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-semibold text-zinc-800">
        Welcome, {user?.name}
      </h1>
      <p className="mb-8 text-zinc-600">
        Choose a test below to begin your guidance assessment.
      </p>

      {loading && <p className="text-zinc-500">Loading tests...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && tests.length === 0 && (
        <p className="text-zinc-500">No tests are available yet.</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tests.map((test) => (
          <div
            key={test._id}
            className="rounded-lg border border-zinc-200 bg-white p-5"
          >
            <h2 className="mb-1 font-semibold text-zinc-800">{test.title}</h2>
            <p className="mb-4 text-sm text-zinc-600">{test.description}</p>
            <Link
              href={`/tests/${test._id}/instructions`}
              className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              View test
            </Link>
          </div>
        ))}
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

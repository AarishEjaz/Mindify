"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

// Small reusable card for the admin links.
function AdminCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-zinc-200 bg-white p-5 hover:border-indigo-300"
    >
      <h2 className="mb-1 font-semibold text-zinc-800">{title}</h2>
      <p className="text-sm text-zinc-600">{description}</p>
    </Link>
  );
}

function AdminContent() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-800">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminCard
          href="/admin/tests"
          title="Tests"
          description="Create and manage tests and their traits."
        />
        <AdminCard
          href="/admin/questions"
          title="Questions"
          description="Add and edit questions for each test."
        />
        <AdminCard
          href="/admin/reports"
          title="Reports"
          description="View all user attempts and results."
        />
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

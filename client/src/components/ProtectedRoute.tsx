"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Wrap any page that should only be visible to logged-in users.
// Pass adminOnly={true} to also require the admin role.
//
// Usage:
//   <ProtectedRoute adminOnly>
//     <AdminStuff />
//   </ProtectedRoute>
export default function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until we know whether the user is logged in.
    if (loading) {
      return;
    }
    if (!user) {
      // Send people to the matching login page.
      router.replace(adminOnly ? "/admin/login" : "/login");
      return;
    }
    if (adminOnly && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, loading, adminOnly, router]);

  // While checking, or while redirecting, show a simple loading message.
  if (loading || !user || (adminOnly && user.role !== "admin")) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-zinc-500">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}

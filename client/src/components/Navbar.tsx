"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// The top navigation bar. It shows different links depending on whether
// the user is logged in and whether they are an admin.
export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="border-b border-zinc-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-indigo-600">
          Psychometric
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/dashboard" className="text-zinc-700 hover:text-indigo-600">
                Dashboard
              </Link>
              <Link href="/tests" className="text-zinc-700 hover:text-indigo-600">
                Tests
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="text-zinc-700 hover:text-indigo-600">
                  Admin
                </Link>
              )}
              <span className="hidden text-zinc-500 sm:inline">
                Hi, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-zinc-100 px-3 py-1.5 text-zinc-700 hover:bg-zinc-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-zinc-700 hover:text-indigo-600">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

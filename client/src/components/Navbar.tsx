"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Brain } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// The top navigation bar. Sticky, sharp, and shows different links
// depending on whether the user is logged in and whether they are admin.
export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Highlight the link for the page we are currently on.
  const linkClass = (href: string) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return active
      ? "text-zinc-900 font-semibold"
      : "text-zinc-500 hover:text-zinc-900";
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <nav className="flex items-center justify-between px-6 py-3.5 sm:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-600" strokeWidth={2.25} />
          <span className="text-base font-extrabold tracking-tight text-zinc-900">
            MINDIFY
          </span>
        </Link>

        <div className="flex items-center gap-5 text-sm">
          {user ? (
            <>
              <Link href="/dashboard" className={`transition-colors ${linkClass("/dashboard")}`}>
                Dashboard
              </Link>
              <Link href="/tests" className={`transition-colors ${linkClass("/tests")}`}>
                Tests
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className={`transition-colors ${linkClass("/admin")}`}>
                  Admin
                </Link>
              )}
              <span className="hidden text-zinc-400 sm:inline">{user.name}</span>
              <button
                onClick={handleLogout}
                className="cursor-pointer rounded-[2px] border border-zinc-300 px-3 py-1.5 text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="cursor-pointer rounded-[2px] border border-indigo-600 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 sm:text-sm"
              >
                Login as User
              </Link>
              <Link
                href="/admin/login"
                className="cursor-pointer rounded-[2px] bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 sm:text-sm"
              >
                Login as Admin
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

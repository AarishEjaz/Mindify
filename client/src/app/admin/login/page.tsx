"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// ---- Inline SVG icons ----
function ShieldIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="1" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="1" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a13.4 13.4 0 0 1-2.4 3.2M6.6 6.6A13.3 13.3 0 0 0 2 11s3.5 7 10 7a10.9 10.9 0 0 0 3.4-.5" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const { loginAdmin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await loginAdmin(email, password);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputWrap =
    "flex items-center gap-2.5 rounded-[2px] border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 transition-colors focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500";
  const inputBase =
    "w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none";

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12">
      {/* faint grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative w-full max-w-sm rounded-[3px] border border-zinc-800 bg-zinc-900 p-8">
        <div className="mb-6 flex items-center gap-2 text-indigo-400">
          <ShieldIcon />
          <span className="text-sm font-bold uppercase tracking-[0.2em]">
            Admin Console
          </span>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Restricted area — admin accounts only.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-[2px] border-l-2 border-red-500 bg-red-500/10 px-3 py-2.5 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5" noValidate>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Email
            </label>
            <div className={inputWrap}>
              <span className="text-zinc-500">
                <MailIcon />
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className={inputBase}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Password
            </label>
            <div className={inputWrap}>
              <span className="text-zinc-500">
                <LockIcon />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={inputBase}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="cursor-pointer text-zinc-500 transition-colors hover:text-zinc-300"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-[2px] bg-indigo-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && (
              <span className="h-4 w-4 motion-safe:animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {submitting ? "Signing in" : "Sign in"}
          </button>
        </form>

        {/* Demo admin account */}
        <div className="mt-6 rounded-[2px] border border-zinc-800 bg-zinc-800/40 px-3 py-2.5 text-xs leading-relaxed text-zinc-400">
          <span className="font-semibold text-zinc-300">Demo admin:</span>{" "}
          admin@example.com / admin123
        </div>

        <p className="mt-6 text-sm text-zinc-400">
          Not an admin?{" "}
          <Link
            href="/login"
            className="cursor-pointer font-semibold text-indigo-400 underline-offset-4 transition-colors hover:text-indigo-300 hover:underline"
          >
            User login
          </Link>
        </p>
      </div>
    </div>
  );
}

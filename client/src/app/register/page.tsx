"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// ---- Crisp inline SVG icons (no emoji) ----
function UserIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
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

const TRAITS = ["Technical", "Creative", "Social", "Business", "Research"];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    // Match the backend rule: password must be at least 6 characters.
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputWrap =
    "flex items-center gap-2.5 rounded-[2px] border border-zinc-300 bg-white px-3 py-2.5 transition-colors focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600";
  const inputBase =
    "w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none";

  return (
    <div className="grid flex-1 lg:grid-cols-[5fr_6fr]">
      {/* LEFT: editorial dark panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-10 text-white lg:flex xl:p-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative flex items-center justify-between">
          <span className="text-base font-extrabold tracking-tight">MINDIFY</span>
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Career Assessment
          </span>
        </div>

        <div className="relative">
          <h2 className="max-w-md text-[2.6rem] font-extrabold leading-[1.05] tracking-tight">
            Start your self-discovery.
          </h2>
          <div className="mt-6 h-1 w-12 bg-indigo-500" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-400">
            Create an account to take the assessment and receive a personalised,
            trait-based career report.
          </p>
        </div>

        <div className="relative">
          <ul className="grid grid-cols-1 gap-px border border-zinc-800 bg-zinc-800 sm:grid-cols-2">
            {TRAITS.map((trait, index) => (
              <li key={trait} className="flex items-center gap-3 bg-zinc-950 px-4 py-3">
                <span className="text-[11px] font-semibold tabular-nums text-indigo-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-zinc-300">{trait}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[11px] uppercase tracking-[0.15em] text-zinc-600">
            For guidance only — not a clinical diagnosis
          </p>
        </div>
      </div>

      {/* RIGHT: form panel */}
      <div className="flex items-center justify-center bg-white px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <span className="text-base font-extrabold tracking-tight text-zinc-900">
              MINDIFY
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400">
              Career Assessment
            </span>
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Get started
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            It only takes a minute to begin.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-[2px] border-l-2 border-red-600 bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Name
              </label>
              <div className={inputWrap}>
                <span className="text-zinc-400">
                  <UserIcon />
                </span>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className={inputBase}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Email
              </label>
              <div className={inputWrap}>
                <span className="text-zinc-400">
                  <MailIcon />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputBase}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Password
              </label>
              <div className={inputWrap}>
                <span className="text-zinc-400">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  className={inputBase}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="cursor-pointer text-zinc-400 transition-colors hover:text-zinc-900"
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
              {submitting ? "Creating" : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="cursor-pointer font-semibold text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-700 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

/**
 * Landing-page theme system (light / dark).
 *
 * Dark mode is scoped to the landing page only: the `.dark` class is applied
 * to a wrapper around the whole page rather than <html>, so the rest of the
 * app (which forces light) is untouched. Preference is persisted in
 * localStorage and falls back to the OS color-scheme on first visit.
 *
 * We intentionally render `light` on the server + first client paint to avoid
 * a hydration mismatch, then sync the real preference in an effect.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "mindify-landing-theme";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function LandingShell({ children }: { children: ReactNode }) {
  // Always start "light" so the server render and first client paint match
  // (no hydration mismatch); the real preference is synced in the effect.
  const [theme, setTheme] = useState<Theme>("light");

  // Resolve the stored / preferred theme once on the client. Reading
  // localStorage / matchMedia here (not during render) is the correct place
  // to sync with these external systems, so we opt out of the
  // set-state-in-effect heuristic for this one-time initialization.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const resolved: Theme =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia?.("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(resolved);
  }, []);

  const toggle = () =>
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div className={theme === "dark" ? "dark" : undefined}>
        {/* Base page surface — light and dark backgrounds live here. */}
        <div className="relative overflow-x-hidden bg-white text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

/* A compact glassy light/dark toggle button. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/60 bg-white/50 text-slate-700 backdrop-blur-md transition-colors hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20 ${className}`}
    >
      <SunMoon isDark={isDark} />
    </button>
  );
}

/* Inline icon that crossfades + rotates between sun and moon. */
function SunMoon({ isDark }: { isDark: boolean }) {
  return (
    <span className="relative block h-5 w-5">
      {/* Sun */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
          isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      {/* Moon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
        }`}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </span>
  );
}

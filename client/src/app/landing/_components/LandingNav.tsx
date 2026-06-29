"use client";

/**
 * LandingNav — the landing page's own sticky, glassy navigation bar.
 *
 * The global app Navbar is hidden on /landing (see components/Navbar.tsx),
 * so this is the only header here. In-page links use hash anchors that
 * smooth-scroll to each section; the CTA routes to the assessment flow.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Brain, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Assessments", href: "#assessments" },
  { label: "FAQ", href: "#faq" },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Add a stronger glass background once the user scrolls past the hero top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      {/* Floating glass "pill" navbar. The glassmorphism is always present
          (blur + saturate + translucent fill + inner highlight) and simply
          intensifies on scroll. */}
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 sm:px-6 ${
          scrolled
            ? "border border-white/60 bg-white/70 shadow-[0_12px_40px_-12px_rgba(30,27,75,0.28)] dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_16px_44px_-12px_rgba(0,0,0,0.6)]"
            : "border border-white/40 bg-white/40 shadow-[0_8px_30px_-16px_rgba(30,27,75,0.2)] dark:border-white/10 dark:bg-white/[0.04]"
        }`}
      >
        {/* Brand */}
        <Link href="#home" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/30">
            <Brain className="h-5 w-5 text-white" strokeWidth={2.25} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            Mindify
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-700 dark:text-slate-300 dark:hover:text-indigo-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop actions: theme toggle + CTA */}
        <div className="hidden items-center gap-2.5 md:flex">
          <ThemeToggle />
          <Link
            href="/tests"
            className="group inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:shadow-xl hover:shadow-indigo-600/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Start Assessment
          </Link>
        </div>

        {/* Mobile actions: theme toggle + menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/60 bg-white/50 text-slate-700 backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown — a floating glass panel below the pill. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-slate-900/70 md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-indigo-300"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/tests"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-600/25"
              >
                Start Assessment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

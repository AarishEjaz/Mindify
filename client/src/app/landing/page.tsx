import type { Metadata } from "next";
import { LandingShell } from "./_components/theme";
import LandingNav from "./_components/LandingNav";
import Hero from "./_components/Hero";
import ProblemSection from "./_components/ProblemSection";
import HowItWorks from "./_components/HowItWorks";
import Features from "./_components/Features";
import Categories from "./_components/Categories";
import ResultPreview from "./_components/ResultPreview";
import WhyChooseUs from "./_components/WhyChooseUs";
import DisclaimerSection from "./_components/DisclaimerSection";
import Faq from "./_components/Faq";
import FinalCta from "./_components/FinalCta";

/**
 * Mindify landing page — a premium, 3D-immersive, scroll-based experience for
 * the psychometric assessment platform.
 *
 * Composition only: each section is a small, self-contained component under
 * ./_components. Shared animation/UI primitives live in ./_components/primitives.
 *
 * Design notes:
 *  - Light theme, indigo→violet brand gradient, glassmorphism + soft shadows.
 *  - "3D" feel via CSS perspective/transforms + Framer Motion (no Three.js),
 *    keeping it lightweight and performant.
 *  - Scroll-triggered reveals, parallax depth layers, and floating cards.
 *  - Reduced-motion is respected throughout (see primitives + globals.css).
 *  - The global app Navbar is hidden here; this page uses its own LandingNav.
 */

export const metadata: Metadata = {
  title: "Mindify — Discover Your Personality, Strengths & Career Direction",
  description:
    "Take a structured psychometric assessment to understand your behavior patterns, decision-making style, strengths, and growth areas. For self-awareness and career guidance — not a medical or diagnostic tool.",
};

export default function LandingPage() {
  return (
    // LandingShell provides the light/dark theme + the base page surface
    // (and overflow-x-hidden so decorative parallax blobs never cause
    // horizontal scroll on small screens).
    <LandingShell>
      <LandingNav />

      <div>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <Features />
        <Categories />
        <ResultPreview />
        <WhyChooseUs />
        <DisclaimerSection />
        <Faq />
        <FinalCta />
      </div>
    </LandingShell>
  );
}

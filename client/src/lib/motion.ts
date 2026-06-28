import { type Variants } from "motion/react";

// Shared animation variants used across the app, so every page animates
// the same way (one source of truth — no copy-pasting transitions).
//
// How to use:
//   <motion.div initial="hidden" animate="show" variants={containerVariants}>
//     <motion.div variants={itemVariants}>...</motion.div>
//   </motion.div>

// A container staggers its children in one after another.
export const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

// Each item fades in while sliding up a little.
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// A simple fade+up for single elements (no stagger needed).
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

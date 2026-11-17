"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Page transition. template.tsx re-mounts on every navigation, so each new
 * page enters behind a black curtain that lifts away, while content fades in. (Opacity only — a transform here would break
 * fixed/pinned descendants.)
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] flex items-end bg-obsidian"
        initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 100% 0%)" }}
        transition={{ duration: reduce ? 0 : 0.85, ease: [0.76, 0, 0.24, 1], delay: reduce ? 0 : 0.05 }}
      >
        <div className="px-gutter label flex w-full justify-between pb-6 text-concrete">
          <span>22SIDE®</span>
          <span className="text-blood">●</span>
          <span>No rules. Just attitude.</span>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.2 : 0.9, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : 0.25 }}
      >
        {children}
      </motion.div>
    </>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { stops } from "@/content/site";
import { LineBullet } from "@/components/transit/Transit";

/**
 * Page transition — "Next stop". template.tsx re-mounts on every navigation:
 * a station board announces the destination, then lifts away like a shutter.
 * (Content only fades — a transform here would break fixed/pinned children.)
 */
// The first page load has its own opening (or none): only soft navigations get the board.
let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const [show] = useState(() => {
    const s = hasNavigated;
    hasNavigated = true;
    return s;
  });
  const reduce = useReducedMotion() || !show;
  const pathname = usePathname();
  const stop = stops.find((s) => s.match(pathname))?.name ?? "22 Side Street";
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] flex flex-col justify-center bg-obsidian"
        initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 100% 0%)" }}
        transition={{ duration: reduce ? 0 : 0.8, ease: [0.76, 0, 0.24, 1], delay: reduce ? 0 : 0.32 }}
      >
        <motion.div
          className="px-gutter"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <p className="label flex items-center gap-2 text-concrete">
            <LineBullet size="xs" /> Next stop
          </p>
          <p className="mt-3 border-t-4 border-dirty pt-3 font-sans text-[clamp(2.4rem,8vw,6rem)] font-bold leading-none tracking-[-0.03em] [font-stretch:90%]">
            {stop}
          </p>
        </motion.div>
        <div className="px-gutter label absolute inset-x-0 bottom-6 flex justify-between text-concrete">
          <span>22SIDE®</span>
          <span className="text-blood">●</span>
          <span>Line 22</span>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.2 : 0.9, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : 0.45 }}
      >
        {children}
      </motion.div>
    </>
  );
}

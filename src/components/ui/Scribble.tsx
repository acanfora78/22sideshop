"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/format";

const PATHS = {
  underline: "M4,22 C60,8 120,30 190,14 S300,6 396,20",
  circle: "M200,8 C80,6 10,30 14,58 C20,92 140,104 250,96 C360,88 400,60 384,34 C366,8 250,4 150,16",
  arrow: "M6,40 C80,10 160,10 230,34 M230,34 l-26,-20 M230,34 l-30,12",
};

/** Spray-marker scribble that draws itself when it scrolls into view. */
export function Scribble({
  variant = "underline",
  className,
  color = "#b31e1e",
  delay = 0.2,
  strokeWidth = 7,
}: {
  variant?: keyof typeof PATHS;
  className?: string;
  color?: string;
  delay?: number;
  strokeWidth?: number;
}) {
  const reduce = useReducedMotion();
  const viewBox = variant === "circle" ? "0 0 400 110" : variant === "arrow" ? "0 0 240 60" : "0 0 400 34";
  return (
    <svg viewBox={viewBox} preserveAspectRatio="none" className={cn("pointer-events-none overflow-visible", className)} aria-hidden>
      <motion.path
        d={PATHS[variant]}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay }}
      />
    </svg>
  );
}

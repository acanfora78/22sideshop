"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/format";

const TONES = {
  red: "bg-blood text-dirty",
  white: "bg-dirty text-obsidian",
  black: "bg-obsidian text-dirty border-2 border-dirty",
} as const;

/**
 * Street sticker: pops in with a spring and (optionally) can be dragged
 * around the screen — a small toy that makes the site feel alive.
 */
export function Sticker({
  label,
  tone = "white",
  rotate = 0,
  delay = 0,
  big = false,
  draggable = false,
  className,
}: {
  label: string;
  tone?: keyof typeof TONES;
  rotate?: number;
  delay?: number;
  big?: boolean;
  draggable?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={cn("pointer-events-auto z-10 select-none", draggable && "cursor-grab touch-none active:cursor-grabbing", className)}
      initial={reduce ? { opacity: 0 } : { scale: 0, rotate: rotate - 40, opacity: 0 }}
      whileInView={{ scale: 1, rotate, opacity: 1 }}
      viewport={{ once: true }}
      transition={reduce ? { duration: 0.2, delay } : { type: "spring", stiffness: 380, damping: 14, delay }}
      drag={draggable}
      dragMomentum
      whileHover={reduce ? undefined : { scale: 1.08, rotate: rotate + 4 }}
      whileDrag={{ scale: 1.15, rotate: rotate - 6, zIndex: 50 }}
      aria-hidden
    >
      <span
        className={cn(
          "font-marker inline-block whitespace-nowrap rounded-[3px] shadow-[3px_4px_0_rgba(0,0,0,0.45)]",
          big ? "px-5 py-1 text-5xl md:text-7xl" : "px-3.5 py-1.5 text-lg md:text-2xl",
          TONES[tone],
        )}
      >
        {label}
      </span>
    </motion.span>
  );
}

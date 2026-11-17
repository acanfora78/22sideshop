"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ElementType, ReactNode } from "react";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

/** Fade + rise on enter viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
  once = true,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; once?: boolean } & HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -10% 0px" }}
      transition={{ duration: reduce ? 0.3 : 1, ease: EASE_OUT, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Masked word-by-word text reveal. Each word slides up from behind a clip.
 * Text stays a single accessible string (aria-label) for screen readers.
 */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  trigger = "view",
}: {
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  trigger?: "view" | "mount";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const animateProps =
    trigger === "mount"
      ? { initial: "hidden", animate: "show" }
      : { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -8% 0px" } };
  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden
        className="inline"
        {...animateProps}
        transition={{ staggerChildren: reduce ? 0 : stagger, delayChildren: delay }}
      >
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
            <motion.span
              className={`inline-block will-change-transform ${wordClassName ?? ""}`}
              variants={{
                hidden: reduce ? { opacity: 0 } : { y: "110%", rotate: 4 },
                show: reduce ? { opacity: 1 } : { y: "0%", rotate: 0 },
              }}
              transition={{ duration: reduce ? 0.3 : 1.05, ease: EASE_OUT }}
            >
              {w}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Clip-path wipe reveal for images and blocks. */
export function ImageReveal({
  children,
  className,
  direction = "up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const hidden =
    direction === "up" ? "inset(100% 0% 0% 0%)" : direction === "left" ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { clipPath: hidden }}
      whileInView={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: reduce ? 0.3 : 1.3, ease: EASE_IN_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

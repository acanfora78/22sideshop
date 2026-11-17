"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-scrubbed vertical parallax. The child is oversized (scale) so the
 * movement never reveals edges. No-op under prefers-reduced-motion.
 */
export function Parallax({
  children,
  speed = 12,
  className,
  innerClassName,
}: {
  children: ReactNode;
  /** yPercent travel, positive moves slower than scroll. */
  speed?: number;
  className?: string;
  innerClassName?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!outer.current || !inner.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner.current,
        { yPercent: -speed / 2 },
        {
          yPercent: speed / 2,
          ease: "none",
          scrollTrigger: { trigger: outer.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={outer} className={`overflow-hidden ${className?.includes("absolute") ? "" : "relative"} ${className ?? ""}`}>
      <div ref={inner} className={`absolute inset-[-8%_0] will-change-transform ${innerClassName ?? ""}`}>
        {children}
      </div>
    </div>
  );
}

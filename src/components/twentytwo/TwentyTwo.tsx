"use client";

import Image from "next/image";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/format";

gsap.registerPlugin(ScrollTrigger);

/**
 * THE 22 SYSTEM — the number as the brand's visual language.
 * Two strokes side by side = two tracks of Line 22 = "the two sides".
 */

/** Outlined "22" whose strokes draw themselves, then fill. */
export function TwentyTwoMark({ className, fill = true, delay = 0 }: { className?: string; fill?: boolean; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 140" className={cn("overflow-visible", className)} aria-hidden>
      <motion.text
        x="100"
        y="128"
        textAnchor="middle"
        fontFamily="var(--font-anton), Impact, sans-serif"
        fontSize="150"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="currentColor"
        initial={reduce ? { fillOpacity: 1 } : { strokeDasharray: 900, strokeDashoffset: 900, fillOpacity: 0 }}
        whileInView={{ strokeDashoffset: 0, fillOpacity: fill ? 1 : 0 }}
        viewport={{ once: true }}
        transition={{ strokeDashoffset: { duration: 1.6, ease: [0.65, 0, 0.35, 1], delay }, fillOpacity: { duration: 0.6, delay: delay + 1.3 } }}
      >
        22
      </motion.text>
    </svg>
  );
}

/**
 * Section transition: a giant "22" cut out of a black screen. As you scroll
 * it grows until the image behind fills the viewport — the number literally
 * opens the way into the next section. (Pinned on scroll; static for reduced motion.)
 */
export function TwentyTwoReveal({ image, alt, children }: { image: string; alt: string; children?: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const group = useRef<SVGGElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    if (!wrap.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrap.current, start: "top top", end: "+=140%", scrub: 0.6, pin: true, anticipatePin: 1 },
      });
      tl.fromTo(group.current, { scale: 1 }, { scale: 30, svgOrigin: "600 712", ease: "power2.in" }, 0);
      tl.fromTo(caption.current, { opacity: 1 }, { opacity: 0, duration: 0.25 }, 0);
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrap} className="relative h-[100svh] overflow-hidden bg-obsidian">
      <Image src={image} alt={alt} fill sizes="100vw" className="object-cover" />
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <mask id={`m-${id}`}>
            <rect width="1600" height="1000" fill="white" />
            <g ref={group}>
              <text x="800" y="740" textAnchor="middle" fontFamily="var(--font-anton), Impact, sans-serif" fontSize="760" fill="black">
                22
              </text>
            </g>
          </mask>
        </defs>
        <rect width="1600" height="1000" fill="#080808" mask={`url(#m-${id})`} />
      </svg>
      <div ref={caption} className="px-gutter absolute inset-x-0 bottom-8 flex items-end justify-between">{children}</div>
    </div>
  );
}

/**
 * Two parallel tracks that draw across the page as you scroll, with a
 * "train" dot travelling along them — the line that guides you to the next stop.
 */
export function TrackLines({ label, className }: { label?: string; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const paths = svg.querySelectorAll<SVGPathElement>("[data-track]");
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: svg, start: "top 90%", end: "bottom 30%", scrub: true } });
      });
      gsap.fromTo(svg.querySelector("[data-train]"), { attr: { cx: 0 } }, { attr: { cx: 1600 }, ease: "none", scrollTrigger: { trigger: svg, start: "top 90%", end: "bottom 30%", scrub: true } });
    }, svg);
    return () => ctx.revert();
  }, []);
  return (
    <div className={cn("relative py-10", className)} aria-hidden>
      <svg ref={ref} viewBox="0 0 1600 120" preserveAspectRatio="none" className="h-24 w-full md:h-28">
        <path data-track d="M0,40 C400,40 500,90 800,90 S1200,40 1600,40" stroke="#8b1717" strokeWidth="5" fill="none" vectorEffect="non-scaling-stroke" />
        <path data-track d="M0,58 C400,58 500,108 800,108 S1200,58 1600,58" stroke="#e8e5df" strokeOpacity="0.35" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
        <circle data-train cx="0" cy="40" r="7" fill="#e8e5df" />
      </svg>
      {label && <p className="label px-gutter mt-2 text-concrete">{label}</p>}
    </div>
  );
}

/** Ambient drifting 22 pattern behind a section. */
export function Pattern22({ className }: { className?: string }) {
  return <div aria-hidden className={cn("pattern-22 pointer-events-none absolute inset-0", className)} />;
}

/** Big number counter: flips through numbers and lands on 22. */
export function Count22({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const obj = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: 22,
        duration: 1.6,
        ease: "power3.out",
        snap: { n: 1 },
        onUpdate: () => (el.textContent = String(obj.n).padStart(2, "0")),
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });
    return () => ctx.revert();
  }, []);
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      22
    </span>
  );
}

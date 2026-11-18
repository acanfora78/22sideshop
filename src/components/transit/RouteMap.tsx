"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/format";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

/**
 * Line 22 route map pinned to the right edge of the homepage (desktop).
 * Each homepage section is a stop; the current stop lights up as you scroll,
 * and clicking a stop travels there.
 */
export function RouteMap({ stops }: { stops: readonly { id: string; label: string }[] }) {
  const [active, setActive] = useState(stops[0]?.id);
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    const els = stops.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [stops]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const activeIndex = Math.max(0, stops.findIndex((s) => s.id === active));

  return (
    <nav aria-label="Line 22 — sezioni della pagina" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <ol className="relative flex flex-col items-end gap-5">
        <span aria-hidden className="absolute bottom-2 right-[7px] top-2 w-[3px] bg-dirty/15" />
        <span
          aria-hidden
          className="absolute right-[7px] top-2 w-[3px] bg-blood transition-[height] duration-700 ease-[var(--ease-out-expo)]"
          style={{ height: `calc(${(activeIndex / Math.max(1, stops.length - 1)) * 100}% - ${activeIndex === stops.length - 1 ? 16 : 0}px)` }}
        />
        {stops.map((s, i) => {
          const on = s.id === active;
          const passed = i <= activeIndex;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(s.id)}
                aria-current={on ? "step" : undefined}
                className="group flex items-center justify-end gap-3"
              >
                <span
                  className={cn(
                    "label whitespace-nowrap bg-obsidian/85 px-2 py-1 text-[0.6rem] backdrop-blur-sm transition-[opacity,transform,color] duration-300",
                    on ? "translate-x-0 text-dirty opacity-100" : "translate-x-2 text-concrete opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                  )}
                >
                  {s.label}
                </span>
                <span
                  className={cn(
                    "relative block size-[17px] rounded-full border-[3px] transition-colors duration-300",
                    passed ? "border-blood" : "border-dirty/30",
                    on ? "bg-blood" : "bg-obsidian",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

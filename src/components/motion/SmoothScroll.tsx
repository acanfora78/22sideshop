"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollCtx {
  lenis: Lenis | null;
  /** Lock page scroll (menus, intro, drawers). */
  lock: (locked: boolean) => void;
}

const Ctx = createContext<ScrollCtx>({ lenis: null, lock: () => {} });

export function useSmoothScroll() {
  return useContext(Ctx);
}

/**
 * Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger and Lenis
 * share one RAF loop. Disabled entirely for prefers-reduced-motion and for
 * coarse pointers (native touch scrolling feels better on phones).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const locks = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const instance = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenisRef.current = instance;
    if (locks.current > 0) instance.stop();
    // Exposes the external Lenis instance to consumers.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);
    document.documentElement.classList.add("lenis");

    // In-page anchor links
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      const href = a?.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      instance.scrollTo(el as HTMLElement, { offset: -40 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      instance.destroy();
      document.documentElement.classList.remove("lenis");
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  // Reset scroll on route change.
  useEffect(() => {
    if (window.location.hash) return;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname, lenis]);

  const lock = (locked: boolean) => {
    locks.current = Math.max(0, locks.current + (locked ? 1 : -1));
    const isLocked = locks.current > 0;
    document.documentElement.classList.toggle("scroll-locked", isLocked);
    const l = lenisRef.current;
    if (l) {
      if (isLocked) l.stop();
      else l.start();
    }
  };

  return <Ctx.Provider value={{ lenis, lock }}>{children}</Ctx.Provider>;
}

/** Locks scroll while `active` is true. */
export function useScrollLock(active: boolean) {
  const { lock } = useSmoothScroll();
  useEffect(() => {
    if (!active) return;
    lock(true);
    return () => lock(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}

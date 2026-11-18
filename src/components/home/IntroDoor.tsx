"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { home, site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { EASE_IN_OUT, EASE_OUT } from "@/components/motion/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { DoorScene } from "./DoorScene";
import { INTRO_STORAGE_KEY } from "./intro-config";
import { INTRO_DONE_EVENT } from "./useIntroDone";

type Phase = "scene" | "title" | "leaving" | "done";

const TITLE_STICKERS = [
  { label: "No rules", tone: "red", className: "left-[6%] top-[18%]", rotate: -14, delay: 0.25 },
  { label: "Open late", tone: "white", className: "right-[8%] top-[22%]", rotate: 10, delay: 0.35 },
  { label: "Fresh drop", tone: "black", className: "left-[10%] bottom-[22%]", rotate: 8, delay: 0.45 },
  { label: "22", tone: "red", className: "right-[12%] bottom-[18%]", rotate: -6, delay: 0.55, big: true },
] as const;

/**
 * Opening "short film": a kid unlocks the 22SIDE door with a key and the
 * camera dives into the shop (DoorScene), then a glitched logo slam with
 * draggable stickers and the ENTER THE SIDE CTA.
 * - Skippable at any time (button, Esc). Enter / scroll on the title card enters.
 * - Remembered for 12h (localStorage), hidden pre-paint on return visits.
 * - Reduced motion: no film, straight to a static title card.
 */
export function IntroDoor() {
  const reduce = useReducedMotion();
  const { lock } = useSmoothScroll();
  const [phase, setPhase] = useState<Phase>("scene");
  const [glitch, setGlitch] = useState(false);
  const locked = useRef(false);

  const finish = useCallback(() => {
    setPhase((p) => (p === "leaving" || p === "done" ? p : "leaving"));
  }, []);

  useEffect(() => {
    const seen = document.documentElement.getAttribute("data-intro") === "seen";
    if (seen) {
      // Reads pre-paint state written by the inline script in layout.tsx.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done");
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      return;
    }
    lock(true);
    locked.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPhase("title");
    return () => {
      if (locked.current) {
        lock(false);
        locked.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Periodic glitch on the title logo.
  useEffect(() => {
    if (phase !== "title" || reduce) return;
    const id = window.setInterval(() => {
      setGlitch(true);
      window.setTimeout(() => setGlitch(false), 180);
    }, 1900);
    return () => window.clearInterval(id);
  }, [phase, reduce]);

  useEffect(() => {
    if (phase === "done" || phase === "leaving") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      if (e.key === "Enter" && phase === "title") finish();
    };
    const onWheel = (e: WheelEvent) => {
      if (phase === "title" && e.deltaY > 8) finish();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
  }, [phase, finish]);

  const onExitComplete = () => {
    try {
      window.localStorage.setItem(INTRO_STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    document.documentElement.setAttribute("data-intro", "seen");
    if (locked.current) {
      lock(false);
      locked.current = false;
    }
    setPhase("done");
    window.dispatchEvent(new Event(INTRO_DONE_EVENT));
  };

  const visible = phase === "scene" || phase === "title";

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible && (
        <motion.div
          key="intro"
          data-intro-overlay
          role="dialog"
          aria-modal="true"
          aria-label="22SIDE intro"
          className="fixed inset-0 z-[85] overflow-hidden bg-obsidian text-dirty"
          exit={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: reduce ? 0.3 : 0.9, ease: EASE_IN_OUT }}
        >
          {phase === "scene" && <DoorScene onComplete={() => setPhase("title")} />}

          {/* HUD */}
          <div className="label pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-8">
            <span className="flex items-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-blood-bright" /> REC — 02:22 AM
            </span>
            <span className="hidden sm:inline">22 Side St.</span>
          </div>

          <AnimatePresence>
            {phase === "title" && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center bg-dirty px-6 text-center text-obsidian"
                initial={{ opacity: 1 }}
                animate={{ backgroundColor: "#080808", color: "#e8e5df" }}
                transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
              >
                {/* sticker bomb — drag them around */}
                {TITLE_STICKERS.map((s) => (
                  <Sticker
                    key={s.label}
                    label={s.label}
                    tone={s.tone}
                    rotate={s.rotate}
                    delay={reduce ? 0 : s.delay}
                    big={"big" in s && s.big}
                    className={`absolute ${s.className}`}
                    draggable
                  />
                ))}

                <motion.div
                  className="relative"
                  initial={reduce ? { opacity: 0 } : { scale: 3, opacity: 0, rotate: -8 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={reduce ? { duration: 0.3 } : { type: "spring", stiffness: 260, damping: 14 }}
                >
                  <div className={glitch ? "translate-x-[3px]" : ""}>
                    <Logo className="text-[clamp(5rem,24vw,22rem)]" />
                  </div>
                  {glitch && (
                    <>
                      <div aria-hidden className="absolute inset-0 -translate-x-[6px] translate-y-[2px] text-blood-bright opacity-80 mix-blend-screen [clip-path:inset(10%_0_55%_0)]">
                        <Logo className="text-[clamp(5rem,24vw,22rem)]" />
                      </div>
                      <div aria-hidden className="absolute inset-0 translate-x-[8px] opacity-70 [clip-path:inset(60%_0_12%_0)]">
                        <Logo className="text-[clamp(5rem,24vw,22rem)]" />
                      </div>
                    </>
                  )}
                </motion.div>

                <motion.p
                  className="font-marker mt-2 -rotate-3 text-2xl text-blood-bright md:text-4xl"
                  initial={{ opacity: 0, y: 20, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: reduce ? 0 : 0.3, type: "spring", stiffness: 300, damping: 15 }}
                >
                  {site.slogan}
                </motion.p>

                <motion.div
                  className="mt-10 md:mt-14"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.6, duration: 0.7, ease: EASE_OUT }}
                >
                  <Magnetic strength={0.4}>
                    <button
                      type="button"
                      onClick={finish}
                      autoFocus
                      className="group relative flex items-center gap-4 overflow-hidden bg-blood px-9 py-5 font-mono text-xs uppercase tracking-[0.3em] text-dirty shadow-[6px_6px_0_#e8e5df] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#e8e5df] active:translate-y-1 active:shadow-[2px_2px_0_#e8e5df] md:px-12 md:py-6 md:text-sm"
                    >
                      <span className="relative">{home.arrival.cta}</span>
                      <span className="relative transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                    </button>
                  </Magnetic>
                </motion.div>
                <p className="label pointer-events-none absolute bottom-6 text-concrete">psst — gli sticker si spostano</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={finish}
            className="label absolute right-4 top-12 z-10 border border-dirty/30 bg-obsidian/60 px-3 py-2 text-dirty/80 backdrop-blur-sm transition-colors hover:bg-dirty hover:text-obsidian md:right-8 md:top-16"
          >
            Salta l’intro →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

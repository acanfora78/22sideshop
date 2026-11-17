"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { media, type MediaKey } from "@/content/media";
import { home, site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { EASE_IN_OUT, EASE_OUT } from "@/components/motion/Reveal";
import { INTRO_STORAGE_KEY } from "./intro-config";
import { INTRO_DONE_EVENT } from "./useIntroDone";


type Phase = "frames" | "title" | "leaving" | "done";
const FRAME_MS = 420;

/**
 * Opening sequence: rapid-cut film frames (≈1.7s) → logo + slogan → CTA.
 * - Skippable at any time (button, Esc), CTA / Enter / scroll to enter.
 * - Remembered for 12h (localStorage) and hidden pre-paint on return visits.
 * - Reduced motion: no cuts, straight to the title card.
 */
export function IntroSequence() {
  const reduce = useReducedMotion();
  const { lock } = useSmoothScroll();
  const [phase, setPhase] = useState<Phase>("frames");
  const [frame, setFrame] = useState(0);
  const locked = useRef(false);
  const frames = home.intro.frames;

  const finish = useCallback(() => {
    setPhase((p) => (p === "leaving" || p === "done" ? p : "leaving"));
  }, []);

  // Decide on mount whether to play.
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
    if (reduce) setPhase("title");
    return () => {
      if (locked.current) {
        lock(false);
        locked.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Frame cutting.
  useEffect(() => {
    if (phase !== "frames") return;
    const id = window.setInterval(() => {
      setFrame((f) => {
        if (f >= frames.length - 1) {
          window.clearInterval(id);
          setPhase("title");
          return f;
        }
        return f + 1;
      });
    }, FRAME_MS);
    return () => window.clearInterval(id);
  }, [phase, frames.length]);

  // Keyboard / wheel shortcuts.
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

  const visible = phase === "frames" || phase === "title";
  const current = frames[frame];

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
          exit={{ clipPath: reduce ? "inset(0 0 0 0)" : "inset(0% 0% 100% 0%)", opacity: reduce ? 0 : 1 }}
          transition={{ duration: reduce ? 0.3 : 1, ease: EASE_IN_OUT }}
        >
          {/* Film frames */}
          <div className="absolute inset-0 scanlines">
            {frames.map((f, i) => {
              const m = media[f.media as MediaKey];
              return (
                <div
                  key={f.media}
                  className="absolute inset-0 transition-opacity duration-150"
                  style={{ opacity: i === frame ? (phase === "title" ? 0.32 : 1) : 0 }}
                >
                  <Image
                    src={m.url}
                    alt=""
                    fill
                    priority={i < 2}
                    sizes="100vw"
                    className="object-cover"
                    style={{ transform: `scale(${i === frame ? 1.06 : 1.14})`, transition: `transform ${FRAME_MS * 3}ms linear` }}
                  />
                </div>
              );
            })}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/60" />
          </div>

          {/* Viewfinder HUD */}
          <div className="label pointer-events-none absolute inset-0 p-4 md:p-8">
            <div className="flex items-start justify-between">
              <span className="flex items-center gap-2">
                <span className="size-2 animate-pulse rounded-full bg-blood-bright" /> REC
              </span>
              <span className="hidden sm:inline">{site.positioning}</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between md:bottom-8 md:left-8 md:right-8">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phase === "title" ? "title" : current.caption}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {phase === "title" ? "PRESS ENTER ↵" : current.caption}
                </motion.span>
              </AnimatePresence>
              <span className="tabular-nums">
                00:00:0{frame}:{String((frame * 7 + 12) % 24).padStart(2, "0")}
              </span>
            </div>
            {/* corner brackets */}
            {["left-3 top-12 border-l border-t", "right-3 top-12 border-r border-t", "bottom-12 left-3 border-b border-l", "bottom-12 right-3 border-b border-r"].map(
              (c) => (
                <span key={c} className={`absolute size-6 border-dirty/50 md:size-10 ${c}`} />
              ),
            )}
          </div>

          {/* Title card */}
          <AnimatePresence>
            {phase === "title" && (
              <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <motion.div
                  initial={reduce ? { opacity: 0 } : { scale: 1.6, opacity: 0, filter: "blur(12px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: reduce ? 0.3 : 0.9, ease: EASE_OUT }}
                >
                  <Logo className="text-[clamp(5rem,24vw,22rem)]" />
                </motion.div>
                <motion.p
                  className="label mt-4 text-sm tracking-[0.4em] md:mt-6 md:text-base"
                  initial={{ opacity: 0, letterSpacing: "1em" }}
                  animate={{ opacity: 1, letterSpacing: "0.4em" }}
                  transition={{ delay: reduce ? 0 : 0.35, duration: 1, ease: EASE_OUT }}
                >
                  {site.slogan}
                </motion.p>
                <motion.div
                  className="mt-10 md:mt-14"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.6, duration: 0.8, ease: EASE_OUT }}
                >
                  <Magnetic strength={0.4}>
                    <button
                      type="button"
                      onClick={finish}
                      className="group relative flex items-center gap-4 overflow-hidden border border-dirty px-8 py-5 font-mono text-xs uppercase tracking-[0.3em] text-dirty transition-colors duration-300 hover:text-obsidian md:px-12 md:py-6 md:text-sm"
                      autoFocus
                    >
                      <span className="absolute inset-0 origin-left scale-x-0 bg-dirty transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
                      <span className="relative">{home.intro.cta}</span>
                      <span className="relative text-blood-bright transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </button>
                  </Magnetic>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={finish}
            className="label absolute right-4 top-12 z-10 p-2 text-dirty/70 transition-colors hover:text-dirty md:right-8 md:top-16"
          >
            Skip intro →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

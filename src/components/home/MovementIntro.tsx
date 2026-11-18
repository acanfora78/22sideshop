"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { Volume2, VolumeX } from "lucide-react";
import { movement } from "@/content/movement";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { EASE_OUT } from "@/components/motion/Reveal";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { LineBullet } from "@/components/transit/Transit";
import { INTRO_STORAGE_KEY } from "./intro-config";
import { INTRO_DONE_EVENT, markIntroDone } from "./useIntroDone";
import { MovementAudio } from "./movementAudio";

type Phase = "film" | "title" | "exit" | "done";

/** Timeline (seconds). Kept in one place so picture and sound stay in sync. */
const T = {
  city: 0,
  arrival: 1.5,
  key: 2.9,
  lock: 4.0,
  click: 4.85,
  door: 5.3,
  store: 6.7,
  lights: [6.85, 7.3, 7.75],
  movement: 8.5,
  title: 8.7,
  steps: [1.65, 2.0, 2.35, 2.7],
};

/**
 * THE MOVEMENT — opening short film.
 * SHOT 01 the city · 02 the arrival · 03 the key · 04 the lock (click) ·
 * 05 the door opens · 06 the store, lights on one by one · 07 the movement.
 * Built from original AI-generated stills (fictional character) directed with
 * GSAP: cuts, dolly moves, focus pulls, light changes, letterbox, and a giant
 * 22 that opens the way into the site.
 *
 * Skip at any time · remembered for the browsing session · reduced-motion
 * static card · sound off by default with a clear toggle.
 */
export function MovementIntro() {
  const { intro, shots } = movement;
  const { lock } = useSmoothScroll();
  const [phase, setPhase] = useState<Phase>("film");
  const [shot, setShot] = useState(0);
  const [sound, setSound] = useState(false);
  const [reduce, setReduce] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const exitRef = useRef<SVGGElement>(null);
  const film = useRef<gsap.Context | null>(null);
  const locked = useRef(false);
  const audio = useRef<MovementAudio | null>(null);
  const t0 = useRef(0);

  useEffect(() => {
    if (document.documentElement.getAttribute("data-intro") === "seen") {
      // Reads pre-paint state written by the inline script in layout.tsx.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done");
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      return;
    }
    lock(true);
    locked.current = true;
    t0.current = performance.now();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduce(true);
      setShot(shots.length - 1);
      setPhase("title");
    } else if (root.current) {
      const q = gsap.utils.selector(root.current);
      film.current = gsap.context(() => {
        const shotEls = q("[data-shot]");
        gsap.set(shotEls, { autoAlpha: 0 });
        gsap.set(q("[data-bar]"), { scaleY: 0 });
        const tl = gsap.timeline({ onComplete: () => setPhase((p) => (p === "film" ? "title" : p)) });
        const cut = (i: number, at: number, fade = 0) => {
          tl.call(() => setShot(i), [], at);
          tl.to(shotEls[i], { autoAlpha: 1, duration: fade }, at);
          if (i > 0) tl.set(shotEls[i - 1], { autoAlpha: 0 }, at + fade);
        };
        const cam = (i: number) => q(`[data-shot="${i}"] [data-cam]`);

        // letterbox in
        tl.to(q("[data-bar]"), { scaleY: 1, duration: 0.8, ease: "power3.inOut" }, 0);
        // 01 — the city: slow crane down + drift
        cut(0, T.city, 0.6);
        tl.fromTo(cam(0), { scale: 1.18, yPercent: -3 }, { scale: 1.04, yPercent: 0, duration: 1.7, ease: "sine.out" }, T.city);
        // 02 — the arrival: push toward the door
        cut(1, T.arrival);
        tl.fromTo(cam(1), { scale: 1.02, xPercent: 0 }, { scale: 1.22, xPercent: -4, duration: 1.5, ease: "none" }, T.arrival);
        // 03 — the key: focus pull
        cut(2, T.key);
        tl.fromTo(cam(2), { scale: 1.25, filter: "blur(10px)" }, { scale: 1.08, filter: "blur(0px)", duration: 0.7, ease: "power2.out" }, T.key);
        tl.to(cam(2), { yPercent: -3, duration: 0.5, ease: "power2.in" }, T.key + 0.6);
        // 04 — the lock: push in, turn, CLICK
        cut(3, T.lock);
        tl.fromTo(cam(3), { scale: 1.05, rotation: 0 }, { scale: 1.32, duration: 1.3, ease: "power1.in" }, T.lock);
        tl.to(cam(3), { rotation: 1.5, duration: 0.12, ease: "power4.out" }, T.click);
        tl.fromTo(q("[data-flash]"), { opacity: 0 }, { opacity: 0.35, duration: 0.05, yoyo: true, repeat: 1 }, T.click);
        tl.to(q("[data-shake]"), { x: "random(-8,8)", y: "random(-5,5)", duration: 0.04, repeat: 5, yoyo: true, ease: "none" }, T.click);
        tl.set(q("[data-shake]"), { x: 0, y: 0 }, T.click + 0.3);
        // 05 — the door: light floods in
        cut(4, T.door);
        tl.fromTo(cam(4), { scale: 1.0, filter: "brightness(0.18)" }, { scale: 1.12, filter: "brightness(1)", duration: 1.3, ease: "power2.out" }, T.door);
        // 06 — the store: lights switch on one by one, camera follows him in
        cut(5, T.store);
        tl.fromTo(cam(5), { scale: 1.0, filter: "brightness(0.05)" }, { scale: 1.22, duration: 1.9, ease: "none" }, T.store);
        tl.set(cam(5), { filter: "brightness(0.4)" }, T.lights[0]);
        tl.set(cam(5), { filter: "brightness(0.12)" }, T.lights[0] + 0.08);
        tl.set(cam(5), { filter: "brightness(0.45)" }, T.lights[0] + 0.16);
        tl.set(cam(5), { filter: "brightness(0.72)" }, T.lights[1]);
        tl.set(cam(5), { filter: "brightness(1)" }, T.lights[2]);
        // 07 — the movement
        cut(6, T.movement, 0.15);
        tl.fromTo(cam(6), { scale: 1.2 }, { scale: 1.04, duration: 1.4, ease: "power3.out" }, T.movement);
        tl.to(q("[data-bar]"), { scaleY: 0.45, duration: 0.8, ease: "power3.inOut" }, T.title);
      }, root);
    }
    return () => {
      film.current?.revert();
      if (locked.current) lock(false);
      locked.current = false;
      audio.current?.stop(0.1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const complete = useCallback(() => {
    try {
      window.sessionStorage.setItem(INTRO_STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    document.documentElement.setAttribute("data-intro", "seen");
    if (locked.current) lock(false);
    locked.current = false;
    audio.current?.stop(1);
    setPhase("done");
    window.dispatchEvent(new Event(INTRO_DONE_EVENT));
  }, [lock]);

  const finish = useCallback(() => {
    setPhase((p) => (p === "exit" || p === "done" ? p : "exit"));
    markIntroDone();
  }, []);

  // EXIT: the 22 grows out of black and opens onto the site.
  useEffect(() => {
    if (phase !== "exit") return;
    film.current?.revert();
    if (reduce || !exitRef.current) {
      complete();
      return;
    }
    const tween = gsap.fromTo(exitRef.current, { scale: 0.02 }, { scale: 34, svgOrigin: "625 785", duration: 1.25, ease: "power3.in", onComplete: complete });
    return () => {
      tween.kill();
    };
  }, [phase, reduce, complete]);

  useEffect(() => {
    if (phase === "done" || phase === "exit") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      if (e.key === "Enter" && phase === "title") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finish]);

  const toggleSound = () => {
    if (sound) {
      audio.current?.stop();
      audio.current = null;
      setSound(false);
      return;
    }
    const a = new MovementAudio();
    const elapsed = phase === "film" ? (performance.now() - t0.current) / 1000 : T.title;
    a.start(elapsed, { steps: T.steps, key: T.key + 0.2, click: T.click, door: T.door, lights: T.lights, hit: T.movement });
    audio.current = a;
    setSound(true);
  };

  if (phase === "done") return null;
  const exiting = phase === "exit";

  return (
    <div
      ref={root}
      data-intro-overlay
      role="dialog"
      aria-modal="true"
      aria-label="22SIDE — The Movement, intro"
      className={`fixed inset-0 z-[85] overflow-hidden text-dirty ${exiting ? "" : "bg-obsidian"}`}
    >
      {!exiting && (
        <div data-shake className="absolute inset-0">
          {shots.map((s, i) => (
            <div
              key={s.id}
              data-shot={i}
              className="absolute inset-0 overflow-hidden"
              style={{ visibility: reduce ? (i === shots.length - 1 ? "visible" : "hidden") : "hidden" }}
            >
              <div data-cam className="absolute inset-0 will-change-transform">
                <Image
                  src={s.src}
                  alt=""
                  fill
                  priority={i < 3}
                  sizes="100vw"
                  className="object-cover"
                  style={{ objectPosition: s.focus }}
                />
              </div>
            </div>
          ))}
          <div data-flash aria-hidden className="absolute inset-0 bg-dirty opacity-0" />
          <div aria-hidden className="scanlines absolute inset-0 opacity-60" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(8,8,8,0.7)_100%)]" />
        </div>
      )}

      {/* letterbox */}
      {!exiting && (
        <>
          <div data-bar aria-hidden className="absolute inset-x-0 top-0 h-[8vh] origin-top bg-obsidian md:h-[11vh]" style={{ transform: reduce ? "scaleY(0.45)" : undefined }} />
          <div data-bar aria-hidden className="absolute inset-x-0 bottom-0 h-[8vh] origin-bottom bg-obsidian md:h-[11vh]" style={{ transform: reduce ? "scaleY(0.45)" : undefined }} />
        </>
      )}

      {/* slate */}
      {!exiting && phase === "film" && (
        <div className="label pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-8">
          <span className="flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-blood-bright" /> REC
          </span>
          <AnimatePresence mode="wait">
            <motion.span key={shot} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="hidden items-center gap-2 sm:flex">
              <LineBullet size="xs" label={String(shot + 1).padStart(2, "0")} /> {shots[shot]?.label}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
      {!exiting && phase === "film" && (
        <AnimatePresence mode="wait">
          <motion.p
            key={shot}
            className="label pointer-events-none absolute bottom-[10vh] left-4 max-w-[70vw] text-dirty/85 md:bottom-[13vh] md:left-8"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <span className="text-blood-bright">{String(shot + 1).padStart(2, "0")}</span> — {shots[shot]?.caption}
          </motion.p>
        </AnimatePresence>
      )}

      {/* title */}
      <AnimatePresence>
        {phase === "title" && (
          <motion.div key="title" className="absolute inset-0 flex flex-col items-center justify-end px-5 pb-[13vh] text-center md:pb-[12vh]" exit={{ opacity: 0 }}>
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-obsidian via-obsidian/75 to-transparent" />
            <motion.div className="relative" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE_OUT }}>
              <Logo className="text-[clamp(2.4rem,7vw,4.5rem)]" />
            </motion.div>
            <h1 className="font-display relative mt-4 leading-[0.9]">
              {[intro.lineOne, intro.lineTwo].map((l, i) => (
                <span key={l} className="block overflow-hidden">
                  <motion.span
                    className={i === 0 ? "text-outline-dirty block text-[clamp(1.8rem,5vw,4.2rem)]" : "block text-[clamp(2.6rem,8.5vw,8rem)]"}
                    initial={reduce ? { opacity: 0 } : { y: "105%" }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.9, ease: EASE_OUT, delay: reduce ? 0 : 0.2 + i * 0.15 }}
                  >
                    {l}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.div className="relative mt-7" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 0.7, duration: 0.6, ease: EASE_OUT }}>
              <Magnetic strength={0.35}>
                <button
                  type="button"
                  onClick={finish}
                  autoFocus
                  className="group flex items-center gap-4 bg-blood px-8 py-5 font-mono text-xs uppercase tracking-[0.3em] text-dirty shadow-[6px_6px_0_#e8e5df] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#e8e5df] active:translate-y-1 active:shadow-[2px_2px_0_#e8e5df] md:px-12 md:py-6 md:text-sm"
                >
                  {intro.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </button>
              </Magnetic>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* controls */}
      {!exiting && (
        <>
          <button
            type="button"
            onClick={finish}
            className="label absolute right-4 top-12 z-10 border border-dirty/30 bg-obsidian/60 px-3 py-2 text-dirty/85 backdrop-blur-sm transition-colors hover:bg-dirty hover:text-obsidian md:right-8 md:top-16"
          >
            {intro.skip} →
          </button>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={sound}
            className="label absolute bottom-3 right-4 z-10 flex items-center gap-2 border border-dirty/30 bg-obsidian/60 px-3 py-2 backdrop-blur-sm transition-colors hover:bg-dirty hover:text-obsidian md:bottom-6 md:right-8"
          >
            {sound ? <Volume2 className="size-4" strokeWidth={1.5} /> : <VolumeX className="size-4" strokeWidth={1.5} />}
            {sound ? intro.soundOn : intro.soundOff}
          </button>
        </>
      )}

      {/* exit: the 22 opens the way */}
      {exiting && (
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <mask id="exit22">
              <rect width="1600" height="1000" fill="white" />
              <g ref={exitRef} transform="translate(625 785) scale(0.02) translate(-625 -785)">
                <text x="800" y="820" textAnchor="middle" fontFamily="var(--font-anton), Impact, sans-serif" fontSize="700" fill="black">
                  22
                </text>
              </g>
            </mask>
          </defs>
          <rect width="1600" height="1000" fill="#080808" mask="url(#exit22)" />
        </svg>
      )}
    </div>
  );
}

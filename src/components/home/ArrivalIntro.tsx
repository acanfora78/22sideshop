"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { Volume2, VolumeX } from "lucide-react";
import { media, overlays } from "@/content/media";
import { home, site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { EASE_OUT } from "@/components/motion/Reveal";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { LineBullet, StationSign } from "@/components/transit/Transit";
import { INTRO_STORAGE_KEY } from "./intro-config";
import { INTRO_DONE_EVENT, markIntroDone } from "./useIntroDone";
import { StationAudio } from "./stationAudio";

type Phase = "scene" | "title" | "doors" | "done";
const TITLE_AT = 4.1;

/**
 * THE ARRIVAL — opening sequence of 22 SIDE STREET.
 * Empty platform → fluorescent tubes stutter on → slow camera push → a
 * headlight grows in the tunnel → the train tears past → cut to the mosaic →
 * the station sign drops → 22SIDE / NO RULES. JUST ATTITUDE. / ENTER THE SIDE →
 * subway doors slide open onto the site.
 *
 * Skippable at any time (button / Esc), remembered for 12h, reduced-motion
 * safe (static title card), sound off by default with a clear toggle.
 */
export function ArrivalIntro() {
  const { arrival } = home;
  const { lock } = useSmoothScroll();
  const [phase, setPhase] = useState<Phase>("scene");
  const [sound, setSound] = useState(false);
  const [reduce, setReduce] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const locked = useRef(false);
  const audio = useRef<StationAudio | null>(null);
  const t0 = useRef(0);
  const film = useRef<gsap.Context | null>(null);

  // Gate: skip entirely for returning visitors.
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
      setPhase("title");
    } else if (root.current) {
      // The film (reverted only on unmount, so the last frame stays behind the title).
      const q = gsap.utils.selector(root.current);
      film.current = gsap.context(() => {
        gsap.set(q("[data-shot=a]"), { opacity: 0 });
        gsap.set(q("[data-shot=b]"), { opacity: 0 });
        gsap.set(q("[data-headlight]"), { scale: 0.05, opacity: 0 });
        gsap.set(q("[data-train]"), { x: () => window.innerWidth * 1.05 });
        gsap.set(q("[data-flash]"), { opacity: 0 });
        gsap.set(q("[data-caption]"), { opacity: 0, y: 10 });

        const tl = gsap.timeline({ onComplete: () => setPhase((p) => (p === "scene" ? "title" : p)) });
        // Fluorescent tubes stutter on.
        tl.to(q("[data-shot=a]"), { opacity: 0.55, duration: 0.06 }, 0.1)
          .to(q("[data-shot=a]"), { opacity: 0.08, duration: 0.05 }, 0.2)
          .to(q("[data-shot=a]"), { opacity: 0.8, duration: 0.05 }, 0.38)
          .to(q("[data-shot=a]"), { opacity: 0.3, duration: 0.04 }, 0.46)
          .to(q("[data-shot=a]"), { opacity: 1, duration: 0.2 }, 0.56);
        // Camera: slow dolly into the tunnel.
        tl.fromTo(q("[data-cam]"), { scale: 1.06 }, { scale: 1.32, duration: 3.2, ease: "sine.inOut" }, 0.3);
        tl.to(q("[data-caption]"), { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.7);
        // Headlight grows out of the dark.
        tl.to(q("[data-headlight]"), { opacity: 1, scale: 1, duration: 1.55, ease: "power2.in" }, 1.0);
        tl.to(q("[data-flash]"), { opacity: 0.55, duration: 0.25, ease: "power2.in" }, 2.35);
        // The train tears past.
        tl.to(q("[data-train]"), { x: () => -(root.current?.querySelector<HTMLElement>("[data-train]")?.offsetWidth ?? 4000), duration: 0.75, ease: "none" }, 2.55);
        tl.to(q("[data-headlight]"), { opacity: 0, duration: 0.15 }, 2.6);
        tl.to(q("[data-flash]"), { opacity: 0, duration: 0.3 }, 2.6);
        tl.to(q("[data-shake]"), { x: "random(-10,10)", y: "random(-6,6)", duration: 0.04, repeat: 15, yoyo: true, ease: "none" }, 2.55);
        tl.set(q("[data-shake]"), { x: 0, y: 0 });
        // Cut to the mosaic — 22 SIDE ST.
        tl.set(q("[data-shot=b]"), { opacity: 1 }, 3.25);
        tl.fromTo(q("[data-shot=b] img"), { scale: 1.45 }, { scale: 1.2, duration: 0.85, ease: "power2.out" }, 3.25);
        tl.set(q("[data-shot=b]"), { opacity: 0 }, 4.05);
        tl.set(q("[data-shot=a]"), { opacity: 0.32 }, 4.05);
        tl.set(q("[data-caption]"), { opacity: 0 }, 4.05);
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

  const finish = useCallback(() => {
    setPhase((p) => (p === "doors" || p === "done" ? p : "doors"));
    audio.current?.chime();
    // Let the hero start its entrance while the doors slide open.
    markIntroDone();
  }, []);

  useEffect(() => {
    if (phase === "done" || phase === "doors") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      if (e.key === "Enter" && phase === "title") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finish]);

  const complete = () => {
    try {
      window.sessionStorage.setItem(INTRO_STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    document.documentElement.setAttribute("data-intro", "seen");
    if (locked.current) lock(false);
    locked.current = false;
    audio.current?.stop(1.2);
    setPhase("done");
    window.dispatchEvent(new Event(INTRO_DONE_EVENT));
  };

  const toggleSound = () => {
    if (sound) {
      audio.current?.stop();
      audio.current = null;
      setSound(false);
      return;
    }
    const a = new StationAudio();
    a.start(phase === "scene" ? (performance.now() - t0.current) / 1000 : 99, { titleAt: TITLE_AT });
    audio.current = a;
    setSound(true);
  };

  if (phase === "done") return null;
  const doors = phase === "doors";

  return (
    <div
      ref={root}
      data-intro-overlay
      role="dialog"
      aria-modal="true"
      aria-label="22 Side Street — intro"
      className={`fixed inset-0 z-[85] overflow-hidden text-dirty ${doors ? "" : "bg-obsidian"}`}
    >
      {!doors && (
        <div data-shake className="absolute inset-0">
          {/* SHOT A — the platform */}
          <div data-shot="a" className={`absolute inset-0 ${reduce ? "opacity-30" : "opacity-0"}`}>
            <div data-cam className="absolute inset-0 origin-[50%_47%]">
              <Image src={media.platform.url} alt="" fill priority sizes="100vw" className="object-cover object-[50%_47%]" />
              <div
                data-headlight
                aria-hidden
                className="absolute left-1/2 top-[47%] size-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(232,229,223,0.85) 8%, rgba(232,229,223,0.25) 30%, rgba(232,229,223,0) 65%)",
                  opacity: 0,
                }}
              />
            </div>
          </div>

          {/* The train */}
          <div data-train aria-hidden className="absolute left-0 top-[16%] flex h-[66%] w-max will-change-transform" style={{ transform: "translateX(110vw)" }}>
            {[0, 1].map((i) => (
              <Image
                key={i}
                src={overlays.train.url}
                alt=""
                width={overlays.train.width}
                height={overlays.train.height}
                priority
                className="h-full w-auto max-w-none"
              />
            ))}
          </div>

          {/* SHOT B — the mosaic */}
          <div data-shot="b" className="absolute inset-0 opacity-0">
            <Image src={media.tiles.url} alt="" fill sizes="100vw" className="object-cover" />
          </div>

          <div data-flash aria-hidden className="absolute inset-0 bg-dirty opacity-0 mix-blend-overlay" />
          <div aria-hidden className="scanlines absolute inset-0" />
        </div>
      )}

      {/* HUD */}
      {!doors && (
        <>
          <div className="label pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-8">
            <span className="flex items-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-blood-bright" /> REC
            </span>
            <span className="hidden items-center gap-2 sm:flex">
              <LineBullet size="xs" /> {site.station}
            </span>
          </div>
          <p data-caption className="label pointer-events-none absolute bottom-20 left-4 flex items-center gap-2 md:bottom-10 md:left-8">
            <LineBullet size="xs" /> {arrival.caption}
          </p>
        </>
      )}

      {/* Title stage */}
      <AnimatePresence>
        {phase === "title" && (
          <motion.div
            key="title"
            className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* hanging station sign */}
            <motion.div
              className="absolute left-1/2 top-[9%] -translate-x-1/2 md:top-[7%]"
              initial={reduce ? { opacity: 0 } : { y: "-160%", rotate: -4 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              transition={reduce ? { duration: 0.3 } : { type: "spring", stiffness: 140, damping: 11 }}
            >
              <div aria-hidden className="absolute -top-[40vh] left-[18%] h-[40vh] w-[3px] bg-concrete/60" />
              <div aria-hidden className="absolute -top-[40vh] right-[18%] h-[40vh] w-[3px] bg-concrete/60" />
              <div className="md:hidden">
                <StationSign name={site.station} direction={arrival.direction} size="md" />
              </div>
              <div className="max-md:hidden">
                <StationSign name={site.station} direction={arrival.direction} size="lg" />
              </div>
            </motion.div>

            <div className="mt-[22vh] md:mt-[16vh]">
              <motion.div
                initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                transition={{ duration: reduce ? 0.3 : 0.9, ease: [0.76, 0, 0.24, 1], delay: reduce ? 0 : 0.35 }}
              >
                <Logo className="text-[clamp(4.6rem,22vw,17rem)]" />
              </motion.div>
              <h1 className="font-display mt-3 text-[clamp(1.8rem,5vw,3.6rem)] leading-[0.95]">
                {["No rules.", "Just attitude."].map((l, i) => (
                  <span key={l} className="block overflow-hidden">
                    <motion.span
                      className={`block ${i === 1 ? "text-outline-dirty" : ""}`}
                      initial={reduce ? { opacity: 0 } : { y: "105%" }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, ease: EASE_OUT, delay: reduce ? 0 : 0.7 + i * 0.12 }}
                    >
                      {l}
                    </motion.span>
                  </span>
                ))}
              </h1>
              <motion.div
                className="mt-8 flex justify-center md:mt-10"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 1.05, duration: 0.6, ease: EASE_OUT }}
              >
                <Magnetic strength={0.4}>
                  <button
                    type="button"
                    onClick={finish}
                    autoFocus
                    className="group flex items-center gap-4 bg-blood px-9 py-5 font-mono text-xs uppercase tracking-[0.3em] text-dirty shadow-[6px_6px_0_#e8e5df] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#e8e5df] active:translate-y-1 active:shadow-[2px_2px_0_#e8e5df] md:px-12 md:py-6 md:text-sm"
                  >
                    {arrival.cta}
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </button>
                </Magnetic>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      {!doors && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-end gap-2 p-4 md:p-8">
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={sound}
            className="label flex items-center gap-2 border border-dirty/30 bg-obsidian/60 px-3 py-2 backdrop-blur-sm transition-colors hover:bg-dirty hover:text-obsidian"
          >
            {sound ? <Volume2 className="size-4" strokeWidth={1.5} /> : <VolumeX className="size-4" strokeWidth={1.5} />}
            {sound ? arrival.soundOn : arrival.soundOff}
          </button>
        </div>
      )}
      {!doors && (
        <button
          type="button"
          onClick={finish}
          className="label absolute right-4 top-12 z-10 border border-dirty/30 bg-obsidian/60 px-3 py-2 text-dirty/85 backdrop-blur-sm transition-colors hover:bg-dirty hover:text-obsidian md:right-8 md:top-16"
        >
          {arrival.skip} →
        </button>
      )}

      {/* Exit: the doors slide open onto the site */}
      {doors && (
        <>
          {(["left", "right"] as const).map((side) => (
            <motion.div
              key={side}
              aria-hidden
              className={`absolute inset-y-0 w-1/2 overflow-hidden bg-gradient-to-b from-[#2a2928] via-[#1d1c1b] to-[#151413] ${side === "left" ? "left-0" : "right-0"}`}
              initial={{ x: 0 }}
              animate={{ x: side === "left" ? "-101%" : "101%" }}
              transition={{ duration: reduce ? 0.3 : 0.95, ease: [0.65, 0, 0.35, 1], delay: reduce ? 0 : 0.35 }}
              onAnimationComplete={side === "left" ? complete : undefined}
            >
              <div className={`absolute inset-y-0 w-3 bg-obsidian ${side === "left" ? "right-0" : "left-0"}`} />
              <div className={`absolute top-[14%] h-[34%] w-[56%] rounded-md border-4 border-[#3a3938] bg-obsidian/70 ${side === "left" ? "right-[14%]" : "left-[14%]"}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-dirty/10 via-transparent to-transparent" />
              </div>
              <div className={`absolute bottom-[30%] flex items-center gap-3 ${side === "left" ? "right-[14%]" : "left-[14%]"}`}>
                <LineBullet size="md" />
                <span className="label text-dirty/70">{side === "left" ? site.station : "Doors opening"}</span>
              </div>
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}

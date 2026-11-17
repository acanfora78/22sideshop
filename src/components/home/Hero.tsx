"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { media } from "@/content/media";
import { home, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { Marquee } from "@/components/motion/Marquee";
import { EASE_OUT } from "@/components/motion/Reveal";
import { useIntroDone } from "./useIntroDone";
import { Sticker } from "@/components/ui/Sticker";

gsap.registerPlugin(ScrollTrigger);

function Timecode() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setT((v) => v + 1), 1000 / 12);
    return () => window.clearInterval(id);
  }, []);
  const s = Math.floor(t / 24);
  const f = t % 24;
  const mm = String(Math.floor(s / 60) % 60).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return (
    <span className="tabular-nums">
      02:{mm}:{ss}:{String(f).padStart(2, "0")}
    </span>
  );
}

export function Hero() {
  const ready = useIntroDone();
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const imgWrap = useRef<HTMLDivElement>(null);
  const l1 = useRef<HTMLDivElement>(null);
  const l2 = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const { hero } = home;

  // Scroll choreography: lines split apart, image pushes in and darkens.
  useEffect(() => {
    if (reduce || !root.current) return;
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(imgWrap.current, { scale: 1.18, yPercent: 8, ease: "none", scrollTrigger: st });
      gsap.to(l1.current, { xPercent: -18, ease: "none", scrollTrigger: st });
      gsap.to(l2.current, { xPercent: 14, ease: "none", scrollTrigger: st });
      gsap.to(shade.current, { opacity: 0.85, ease: "none", scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  // Pointer parallax on fine pointers.
  useEffect(() => {
    if (reduce || !root.current || !window.matchMedia("(pointer: fine)").matches) return;
    const el = root.current;
    const xTo = gsap.quickTo(el, "--px", { duration: 0.8, ease: "power3" });
    const yTo = gsap.quickTo(el, "--py", { duration: 0.8, ease: "power3" });
    const onMove = (e: PointerEvent) => {
      xTo((e.clientX / window.innerWidth - 0.5) * 2);
      yTo((e.clientY / window.innerHeight - 0.5) * 2);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [reduce]);

  const enter = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 30 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.1, ease: EASE_OUT, delay },
  });

  return (
    <section
      ref={root}
      className="relative h-[100svh] min-h-[600px] overflow-hidden"
      style={{ ["--px" as string]: 0, ["--py" as string]: 0 }}
      aria-label="22SIDE — No rules. Just attitude."
    >
      {/* Background image */}
      <div ref={imgWrap} className="absolute inset-0 will-change-transform">
        <motion.div
          className="absolute inset-[-3%]"
          initial={{ scale: reduce ? 1 : 1.25, opacity: 0 }}
          animate={ready ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 2.2, ease: EASE_OUT }}
          style={{ translate: "calc(var(--px) * -10px) calc(var(--py) * -8px)" }}
        >
          <Image
            src={media.streetFigure.url}
            alt={media.streetFigure.altText}
            fill
            priority
            sizes="100vw"
            className="hidden object-cover md:block"
          />
          <Image
            src={media.streetPortrait.url}
            alt={media.streetPortrait.altText}
            fill
            priority
            sizes="100vw"
            className="object-cover md:hidden"
          />
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-transparent to-obsidian" />
      <div ref={shade} className="absolute inset-0 bg-obsidian opacity-0" />

      {/* Editorial HUD */}
      <div className="px-gutter label pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+0.75rem)] flex items-start justify-between text-dirty/80">
        <motion.div {...enter(0.2)} className="space-y-1">
          <p>
            <span className="text-blood">●</span> {hero.issue}
          </p>
          <p className="text-concrete">40.6782° N — 73.9442° W</p>
        </motion.div>
        <motion.div {...enter(0.3)} className="space-y-1 text-right">
          <p>
            Reel 22 / <Timecode />
          </p>
          <p className="text-concrete">{site.positioning}</p>
        </motion.div>
      </div>

      <motion.p
        {...enter(0.5)}
        className="label pointer-events-none absolute right-[var(--gutter)] top-1/2 hidden -translate-y-1/2 text-concrete [writing-mode:vertical-rl] xl:block"
      >
        Underground NYC — 1990s reimagined
      </motion.p>

      {/* Draggable sticker bomb */}
      {ready && (
        <div className="pointer-events-none absolute inset-0 z-10">
          <Sticker label="Fresh drop" tone="red" rotate={-10} delay={0.9} draggable className="absolute right-[6%] top-[24%] md:right-[16%] md:top-[26%]" />
          <Sticker label="22" tone="white" rotate={8} delay={1.05} big draggable className="absolute right-[10%] top-[34%] md:right-[30%] md:top-[40%]" />
          <Sticker label="Open late" tone="black" rotate={6} delay={1.2} draggable className="absolute right-[8%] top-[46%] max-md:!hidden" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="font-marker pointer-events-none absolute right-[18%] top-[19%] hidden -rotate-6 text-lg text-dirty/80 md:block"
          >
            drag us ↓
          </motion.p>
        </div>
      )}

      {/* Headline */}
      <div className="absolute inset-x-0 bottom-[7.5rem] md:bottom-28">
        <h1 className="font-display px-gutter whitespace-nowrap text-[clamp(3.4rem,12vw,15rem)] leading-[0.86]" style={{ translate: "calc(var(--px) * 12px) 0" }}>
          <div ref={l1} className="overflow-hidden">
            <motion.span
              className="block"
              initial={reduce ? { opacity: 0 } : { y: "105%" }}
              animate={ready ? { y: "0%", opacity: 1 } : undefined}
              transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.25 }}
            >
              {hero.lineOne}
            </motion.span>
          </div>
          <div ref={l2} className="overflow-hidden md:pl-[7vw]">
            <motion.span
              className="text-outline-dirty block"
              initial={reduce ? { opacity: 0 } : { y: "105%" }}
              animate={ready ? { y: "0%", opacity: 1 } : undefined}
              transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.38 }}
            >
              {hero.lineTwo}
            </motion.span>
          </div>
        </h1>

        <div className="px-gutter mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:items-end md:justify-between">
          <motion.p {...enter(0.7)} className="max-w-sm text-sm leading-relaxed text-dirty/80 md:text-base">
            {hero.sub}
          </motion.p>
          <motion.div {...enter(0.8)} className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <ButtonLink href={hero.primaryCta.href} variant="solid">
                {hero.primaryCta.label}
              </ButtonLink>
            </Magnetic>
            <a href={hero.secondaryCta.href} className="label group flex items-center gap-2 px-4 py-4 text-dirty">
              <span className="link-underline">{hero.secondaryCta.label}</span>
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-1" strokeWidth={1.5} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom marquee */}
      <motion.div {...enter(1)} className="absolute inset-x-0 bottom-0 border-t border-dirty/15 bg-obsidian/60 backdrop-blur-sm">
        <Marquee items={hero.marquee} className="label py-3 text-[0.7rem] text-dirty/80" speed={32} />
      </motion.div>
    </section>
  );
}

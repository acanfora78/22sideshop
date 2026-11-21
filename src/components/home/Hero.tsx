"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { movement } from "@/content/movement";
import { Marquee } from "@/components/motion/Marquee";
import { home, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { EASE_OUT } from "@/components/motion/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { LineBullet, PlatformTag, StationSign } from "@/components/transit/Transit";
import { useIntroDone } from "./useIntroDone";

gsap.registerPlugin(ScrollTrigger);

function Timecode() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setT((v) => v + 1), 1000 / 12);
    return () => window.clearInterval(id);
  }, []);
  const s = Math.floor(t / 24);
  return (
    <span className="tabular-nums">
      02:{String(Math.floor(s / 60) % 60).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}:{String(t % 24).padStart(2, "0")}
    </span>
  );
}

/**
 * HERO — THE STREET IS OURS.
 * Campaign composition: night avenue, editorial captions, station signage,
 * and a moving band of giant 22s across the bottom of the frame.
 */
export function Hero() {
  const ready = useIntroDone();
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const hero = { ...home.hero, ...movement.hero };

  useEffect(() => {
    if (reduce || !root.current) return;
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(img.current, { scale: 1.15, yPercent: 10, ease: "none", scrollTrigger: st });
      gsap.to(mark.current, { yPercent: -35, ease: "none", scrollTrigger: st });
      gsap.to(title.current, { yPercent: -40, opacity: 0.2, ease: "none", scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  const enter = (delay: number, y = 30) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.1, ease: EASE_OUT, delay },
  });

  const words = hero.title.split(" ");

  return (
    <section id="arrival" ref={root} className="relative isolate h-[100svh] min-h-[600px] overflow-hidden [--mark-h:4.5rem] md:[--mark-h:min(9vw,15svh)]" aria-label={hero.title}>
      <div ref={img} className="absolute inset-0 -z-10 will-change-transform">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: reduce ? 1 : 1.2, opacity: 0 }}
          animate={ready ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 2.2, ease: EASE_OUT }}
        >
          <Image src={hero.image} alt={hero.imageAlt} fill priority sizes="100vw" className="object-cover object-[50%_30%]" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/10 to-obsidian/70" />
      </div>

      {/* Editorial HUD */}
      <div className="px-gutter label pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+0.75rem)] flex items-start justify-between gap-4">
        <motion.div {...enter(0.15, 12)} className="space-y-2">
          <StationSign name={site.station} size="sm" />
          <p className="text-dirty/75">
            <span className="text-blood-bright">●</span> {hero.issue}
          </p>
        </motion.div>
        <motion.div {...enter(0.25, 12)} className="flex flex-col items-end gap-2 text-right">
          <PlatformTag>
            <LineBullet size="xs" /> {hero.platform}
          </PlatformTag>
          <p className="hidden text-dirty/75 sm:block">
            Reel 22 / <Timecode />
          </p>
          <p className="hidden text-concrete sm:block">40.7536° N — 14.5286° E</p>
        </motion.div>
      </div>

      {/* Headline */}
      <div ref={title} className="px-gutter absolute inset-x-0 bottom-[calc(var(--mark-h)+1rem)] top-[calc(var(--header-h)+6.5rem)] flex flex-col justify-center">
        <h1 className="font-display text-[clamp(3.4rem,min(9vw,14svh),10rem)] leading-[0.86]">
          {words.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.04em]">
              <motion.span
                className={`block ${i === 1 ? "text-blood-bright" : ""}`}
                initial={reduce ? { opacity: 0 } : { y: "105%" }}
                animate={ready ? { y: "0%", opacity: 1 } : undefined}
                transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.3 + i * 0.12 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p {...enter(0.75)} className="mt-5 max-w-md text-sm leading-relaxed text-dirty/85 md:mt-7 md:text-base">
          {hero.sub}
        </motion.p>
        <motion.div {...enter(0.85)} className="mt-6 flex flex-wrap items-center gap-3 md:mt-8">
          <Magnetic>
            <ButtonLink href={hero.primaryCta.href} variant="red">
              {hero.primaryCta.label}
            </ButtonLink>
          </Magnetic>
          <a href={hero.secondaryCta.href} className="label group flex items-center gap-2 px-3 py-4 text-dirty">
            <span className="link-underline">{hero.secondaryCta.label}</span>
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-1" strokeWidth={1.5} />
          </a>
        </motion.div>
      </div>

      {/* Sticker bomb (draggable) */}
      {ready && (
        <div className="pointer-events-none absolute inset-0 z-10">
          <Sticker label="Fresh drop" tone="red" rotate={-10} delay={1.1} draggable className="absolute right-[6%] top-[22%] md:right-[12%] md:top-[30%]" />
        </div>
      )}

      {/* Figure caption */}
      <motion.p {...enter(1.1, 10)} className="label pointer-events-none absolute bottom-[calc(var(--mark-h)+0.75rem)] right-[var(--gutter)] hidden text-dirty/60 md:block">
        Fig. 07 — The Movement, 22 Side St.
      </motion.p>

      {/* Moving 22 band */}
      <div ref={mark} className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[var(--mark-h)] items-start justify-center overflow-hidden" aria-hidden>
        <motion.div
          initial={reduce ? { opacity: 0 } : { y: "100%" }}
          animate={ready ? { y: "0%", opacity: 1 } : undefined}
          transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.4 }}
          className="w-full border-t border-dirty/20 bg-obsidian/70 backdrop-blur-sm"
        >
          <Marquee
            items={["22", "The movement", "22", "No rules. Just attitude.", "22", "Line 22"]}
            separator="●"
            speed={30}
            className="font-display flex h-[var(--mark-h)] items-center text-[calc(var(--mark-h)*0.72)] leading-none"
          />
        </motion.div>
      </div>
    </section>
  );
}

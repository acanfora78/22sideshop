"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { media, overlays, type MediaKey } from "@/content/media";
import { home } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ImageReveal, Reveal, SplitText } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { LineBullet, RouteStrip } from "@/components/transit/Transit";
import { cn } from "@/lib/format";

gsap.registerPlugin(ScrollTrigger);

type Chapter = (typeof home.underground.chapters)[number];

function ChapterHead({ c, className, light = false }: { c: Chapter; className?: string; light?: boolean }) {
  return (
    <div className={className}>
      <p className={cn("label flex items-center gap-2", light ? "text-obsidian/70" : "text-dirty/70")}>
        <LineBullet size="xs" label={c.n} /> Stop {c.n} — Line 22
      </p>
      <SplitText as="h3" text={c.title} className="font-display mt-4 block text-[clamp(3.2rem,9vw,9.5rem)]" />
    </div>
  );
}

function Caption({ c, className }: { c: Chapter; className?: string }) {
  return <p className={cn("label text-dirty/60", className)}>Fig. {c.n} — {c.caption}</p>;
}

/** 01 — THE BLOCK: full-bleed street with the title set into the image. */
function TheBlock({ c }: { c: Chapter }) {
  const m = media[c.media as MediaKey];
  return (
    <article className="relative isolate" aria-labelledby={`ch-${c.n}`}>
      <Parallax className="h-[92svh] min-h-[560px]" speed={18}>
        <Image src={m.url} alt={m.altText} fill sizes="100vw" className="object-cover" />
      </Parallax>
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-obsidian/50" />
      <div className="px-gutter absolute inset-x-0 bottom-0 grid gap-6 pb-12 md:grid-cols-12 md:items-end md:pb-16">
        <ChapterHead c={c} className="md:col-span-8" />
        <Reveal className="md:col-span-4">
          <p className="text-base leading-relaxed text-dirty/85 md:text-lg">{c.text}</p>
          <Caption c={c} className="mt-4" />
        </Reveal>
      </div>
      <span id={`ch-${c.n}`} className="sr-only">
        {c.title}
      </span>
    </article>
  );
}

/** 02 — THE TRAIN: the train crosses the frame as you scroll. */
function TheTrain({ c }: { c: Chapter }) {
  const m = media[c.media as MediaKey];
  const wrap = useRef<HTMLDivElement>(null);
  const train = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!wrap.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(train.current, { xPercent: 10 }, { xPercent: -70, ease: "none", scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, wrap);
    return () => ctx.revert();
  }, []);
  return (
    <article ref={wrap} className="relative overflow-hidden py-20 md:py-32" aria-label={c.title}>
      <div className="px-gutter grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <ChapterHead c={c} />
          <Reveal>
            <p className="mt-6 max-w-md text-base leading-relaxed text-dirty/80 md:text-lg">{c.text}</p>
          </Reveal>
        </div>
        <div className="md:col-span-7">
          <ImageReveal direction="left" className="relative aspect-[16/10] overflow-hidden">
            <Image src={m.url} alt={m.altText} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
          </ImageReveal>
          <Caption c={c} className="mt-3" />
        </div>
      </div>
      <div aria-hidden className="pointer-events-none relative mt-14 h-[22vw] max-h-64 min-h-28 md:mt-20">
        <div className="absolute inset-x-0 top-1/2 h-px bg-dirty/15" />
        <div ref={train} className="absolute inset-y-0 left-0 flex w-max">
          {[0, 1].map((i) => (
            <Image key={i} src={overlays.train.url} alt="" width={overlays.train.width} height={overlays.train.height} className="h-full w-auto max-w-none" />
          ))}
        </div>
      </div>
    </article>
  );
}

/** 03 — THE ROOFTOPS: magazine collage, two frames overlapping. */
function TheRooftops({ c }: { c: Chapter }) {
  const m = media[c.media as MediaKey];
  return (
    <article className="relative bg-dirty py-20 text-obsidian md:py-32" aria-label={c.title}>
      <div className="px-gutter grid gap-10 md:grid-cols-12">
        <div className="relative md:col-span-7">
          <ImageReveal className="relative aspect-[4/3] overflow-hidden">
            <Image src={m.url} alt={m.altText} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
          </ImageReveal>
          <ImageReveal direction="right" delay={0.25} className="absolute -bottom-10 right-4 aspect-[3/4] w-[38%] overflow-hidden border-8 border-dirty md:-right-16">
            <Image src={media.fireEscape.url} alt={media.fireEscape.altText} fill sizes="25vw" className="object-cover" />
          </ImageReveal>
        </div>
        <div className="flex flex-col justify-end md:col-span-4 md:col-start-9">
          <ChapterHead c={c} light />
          <Reveal>
            <p className="mt-6 text-base leading-relaxed text-obsidian/80 md:text-lg">{c.text}</p>
            <p className="label mt-4 text-obsidian/60">Fig. {c.n} — {c.caption}</p>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

/** 04 — THE SOUND: a 22SIDE record spinning at 33⅓ next to a live EQ. */
function TheSound({ c }: { c: Chapter }) {
  const m = media[c.media as MediaKey];
  return (
    <article className="relative isolate overflow-hidden py-20 md:py-32" aria-label={c.title}>
      <Image src={m.url} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-25" />
      <div className="px-gutter grid items-center gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <ChapterHead c={c} />
          <Reveal>
            <p className="mt-6 max-w-md text-base leading-relaxed text-dirty/80 md:text-lg">{c.text}</p>
          </Reveal>
          <div aria-hidden className="mt-8 flex h-16 items-end gap-1.5">
            {Array.from({ length: 18 }, (_, i) => (
              <span
                key={i}
                className="eq-bar w-2 bg-blood-bright"
                style={{ animationDelay: `${(i * 137) % 900}ms`, animationDuration: `${700 + ((i * 89) % 600)}ms` }}
              />
            ))}
          </div>
          <Caption c={c} className="mt-4" />
        </div>
        <div className="relative md:col-span-7">
          <div className="relative mx-auto aspect-square w-[min(88vw,640px)]">
            <div className="absolute inset-0 rounded-full shadow-[0_40px_120px_rgba(0,0,0,0.8)]" />
            <Image src={overlays.vinyl.url} alt="Disco in vinile 22SIDE, Line 22 Sessions" fill sizes="(min-width: 768px) 640px, 88vw" className="spin-33 object-contain" />
          </div>
        </div>
      </div>
    </article>
  );
}

/** 05 — THE CULTURE: the mosaic, the court, and the line that sums it up. */
function TheCulture({ c, quote }: { c: Chapter; quote: string }) {
  const m = media[c.media as MediaKey];
  return (
    <article className="relative" aria-label={c.title}>
      <div className="relative">
        <Parallax className="h-[75svh] min-h-[460px]" speed={20}>
          <Image src={m.url} alt={m.altText} fill sizes="100vw" className="object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-obsidian/45" />
        <div className="px-gutter absolute inset-0 flex flex-col justify-center">
          <ChapterHead c={c} />
        </div>
      </div>
      <div className="px-gutter grid gap-10 py-16 md:grid-cols-12 md:py-24">
        <Reveal className="md:col-span-4">
          <p className="text-base leading-relaxed text-dirty/80 md:text-lg">{c.text}</p>
          <Caption c={c} className="mt-4" />
        </Reveal>
        <div className="md:col-span-7 md:col-start-6">
          <p className="font-serif text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.02] italic">
            <span className="text-blood-bright">“</span>
            {quote}
            <span className="text-blood-bright">”</span>
          </p>
          <ImageReveal className="relative mt-10 aspect-[16/9] overflow-hidden">
            <Image src={media.chainlink.url} alt={media.chainlink.altText} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
          </ImageReveal>
        </div>
      </div>
    </article>
  );
}

/**
 * THE UNDERGROUND — five stops along Line 22, each with its own composition.
 */
export function UndergroundCulture() {
  const { underground: u } = home;
  const [block, train, roofs, sound, culture] = u.chapters;
  return (
    <section id="underground" className="relative bg-asphalt" aria-labelledby="underground-title">
      <div className="px-gutter pb-16 pt-24 md:pb-24 md:pt-36">
        <SectionLabel index={u.index} label={u.label} />
        <div className="mt-12 grid gap-10 md:mt-20 md:grid-cols-12">
          <h2 id="underground-title" className="md:col-span-8">
            <SplitText text={u.title} className="font-display text-huge block" />
          </h2>
          <Reveal className="md:col-span-4 md:self-end">
            <p className="text-base leading-relaxed text-dirty/80 md:text-lg">{u.intro}</p>
          </Reveal>
        </div>
        <div className="no-scrollbar -mx-[var(--gutter)] mt-14 overflow-x-auto px-[var(--gutter)] md:mt-20">
          <RouteStrip stops={u.chapters.map((c) => c.title)} className="min-w-[560px]" />
        </div>
      </div>
      <TheBlock c={block} />
      <TheTrain c={train} />
      <TheRooftops c={roofs} />
      <TheSound c={sound} />
      <TheCulture c={culture} quote={u.quote} />
    </section>
  );
}

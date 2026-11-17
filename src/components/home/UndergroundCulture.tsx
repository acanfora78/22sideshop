"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { media, type MediaKey } from "@/content/media";
import { home } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ImageReveal, Reveal, SplitText } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { cn } from "@/lib/format";

gsap.registerPlugin(ScrollTrigger);

// Explicit class strings so Tailwind can detect them.
const CARD_STYLE = [
  { fig: "lg:self-start", box: "lg:w-[42vw] lg:aspect-[4/3]" },
  { fig: "lg:self-end", box: "lg:w-[26vw] lg:aspect-[3/4]" },
  { fig: "lg:self-center", box: "lg:w-[38vw] lg:aspect-[16/10]" },
  { fig: "lg:self-start", box: "lg:w-[24vw] lg:aspect-[3/4]" },
  { fig: "lg:self-end", box: "lg:w-[36vw] lg:aspect-[4/3]" },
];

export function UndergroundCulture() {
  const { culture } = home;
  const pinWrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  // Desktop: pin the section and translate the strip horizontally.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current;
      const wrap = pinWrap.current;
      if (!el || !wrap) return;
      const distance = () => el.scrollWidth - window.innerWidth;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      // Counter-parallax on images within the strip.
      el.querySelectorAll<HTMLElement>("[data-strip-img]").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -8 },
          { xPercent: 8, ease: "none", scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="culture" className="relative bg-asphalt" aria-labelledby="culture-title">
      {/* Magazine masthead */}
      <div className="px-gutter pb-16 pt-24 md:pb-24 md:pt-36">
        <SectionLabel index={culture.index} label={culture.label} />
        <div className="mt-12 grid gap-10 md:mt-20 md:grid-cols-12">
          <h2 id="culture-title" className="md:col-span-8">
            <SplitText text="Field notes" className="font-display text-huge block" />
            <span className="mt-2 block font-serif text-[clamp(2.2rem,5.5vw,6rem)] leading-none italic text-dirty/85">from the underground</span>
          </h2>
          <div className="label flex flex-col justify-end gap-2 text-concrete md:col-span-3 md:col-start-10">
            <span>Vol. 22 — No. 05</span>
            <span>Photo essay / art-direction frames</span>
            <span className="text-blood-bright">Read → scroll</span>
          </div>
        </div>
        <div className="mt-14 grid gap-8 border-t border-dirty/15 pt-8 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="text-lg leading-relaxed text-dirty/85 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[4.6rem] first-letter:leading-[0.8] first-letter:text-blood-bright">
              {culture.intro}
            </p>
          </Reveal>
          {culture.columns.map((c, i) => (
            <Reveal key={i} delay={0.1 * (i + 1)} className={cn("text-sm leading-relaxed text-dirty/65 md:col-span-3", i === 0 && "md:col-start-7")}>
              <p>{c}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Horizontal strip (pinned on desktop, native swipe on mobile) */}
      <div ref={pinWrap} className="relative overflow-hidden lg:h-[100svh]">
        <div className="label px-gutter absolute left-0 top-6 z-10 hidden text-concrete lg:block">Contact sheet — 05 frames</div>
        <div
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-6 lg:h-full lg:snap-none lg:items-stretch lg:gap-[4vw] lg:overflow-visible lg:py-[12vh]"
        >
          {culture.notes.map((n, i) => {
            const m = media[n.media as MediaKey];
            return (
              <figure key={n.fig} className={cn("flex w-[82vw] shrink-0 snap-center flex-col lg:w-auto", CARD_STYLE[i].fig)}>
                <div className={cn("relative aspect-[4/5] overflow-hidden bg-obsidian", CARD_STYLE[i].box)}>
                  <div data-strip-img className="absolute inset-[-10%]">
                    <Image src={m.url} alt={m.altText} fill sizes="(min-width: 1024px) 42vw, 82vw" className="object-cover" />
                  </div>
                </div>
                <figcaption className="mt-3 flex gap-4 text-sm text-dirty/70">
                  <span className="label shrink-0 text-blood-bright">{n.fig}</span>
                  <span className="max-w-xs">{n.caption}</span>
                </figcaption>
              </figure>
            );
          })}
          <div className="flex w-[70vw] shrink-0 snap-center items-center lg:w-[34vw]">
            <p className="font-serif text-[clamp(2rem,3.6vw,3.6rem)] leading-[1.05] italic">
              <span className="text-blood-bright">&ldquo;</span>
              {culture.quote}
              <span className="text-blood-bright">&rdquo;</span>
            </p>
          </div>
        </div>
      </div>

      {/* Full-bleed mosaic with overlaid type */}
      <div className="relative">
        <Parallax className="h-[70vh] min-h-[420px]" speed={22}>
          <Image src={media.tiles.url} alt={media.tiles.altText} fill sizes="100vw" className="object-cover" />
        </Parallax>
        <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-[var(--gutter)]">
          <ImageReveal direction="left" className="bg-obsidian px-4 py-3">
            <p className="label">Next stop — 22 Side St.</p>
          </ImageReveal>
          <p className="label hidden text-dirty/70 md:block">Fig. 06 — Mosaic, art-direction frame</p>
        </div>
      </div>
    </section>
  );
}

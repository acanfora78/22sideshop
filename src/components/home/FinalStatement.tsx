"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { media } from "@/content/media";
import { home, site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { SplitText } from "@/components/motion/Reveal";
import { Scribble } from "@/components/ui/Scribble";

gsap.registerPlugin(ScrollTrigger);

export function FinalStatement() {
  const { final } = home;
  const logo = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);

  // The closing wordmark rises and tightens as it enters.
  useEffect(() => {
    if (!logo.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logo.current,
        { yPercent: 40, letterSpacing: "0.08em", opacity: 0.2 },
        {
          yPercent: 0,
          letterSpacing: "-0.02em",
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: logo.current, start: "top bottom", end: "bottom 85%", scrub: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative isolate overflow-hidden pt-32 md:pt-48" aria-label="Chiusura">
      <div className="absolute inset-0 -z-10">
        <Image src={media.chainlink.url} alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/60 to-obsidian" />
      </div>

      <div className="px-gutter">
        <p className="label text-concrete">
          <span className="text-blood">07</span> / Ultima parola
        </p>
        <h2 className="mt-12 md:mt-20">
          <SplitText text={final.lineOne} className="font-display text-big block text-dirty/90" />
          <span className="relative mt-2 inline-block">
            <SplitText text={final.lineTwo} className="font-display text-huge block text-blood-bright" delay={0.25} />
            <Scribble className="absolute -bottom-4 left-0 h-7 w-full" color="#e8e5df" delay={0.9} />
          </span>
        </h2>
        <div className="label mt-12 flex flex-wrap justify-between gap-4 text-concrete">
          <span>{site.slogan}</span>
          <a href={site.instagram} target="_blank" rel="noreferrer" className="link-underline text-dirty">
            Seguici {site.instagramHandle} ↗
          </a>
        </div>
      </div>

      <div ref={logo} className="mt-16 flex justify-center overflow-hidden whitespace-nowrap pb-2 md:mt-24" aria-hidden>
        <Logo className="text-[26.5vw] leading-[0.78]" />
      </div>
    </section>
  );
}

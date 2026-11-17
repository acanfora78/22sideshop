"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { media } from "@/content/media";
import { home } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ImageReveal, Reveal, SplitText } from "@/components/motion/Reveal";

gsap.registerPlugin(ScrollTrigger);

function Stamp() {
  const text = "STREETWEAR • INDIPENDENTE • 22SIDE • NYC STATE OF MIND • ";
  return (
    <svg viewBox="0 0 200 200" className="size-full animate-[spin_22s_linear_infinite] motion-reduce:animate-none" aria-hidden>
      <defs>
        <path id="stamp-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <text className="fill-dirty font-mono text-[13px] tracking-[0.18em] uppercase">
        <textPath href="#stamp-circle">{text}</textPath>
      </text>
      <text x="100" y="114" textAnchor="middle" className="fill-blood font-display text-[44px]">
        22
      </text>
    </svg>
  );
}

export function BrandStatement() {
  const { statement } = home;
  const body = useRef<HTMLParagraphElement>(null);

  // Words of the body copy "light up" as the reader scrolls through.
  useEffect(() => {
    if (!body.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const words = body.current.querySelectorAll("[data-w]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: body.current, start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden py-24 md:py-40" aria-label={statement.label}>
      <div className="px-gutter">
        <SectionLabel index={statement.index} label={statement.label} />

        <div className="relative mt-14 md:mt-24">
          <SplitText
            as="h2"
            text={statement.headline}
            className="font-display text-mega block leading-[0.88]"
            stagger={0.09}
          />
          <div className="absolute -top-10 right-0 hidden size-36 md:block lg:size-44">
            <Stamp />
          </div>
        </div>

        <div className="mt-16 grid gap-12 md:mt-28 md:grid-cols-12">
          <div className="md:col-span-4">
            <ImageReveal className="relative aspect-[3/4] overflow-hidden halftone">
              <Image src={media.fireEscape.url} alt={media.fireEscape.altText} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
            </ImageReveal>
            <p className="label mt-3 flex justify-between text-concrete">
              <span>Fig. 03 — Mattoni e ferro</span>
              <span>02:41 AM</span>
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6 md:pt-16">
            <p className="label mb-6 text-blood-bright">&ldquo;</p>
            <p ref={body} className="font-display text-[clamp(2.2rem,4.8vw,5rem)] leading-[0.95]" aria-label={statement.body}>
              {statement.body.split(" ").map((w, i) => (
                <span key={i} data-w aria-hidden className="inline">
                  {w}{" "}
                </span>
              ))}
            </p>
            <Reveal delay={0.1} className="mt-12 grid gap-6 border-t border-dirty/15 pt-6 sm:grid-cols-2">
              <p className="font-serif text-2xl italic leading-snug text-dirty/90">Una prospettiva diversa.</p>
              <p className="text-sm leading-relaxed text-dirty/65">{statement.aside}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Collection } from "@/lib/commerce/types";
import { media } from "@/content/media";
import { home } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { Parallax } from "@/components/motion/Parallax";
import { SplitText } from "@/components/motion/Reveal";

/**
 * Collection index as huge typographic rows; on desktop a preview image
 * follows the cursor while hovering a row.
 */
export function ShopTheCollection({ collections, counts }: { collections: Collection[]; counts: Record<string, number> }) {
  const { shop } = home;
  const [hover, setHover] = useState<number | null>(null);
  const area = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28 });
  const sy = useSpring(y, { stiffness: 260, damping: 28 });

  const onMove = (e: React.PointerEvent) => {
    if (!area.current || e.pointerType !== "mouse") return;
    const r = area.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="shop-title">
      <div className="absolute inset-0 -z-10">
        <Parallax className="h-full" speed={16}>
          <Image src={media.subway.url} alt="" fill sizes="100vw" className="object-cover opacity-30" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/70 to-obsidian" />
      </div>

      <div className="px-gutter py-24 md:py-36">
        <SectionLabel index={shop.index} label={shop.label} />
        <div className="mt-12 flex flex-col gap-8 md:mt-20 md:flex-row md:items-end md:justify-between">
          <h2 id="shop-title">
            <SplitText text={shop.title} className="font-display text-huge block" />
          </h2>
          <p className="label max-w-[16rem] text-concrete">Five chapters. One attitude. Hover a chapter, then step inside.</p>
        </div>

        <ul ref={area} onPointerMove={onMove} onPointerLeave={() => setHover(null)} className="relative mt-14 border-t border-dirty/20 md:mt-20">
          {collections.map((c, i) => (
            <li key={c.handle} className="border-b border-dirty/20">
              <Link
                href={c.handle === "new-arrivals" ? "/new-arrivals" : `/collections/${c.handle}`}
                onPointerEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="group relative flex items-center justify-between gap-4 py-5 md:py-7"
              >
                <span className="flex items-baseline gap-4 md:gap-8">
                  <span className="label w-6 text-blood">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[clamp(2.6rem,8vw,8.5rem)] transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-4 group-hover:text-outline-dirty">
                    {c.title}
                  </span>
                </span>
                <span className="label flex items-center gap-3 text-concrete">
                  <span className="hidden sm:inline">{c.kicker}</span>
                  <span className="text-dirty">({counts[c.handle] ?? 0})</span>
                  <ArrowUpRight className="size-5 text-dirty transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.25} />
                </span>
              </Link>
            </li>
          ))}

          <AnimatePresence>
            {hover !== null && (
              <motion.div
                key="preview"
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 z-20 hidden h-64 w-48 overflow-hidden lg:block xl:h-80 xl:w-60"
                style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
                initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={hover}
                    className="absolute inset-0"
                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                    animate={{ clipPath: "inset(0% 0 0 0)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <Image src={collections[hover].image.url} alt="" fill sizes="240px" className="object-cover" />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </ul>

        <div className="mt-16 flex justify-center md:mt-24">
          <Magnetic strength={0.35}>
            <ButtonLink href={shop.cta.href} variant="red" className="px-10 py-6 text-sm md:px-14 md:py-7">
              {shop.cta.label}
            </ButtonLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

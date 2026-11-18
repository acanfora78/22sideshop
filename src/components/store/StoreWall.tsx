"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import type { StoreWall as Wall } from "@/content/store";
import { hangingImage } from "@/content/store";
import { hangingDims } from "@/content/hanging-dims";
import { cn, formatMoney } from "@/lib/format";
import { DemoTag } from "@/components/ui/SectionLabel";
import { Reveal, SplitText } from "@/components/motion/Reveal";
import { LineBullet } from "@/components/transit/Transit";

type Kind = "top" | "pant" | "short" | "head";

function kindOf(p: Product): Kind {
  if (p.sizeGuide === "one-size") return "head";
  if (p.sizeGuide === "bottom") return p.productType.toLowerCase().includes("pantaloncini") ? "short" : "pant";
  return "top";
}

/** Garment height as a fraction of the wall height. */
const HEIGHT: Record<Kind, number> = { top: 0.5, pant: 0.6, short: 0.4, head: 0.17 };

function availability(p: Product): { label: string; tone: "ok" | "low" | "out" } {
  if (!p.availableForSale) return { label: "Esaurito", tone: "out" };
  const free = p.variants.filter((v) => v.availableForSale).length;
  if (p.variants.length > 2 && free <= 2) return { label: "Disponibilità limitata", tone: "low" };
  return { label: "Disponibile", tone: "ok" };
}

/**
 * A physical display: an empty store wall with a real rail, and the
 * collection's garments hung on it. Hover / focus / tap highlights a garment
 * (spotlight + dimming) and shows its product card; click opens the product.
 */
export function StoreWall({ wall, products, headingLevel = "h3" }: { wall: Wall; products: Product[]; headingLevel?: "h2" | "h3" }) {
  const reduce = useReducedMotion();
  const items = products.slice(0, 6);
  const [active, setActive] = useState<number | null>(null);
  const pointer = useRef<string>("mouse");
  const wasActive = useRef(false);
  const { rail } = wall;
  const aspect = wall.image.width / wall.image.height;
  const Heading = headingLevel;

  const xs = items.map((_, i) => rail.x0 + ((i + 0.5) * (rail.x1 - rail.x0)) / items.length);
  const sel = active !== null ? items[active] : null;
  const selX = active !== null ? xs[active] : 0.5;
  const selKind = sel ? kindOf(sel) : "top";
  const selY = sel ? (selKind === "head" ? 0.78 : rail.y + HEIGHT[selKind] * 0.45) : 0.5;

  const card = (p: Product, mobile = false) => {
    const a = availability(p);
    return (
      <div className={cn("w-64 border border-dirty/15 bg-obsidian/92 p-4 text-left backdrop-blur-md", mobile && "w-full")}>
        <p className="label flex items-center gap-2 text-concrete">
          {p.code} · {p.productType} {p.isDemo && <DemoTag />}
        </p>
        <p className="font-display mt-2 text-2xl leading-none text-dirty">{p.title}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-sm tabular-nums text-dirty">{formatMoney(p.priceRange.minVariantPrice)}</span>
          <span className={cn("label", a.tone === "out" ? "text-concrete" : a.tone === "low" ? "text-blood-bright" : "text-dirty/70")}>● {a.label}</span>
        </div>
        <Link href={`/products/${p.handle}`} className="label mt-4 flex items-center justify-between bg-dirty px-3 py-2.5 text-obsidian transition-colors hover:bg-blood hover:text-dirty">
          Apri il prodotto <ArrowUpRight className="size-4" strokeWidth={1.5} />
        </Link>
      </div>
    );
  };

  return (
    <section className="relative" aria-labelledby={`wall-${wall.id}`}>
      <div className="px-gutter mb-6 grid gap-4 md:mb-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="label flex items-center gap-2 text-concrete">
            <LineBullet size="xs" /> {wall.number} — The Store
          </p>
          <Heading id={`wall-${wall.id}`} className="mt-3">
            <SplitText text={wall.title} className="font-display block text-[clamp(2.8rem,7vw,7rem)]" />
          </Heading>
        </div>
        <Reveal className="md:col-span-4 md:col-start-9">
          <p className="text-sm leading-relaxed text-dirty/75 md:text-base">{wall.description}</p>
          <Link href={`/collections/${wall.collection}`} className="label link-underline mt-3 inline-block text-dirty">
            Vedi la collezione ({products.length}) →
          </Link>
        </Reveal>
      </div>

      <div className="no-scrollbar overflow-x-auto md:overflow-visible" onPointerLeave={() => pointer.current === "mouse" && setActive(null)}>
        <div className="relative w-[190vw] sm:w-[140vw] md:w-full" style={{ aspectRatio: aspect }}>
          <Image src={wall.image.url} alt={wall.image.alt} fill sizes="(min-width: 768px) 100vw, 190vw" className="object-cover" />

          {/* spotlight / dimming when a garment is picked */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
            style={{
              opacity: sel ? 1 : 0,
              background: `radial-gradient(ellipse 16% 42% at ${selX * 100}% ${selY * 100}%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 55%, rgba(8,8,8,0.62) 100%)`,
            }}
          />

          <ul aria-label={`${wall.title} — capi esposti`}>
            {items.map((p, i) => {
              const k = kindOf(p);
              const dims = hangingDims[p.handle] ?? [700, 900];
              const h = HEIGHT[k];
              const top = k === "head" ? 0.86 - h : rail.y - 0.012;
              const on = active === i;
              const dim = active !== null && !on;
              return (
                <li
                  key={p.handle}
                  className="absolute z-20"
                  style={{ left: `${xs[i] * 100}%`, top: `${top * 100}%`, height: `${h * 100}%`, aspectRatio: `${dims[0]} / ${dims[1]}`, transform: "translateX(-50%)" }}
                >
                  {k === "head" && <span aria-hidden className="absolute -bottom-[6%] left-[-20%] right-[-20%] h-[7%] bg-obsidian shadow-[0_10px_18px_rgba(0,0,0,0.6)]" />}
                  <Link
                    href={`/products/${p.handle}`}
                    aria-label={`${p.title}, ${formatMoney(p.priceRange.minVariantPrice)}, ${availability(p).label}`}
                    onPointerDown={(e) => {
                      pointer.current = e.pointerType;
                      wasActive.current = active === i;
                    }}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={(e) => {
                      // Touch: first tap selects (shows the card), second tap opens the product.
                      if (pointer.current !== "mouse" && !wasActive.current) {
                        e.preventDefault();
                        setActive(i);
                      }
                    }}
                    className={cn(
                      "group relative block h-full w-full outline-offset-4",
                      !reduce && k !== "head" && "garment-sway",
                    )}
                    style={{ animationDelay: `${-i * 0.9}s`, animationDuration: `${5 + (i % 3)}s` }}
                  >
                    <Image
                      src={hangingImage(p.handle)}
                      alt=""
                      width={dims[0]}
                      height={dims[1]}
                      sizes="(min-width: 768px) 18vw, 40vw"
                      className={cn(
                        "h-full w-full object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.55)] transition-[transform,filter] duration-500 ease-[var(--ease-out-expo)]",
                        on && "-translate-y-[2%] scale-[1.05] drop-shadow-[0_26px_30px_rgba(0,0,0,0.7)]",
                        dim && "brightness-[0.55] saturate-50",
                        !p.availableForSale && "opacity-60",
                      )}
                    />
                    {!p.availableForSale && <span className="label absolute bottom-[8%] left-1/2 -translate-x-1/2 bg-dirty px-2 py-1 text-[0.55rem] text-obsidian">Esaurito</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* desktop product card next to the garment */}
          <AnimatePresence>
            {sel && (
              <motion.div
                key={sel.handle}
                aria-hidden
                className="pointer-events-auto absolute z-30 hidden md:block"
                style={{
                  left: selX > 0.62 ? undefined : `calc(${selX * 100}% + 7vw)`,
                  right: selX > 0.62 ? `calc(${(1 - selX) * 100}% + 7vw)` : undefined,
                  top: `${(rail.y + 0.06) * 100}%`,
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onPointerEnter={() => setActive(active)}
              >
                {card(sel)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* mobile: card under the wall */}
      <div className="px-gutter mt-4 md:hidden" aria-live="polite">
        {sel ? card(sel, true) : <p className="label text-concrete">Tocca un capo per vederne i dettagli · scorri la parete →</p>}
      </div>
    </section>
  );
}

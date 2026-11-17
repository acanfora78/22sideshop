import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import { home } from "@/content/site";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, SplitText } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/format";
import { Scribble } from "@/components/ui/Scribble";
import { Sticker } from "@/components/ui/Sticker";

/**
 * Asymmetric lookbook layout on desktop (12-col with offsets and an editorial
 * text block), swipeable snap rail on mobile.
 */
const LAYOUT = [
  { col: "lg:col-span-6", aspect: "aspect-[4/5]", sizes: "(min-width:1024px) 50vw, 80vw" },
  { col: "lg:col-span-4 lg:col-start-9 lg:mt-56", aspect: "aspect-[3/4]", sizes: "(min-width:1024px) 33vw, 80vw" },
  { col: "lg:col-span-4 lg:col-start-2 lg:mt-28", aspect: "aspect-[4/5]", sizes: "(min-width:1024px) 33vw, 80vw" },
  { col: "lg:col-span-6 lg:col-start-7 lg:mt-56", aspect: "aspect-[16/12]", sizes: "(min-width:1024px) 50vw, 80vw" },
  { col: "lg:col-span-4 lg:col-start-1 lg:mt-28", aspect: "aspect-[4/5]", sizes: "(min-width:1024px) 33vw, 80vw" },
  { col: "lg:col-span-5 lg:col-start-7 lg:mt-48", aspect: "aspect-[4/5]", sizes: "(min-width:1024px) 42vw, 80vw" },
];

export function LatestDrop({ products }: { products: Product[] }) {
  const { drop } = home;
  const items = products.slice(0, LAYOUT.length);
  return (
    <section className="relative py-24 md:py-36" aria-labelledby="drop-title">
      <div className="px-gutter">
        <SectionLabel index={drop.index} label={drop.label} />
        <div className="mt-10 flex flex-col gap-8 md:mt-16 md:flex-row md:items-end md:justify-between">
          <h2 id="drop-title" className="font-display text-huge">
            <span className="relative inline-block">
              <SplitText text="Drop 001" className="block" />
              <Scribble className="absolute -bottom-3 left-0 h-6 w-full" delay={0.6} />
              <Sticker label="nuovo!" tone="red" rotate={12} delay={0.8} className="absolute -right-6 -top-4 md:-right-14" />
            </span>
            <span className="mt-2 block font-serif text-[0.42em] normal-case italic tracking-normal text-dirty/80">— Turno di notte</span>
          </h2>
          <Reveal className="max-w-xs space-y-5">
            <p className="text-sm leading-relaxed text-dirty/70">
              Primo drop, scattato dopo il tramonto. Fit larghi, stampe che urlano, un solo segnale rosso. Prendi la tua taglia prima che lo faccia il blocco. (Prodotti demo per l’anteprima del layout.)
            </p>
            <ButtonLink href={drop.cta.href} variant="outline">
              {drop.cta.label}
            </ButtonLink>
          </Reveal>
        </div>
      </div>

      {/* Mobile rail */}
      <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] scroll-px-[var(--gutter)] lg:hidden" aria-label="Prodotti dell'ultimo drop">
        {items.map((p, i) => (
          <li key={p.handle} className="w-[78vw] max-w-sm shrink-0 snap-start">
            <ProductCard product={p} index={i} sizes="80vw" />
          </li>
        ))}
        <li className="flex w-[60vw] max-w-xs shrink-0 snap-start items-center justify-center border border-dirty/15">
          <Link href={drop.cta.href} className="font-display p-6 text-center text-4xl">
            Vedi tutto →
          </Link>
        </li>
      </ul>

      {/* Desktop lookbook */}
      <ul className="px-gutter mt-24 hidden grid-cols-12 gap-x-6 lg:grid">
        {items.map((p, i) => (
          <li key={p.handle} className={cn(LAYOUT[i].col)}>
            <Reveal y={60} delay={(i % 2) * 0.1}>
              <ProductCard product={p} index={i} aspect={LAYOUT[i].aspect} sizes={LAYOUT[i].sizes} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

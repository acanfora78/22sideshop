"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { cn, formatMoney } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";
import { DemoTag } from "@/components/ui/SectionLabel";

/**
 * Editorial product card: front/back image swap on hover, index number,
 * availability, and a quick-add size row (desktop hover / tap "+" on touch).
 */
export function ProductCard({
  product,
  index,
  aspect = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 33vw, 50vw",
  priority = false,
  className,
}: {
  product: Product;
  index?: number;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();
  const [quickOpen, setQuickOpen] = useState(false);
  const soldOut = !product.availableForSale;
  const lowStock = !soldOut && product.variants.length > 2 && product.variants.filter((v) => v.availableForSale).length <= 2;
  const single = product.variants.length === 1;
  const href = `/products/${product.handle}`;

  return (
    <article className={cn("group relative", className)} onMouseLeave={() => setQuickOpen(false)}>
      <div className={cn("relative overflow-hidden bg-asphalt", aspect)}>
        <Link href={href} className="absolute inset-0 block" aria-label={product.title} tabIndex={-1}>
          <Image
            src={product.images[0].url}
            alt={product.images[0].altText}
            fill
            sizes={sizes}
            priority={priority}
            className={cn(
              "object-cover transition-[transform,opacity] duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]",
              product.images[1] && "group-hover:opacity-0",
            )}
          />
          {product.images[1] && (
            <Image
              src={product.images[1].url}
              alt=""
              fill
              sizes={sizes}
              className="scale-[1.08] object-cover opacity-0 transition-[transform,opacity] duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-100 group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {index !== undefined && <span className="label text-dirty/80">{String(index + 1).padStart(2, "0")}</span>}
          <div className="flex flex-col items-end gap-1">
            {soldOut && <span className="label bg-dirty px-2 py-1 text-[0.6rem] text-obsidian">Sold out</span>}
            {lowStock && <span className="label bg-blood px-2 py-1 text-[0.6rem] text-dirty">Few sizes left</span>}
          </div>
        </div>

        {!soldOut && (
          <>
            <button
              type="button"
              onClick={() => (single ? addItem(product, product.variants[0]) : setQuickOpen((v) => !v))}
              className="absolute bottom-3 right-3 z-10 flex size-10 items-center justify-center bg-dirty text-obsidian transition-[transform,background-color] duration-300 hover:bg-blood hover:text-dirty md:translate-y-2 md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100"
              aria-label={single ? `Add ${product.title} to cart` : `Quick add ${product.title} — choose size`}
              aria-expanded={single ? undefined : quickOpen}
            >
              <Plus className={cn("size-4 transition-transform duration-300", quickOpen && "rotate-45")} strokeWidth={1.5} />
            </button>
            <AnimatePresence>
              {quickOpen && !single && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 bottom-0 z-[5] bg-obsidian/95 p-3 pr-16 backdrop-blur"
                >
                  <p className="label mb-2 text-concrete">Quick add — size</p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        disabled={!v.availableForSale}
                        onClick={() => {
                          addItem(product, v);
                          setQuickOpen(false);
                        }}
                        className="label min-w-9 border border-dirty/30 px-2 py-1.5 text-dirty transition-colors hover:bg-dirty hover:text-obsidian disabled:text-concrete disabled:line-through disabled:hover:bg-transparent"
                        aria-label={`Add size ${v.title}${v.availableForSale ? "" : " (sold out)"}`}
                      >
                        {v.title}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="label flex items-center gap-2 text-concrete">
            {product.code} · {product.productType} {product.isDemo && <DemoTag />}
          </p>
          <h3 className="mt-1.5 font-display text-xl leading-[0.95] tracking-normal md:text-2xl">
            <Link href={href} className="hover:text-blood-bright">
              {product.title}
            </Link>
          </h3>
        </div>
        <p className="shrink-0 font-mono text-sm tabular-nums">{formatMoney(product.priceRange.minVariantPrice)}</p>
      </div>
    </article>
  );
}

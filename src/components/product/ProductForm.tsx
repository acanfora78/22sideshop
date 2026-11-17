"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { cn, formatMoney, stockLabel } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { Button } from "@/components/ui/Button";

/** Variant picker + quantity + add to cart. Mirrors Shopify's product form. */
export function ProductForm({ product }: { product: Product }) {
  const { addItem, quantityInCart, ready } = useCart();
  const firstAvailable = product.variants.find((v) => v.availableForSale);
  const single = product.variants.length === 1;
  const [variantId, setVariantId] = useState<string | null>(single ? product.variants[0].id : null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);

  const variant = useMemo(() => product.variants.find((v) => v.id === variantId) ?? null, [variantId, product.variants]);
  const inCart = variant && ready ? quantityInCart(variant.id) : 0;
  const remaining = variant ? Math.max(0, variant.quantityAvailable - inCart) : 0;
  const stock = variant ? stockLabel(variant.quantityAvailable) : null;

  const onAdd = () => {
    if (!variant) {
      setError(true);
      return;
    }
    if (!variant.availableForSale || remaining <= 0) return;
    addItem(product, variant, Math.min(qty, remaining));
    setQty(1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  if (!product.availableForSale) {
    return (
      <div className="space-y-4">
        <p className="label text-blood-bright">Sold out — all sizes</p>
        <Button variant="outline" disabled className="w-full">
          Sold out
        </Button>
        <p className="text-sm text-dirty/60">Restock notifications will be available with the Shopify integration.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <fieldset>
        <div className="mb-3 flex items-baseline justify-between">
          <legend className="label text-concrete">
            Size{variant && <span className="text-dirty"> — {variant.title}</span>}
          </legend>
          <span className="label text-concrete">Size guide at launch</span>
        </div>
        <div className={cn("grid gap-1.5", single ? "grid-cols-1" : "grid-cols-3 sm:grid-cols-6")}>
          {product.variants.map((v) => {
            const selected = v.id === variantId;
            return (
              <button
                key={v.id}
                type="button"
                disabled={!v.availableForSale}
                aria-pressed={selected}
                onClick={() => {
                  setVariantId(v.id);
                  setQty(1);
                  setError(false);
                }}
                className={cn(
                  "relative h-12 border font-mono text-sm transition-colors",
                  selected ? "border-dirty bg-dirty text-obsidian" : "border-dirty/25 text-dirty hover:border-dirty",
                  !v.availableForSale && "cursor-not-allowed border-dirty/10 text-concrete",
                )}
                aria-label={`Size ${v.title}${v.availableForSale ? "" : ", sold out"}`}
              >
                {v.title}
                {!v.availableForSale && (
                  <span aria-hidden className="absolute inset-0 m-auto h-px w-[70%] -rotate-[20deg] bg-concrete/60" />
                )}
              </button>
            );
          })}
        </div>
        <p role="status" className="label mt-3 min-h-4 text-[0.65rem]">
          {error && !variant ? (
            <span className="text-blood-bright">Select a size first.</span>
          ) : stock ? (
            <span className={stock.tone === "low" ? "text-blood-bright" : stock.tone === "out" ? "text-concrete" : "text-dirty/70"}>
              ● {stock.label} <span className="text-concrete">(demo stock)</span>
            </span>
          ) : (
            <span className="text-concrete">
              {firstAvailable ? "Choose your size" : ""}
            </span>
          )}
        </p>
      </fieldset>

      <div className="flex gap-2">
        <QuantityStepper value={qty} max={Math.max(1, remaining)} onChange={setQty} label="Quantity" />
        <Button
          variant="red"
          className="flex-1"
          onClick={onAdd}
          disabled={!!variant && remaining <= 0}
          aria-describedby="add-note"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? "added" : "add"}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2"
            >
              {added ? (
                <>
                  <Check className="size-4" strokeWidth={1.5} /> Added to bag
                </>
              ) : variant && remaining <= 0 ? (
                "All available units in bag"
              ) : (
                <>Add to bag — {formatMoney((variant ?? product.variants[0]).price)}</>
              )}
            </motion.span>
          </AnimatePresence>
        </Button>
      </div>
      <p id="add-note" className="label text-[0.6rem] leading-relaxed text-concrete">
        Demo product · placeholder price · checkout disabled
      </p>
    </div>
  );
}

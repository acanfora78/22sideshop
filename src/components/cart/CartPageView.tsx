"use client";

import { AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";
import { CartLineItem } from "./CartLineItem";
import { CartSummary } from "./CartSummary";
import { ButtonLink } from "@/components/ui/Button";

export function CartPageView() {
  const { lines, ready, clear } = useCart();

  if (!ready) {
    return (
      <div className="grid gap-4 md:grid-cols-12" aria-busy="true">
        <div className="space-y-4 md:col-span-8">
          <div className="skeleton h-40" />
          <div className="skeleton h-40" />
        </div>
        <div className="skeleton h-64 md:col-span-4" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 border-t border-dirty/10 py-20">
        <p className="label text-blood-bright">Your bag is empty</p>
        <p className="font-display text-huge">Empty streets.</p>
        <p className="max-w-md text-dirty/70">Nothing in the bag yet. Head back out and pick your side.</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/shop">Shop all products</ButtonLink>
          <ButtonLink href="/new-arrivals" variant="outline">
            New arrivals
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 md:grid-cols-12">
      <div className="md:col-span-7 lg:col-span-8">
        <div className="label flex justify-between border-b border-dirty/10 pb-3 text-concrete">
          <span>Item</span>
          <button type="button" onClick={clear} className="link-underline hover:text-dirty">
            Clear bag
          </button>
        </div>
        <ul aria-label="Cart items">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <CartLineItem key={l.id} line={l} large />
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <aside className="md:col-span-5 lg:col-span-4" aria-label="Order summary">
        <div className="border border-dirty/15 bg-asphalt p-6 md:sticky md:top-[calc(var(--header-h)+1rem)]">
          <p className="label mb-6 text-concrete">Order summary</p>
          <CartSummary />
          <ButtonLink href="/shop" variant="ghost" className="mt-4 w-full" arrow={false}>
            Continue shopping
          </ButtonLink>
        </div>
      </aside>
    </div>
  );
}

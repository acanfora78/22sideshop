"use client";

import { Lock } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { useCart } from "./CartProvider";

/** Subtotal + disabled checkout. Real checkout arrives with Shopify. */
export function CartSummary() {
  const { subtotal, totalQuantity } = useCart();
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <span className="label text-concrete">
          Subtotale · {totalQuantity} {totalQuantity === 1 ? "articolo" : "articoli"}
        </span>
        <span className="font-display text-3xl tabular-nums">{formatMoney(subtotal)}</span>
      </div>
      <p className="label text-[0.6rem] leading-relaxed text-concrete">Prezzi dimostrativi. Spedizione e tasse calcolate al momento dell’acquisto.</p>
      <button
        type="button"
        disabled
        aria-describedby="checkout-note"
        className="label flex w-full cursor-not-allowed items-center justify-center gap-3 border border-dirty/25 bg-asphalt px-6 py-4 text-dirty/50"
      >
        <Lock className="size-3.5" strokeWidth={1.5} /> Procedi all’acquisto
      </button>
      <p id="checkout-note" className="label text-center text-[0.6rem] leading-relaxed text-blood-bright">
        Pagamento non attivo in questa demo: sarà gestito da Shopify Checkout.
      </p>
    </div>
  );
}

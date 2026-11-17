"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CartLine } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/format";
import { useCart } from "./CartProvider";
import { QuantityStepper } from "./QuantityStepper";

export function CartLineItem({ line, onNavigate, large = false }: { line: CartLine; onNavigate?: () => void; large?: boolean }) {
  const { updateQuantity, removeItem } = useCart();
  const lineTotal = { amount: (Number(line.price.amount) * line.quantity).toFixed(2), currencyCode: line.price.currencyCode };
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 border-b border-dirty/10 py-5"
    >
      <Link
        href={`/products/${line.product.handle}`}
        onClick={onNavigate}
        className={`relative shrink-0 overflow-hidden bg-asphalt ${large ? "h-40 w-32" : "h-28 w-22"}`}
      >
        <Image src={line.product.image.url} alt={line.product.image.altText} fill sizes="128px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="label text-concrete">
              {line.product.code} · Taglia {line.variantTitle}
            </p>
            <Link
              href={`/products/${line.product.handle}`}
              onClick={onNavigate}
              className="mt-1 block font-display text-xl leading-none hover:text-blood-bright"
            >
              {line.product.title}
            </Link>
          </div>
          <p className="font-mono text-sm tabular-nums">{formatMoney(lineTotal)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            max={line.maxQuantity}
            onChange={(n) => updateQuantity(line.id, n)}
            label={`Quantità per ${line.product.title}, taglia ${line.variantTitle}`}
          />
          <button
            type="button"
            onClick={() => removeItem(line.id)}
            className="label link-underline text-concrete hover:text-dirty"
            aria-label={`Rimuovi ${line.product.title}, taglia ${line.variantTitle}`}
          >
            Rimuovi
          </button>
        </div>
        {line.quantity >= line.maxQuantity && <p className="label mt-2 text-[0.6rem] text-blood-bright">Raggiunta la quantità massima disponibile</p>}
      </div>
    </motion.li>
  );
}

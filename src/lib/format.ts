import type { Money, Product } from "@/lib/commerce/types";

const formatters = new Map<string, Intl.NumberFormat>();

export function formatMoney(money: Money): string {
  let f = formatters.get(money.currencyCode);
  if (!f) {
    f = new Intl.NumberFormat("it-IT", { style: "currency", currency: money.currencyCode });
    formatters.set(money.currencyCode, f);
  }
  return f.format(Number(money.amount));
}

export function stockLabel(qty: number): { label: string; tone: "ok" | "low" | "out" } {
  if (qty <= 0) return { label: "Esaurito", tone: "out" };
  if (qty <= 3) return { label: `Disponibilità limitata — ultimi ${qty} pezzi`, tone: "low" };
  return { label: "Disponibile", tone: "ok" };
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Product price for display, or the "to be confirmed" label. */
export function productPrice(p: Product): string {
  return p.priceConfirmed ? formatMoney(p.priceRange.minVariantPrice) : "Prezzo da confermare";
}

/** Availability label shared by cards, store walls and product pages. */
export function productAvailability(p: Product): { label: string; tone: "ok" | "low" | "out" | "soon" } {
  if (!p.priceConfirmed) return { label: "In arrivo", tone: "soon" };
  if (!p.availableForSale) return { label: "Esaurito", tone: "out" };
  const free = p.variants.filter((v) => v.availableForSale).length;
  if (p.variants.length > 2 && free <= 2) return { label: "Disponibilità limitata", tone: "low" };
  return { label: "Disponibile", tone: "ok" };
}

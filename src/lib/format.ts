import type { Money } from "@/lib/commerce/types";

const formatters = new Map<string, Intl.NumberFormat>();

export function formatMoney(money: Money): string {
  let f = formatters.get(money.currencyCode);
  if (!f) {
    f = new Intl.NumberFormat("en-IE", { style: "currency", currency: money.currencyCode });
    formatters.set(money.currencyCode, f);
  }
  return f.format(Number(money.amount));
}

export function stockLabel(qty: number): { label: string; tone: "ok" | "low" | "out" } {
  if (qty <= 0) return { label: "Sold out", tone: "out" };
  if (qty <= 3) return { label: `Low stock — ${qty} left`, tone: "low" };
  return { label: "In stock", tone: "ok" };
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

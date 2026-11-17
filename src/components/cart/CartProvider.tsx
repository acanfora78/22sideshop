"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import type { CartLine, Money, Product, ProductVariant } from "@/lib/commerce/types";

/**
 * Client cart. Mirrors Shopify Cart API semantics (lines keyed by merchandise
 * id, quantity updates, subtotal). Persisted in localStorage so it survives
 * navigation and reloads. Replace with Shopify `cartCreate` / `cartLinesAdd`
 * mutations (cart id in a cookie) during migration.
 */

const STORAGE_KEY = "22side.cart.v1";

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: CartLine }
  | { type: "update"; id: string; quantity: number }
  | { type: "remove"; id: string }
  | { type: "clear" };

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const existing = state.find((l) => l.id === action.line.id);
      if (existing) {
        return state.map((l) =>
          l.id === action.line.id ? { ...l, quantity: Math.min(l.maxQuantity, l.quantity + action.line.quantity) } : l,
        );
      }
      return [...state, { ...action.line, quantity: Math.min(action.line.maxQuantity, action.line.quantity) }];
    }
    case "update":
      if (action.quantity <= 0) return state.filter((l) => l.id !== action.id);
      return state.map((l) => (l.id === action.id ? { ...l, quantity: Math.min(l.maxQuantity, action.quantity) } : l));
    case "remove":
      return state.filter((l) => l.id !== action.id);
    case "clear":
      return [];
  }
}

interface CartContextValue {
  lines: CartLine[];
  totalQuantity: number;
  subtotal: Money;
  ready: boolean;
  isOpen: boolean;
  lastAdded: string | null;
  open: () => void;
  close: () => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  quantityInCart: (variantId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

function isCartLine(x: unknown): x is CartLine {
  if (!x || typeof x !== "object") return false;
  const l = x as CartLine;
  return typeof l.id === "string" && typeof l.quantity === "number" && !!l.product && !!l.price;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [ready, setReady] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", lines: parsed.filter(isCartLine) });
      }
    } catch {
      /* storage unavailable — cart stays in memory */
    }
    // Hydrating from browser storage is a one-off sync with an external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, ready]);

  // Sync between tabs.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        const parsed: unknown = e.newValue ? JSON.parse(e.newValue) : [];
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", lines: parsed.filter(isCartLine) });
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback((product: Product, variant: ProductVariant, quantity = 1) => {
    if (!variant.availableForSale) return;
    dispatch({
      type: "add",
      line: {
        id: variant.id,
        merchandiseId: variant.id,
        quantity,
        maxQuantity: variant.quantityAvailable,
        product: { handle: product.handle, title: product.title, code: product.code, image: product.featuredImage },
        variantTitle: variant.title,
        price: variant.price,
      },
    });
    setLastAdded(variant.id);
    setOpen(true);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = lines.reduce((n, l) => n + l.quantity, 0);
    const total = lines.reduce((n, l) => n + Number(l.price.amount) * l.quantity, 0);
    return {
      lines,
      totalQuantity,
      subtotal: { amount: total.toFixed(2), currencyCode: "EUR" },
      ready,
      isOpen,
      lastAdded,
      open: () => setOpen(true),
      close: () => setOpen(false),
      addItem,
      updateQuantity: (id, quantity) => dispatch({ type: "update", id, quantity }),
      removeItem: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
      quantityInCart: (variantId) => lines.find((l) => l.id === variantId)?.quantity ?? 0,
    };
  }, [lines, ready, isOpen, lastAdded, addItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

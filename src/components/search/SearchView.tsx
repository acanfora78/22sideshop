"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { searchProducts } from "@/lib/commerce/sort";
import { ProductCard } from "@/components/product/ProductCard";

const SUGGESTIONS = ["t-shirt", "jeans", "felpa", "cargo", "manica lunga", "angelo"];

export function SearchView({ products, initialQuery }: { products: Product[]; initialQuery: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchProducts(products, q), [products, q]);

  useEffect(() => {
    input.current?.focus();
  }, []);

  // Keep the URL shareable without adding history entries per keystroke.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const url = q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search";
      router.replace(url, { scroll: false });
    }, 300);
    return () => window.clearTimeout(t);
  }, [q, router]);

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="flex items-center gap-4 border-b-2 border-dirty/60 pb-2 focus-within:border-blood-bright">
        <Search className="size-7 shrink-0 text-concrete md:size-10" strokeWidth={1.25} aria-hidden />
        <label htmlFor="search-input" className="sr-only">
          Cerca prodotti
        </label>
        <input
          ref={input}
          id="search-input"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca un prodotto"
          autoComplete="off"
          className="font-display w-full bg-transparent text-[clamp(2.4rem,7vw,6rem)] leading-none text-dirty placeholder:text-dirty/20 focus:outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {q && (
          <button type="button" onClick={() => setQ("")} className="p-2 text-concrete hover:text-dirty" aria-label="Cancella ricerca">
            <X className="size-6" strokeWidth={1.25} />
          </button>
        )}
      </form>

      <div className="label mt-5 flex flex-wrap items-center gap-2 text-concrete">
        <span>Prova:</span>
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" onClick={() => setQ(s)} className="border border-dirty/20 px-2.5 py-1.5 text-dirty/80 hover:border-dirty hover:text-dirty">
            {s}
          </button>
        ))}
      </div>

      <p className="label mt-12 text-concrete" aria-live="polite">
        {q.trim() ? `${results.length} ${results.length === 1 ? "risultato" : "risultati"} per “${q.trim()}”` : "Inizia a scrivere per cercare nel catalogo demo"}
      </p>

      {q.trim() && results.length === 0 && (
        <div className="mt-10 flex flex-col items-start gap-5">
          <p className="font-display text-big">Nessun risultato.</p>
          <p className="text-dirty/70">Controlla come hai scritto o prova una parola più generica.</p>
          <Link href="/shop" className="label link-underline text-dirty">
            Sfoglia tutti i prodotti →
          </Link>
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
          {results.map((p, i) => (
            <li key={p.handle}>
              <ProductCard product={p} index={i} sizes="(min-width: 1024px) 25vw, 50vw" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

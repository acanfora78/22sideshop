"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Collection, Product, ProductSortKey } from "@/lib/commerce/types";
import { sortProducts } from "@/lib/commerce/sort";
import { cn } from "@/lib/format";
import { ProductGrid } from "./ProductGrid";
import { ButtonLink } from "@/components/ui/Button";

const SORTS: { key: ProductSortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price ↑" },
  { key: "price-desc", label: "Price ↓" },
];

/** Toolbar (collection chips, availability filter, sort) + grid. */
export function CollectionView({
  products,
  collections,
  activeHandle,
  defaultSort = "featured",
}: {
  products: Product[];
  collections: Collection[];
  activeHandle?: string;
  defaultSort?: ProductSortKey;
}) {
  const [sort, setSort] = useState<ProductSortKey>(defaultSort);
  const [inStock, setInStock] = useState(false);
  const list = useMemo(() => {
    const filtered = inStock ? products.filter((p) => p.availableForSale) : products;
    return sortProducts(filtered, sort);
  }, [products, sort, inStock]);

  return (
    <div>
      <div className="sticky top-0 z-30 -mx-[var(--gutter)] mb-10 border-y border-dirty/10 bg-obsidian/90 px-[var(--gutter)] backdrop-blur-md">
        <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Collections" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto">
            <Chip href="/shop" active={!activeHandle}>
              All
            </Chip>
            {collections.map((c) => (
              <Chip key={c.handle} href={c.handle === "new-arrivals" ? "/new-arrivals" : `/collections/${c.handle}`} active={activeHandle === c.handle}>
                {c.title}
              </Chip>
            ))}
          </nav>
          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <label className="label flex cursor-pointer items-center gap-2 text-dirty/80">
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="size-3.5 accent-[#8b1717]" />
              In stock only
            </label>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="label text-concrete">
                Sort
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as ProductSortKey)}
                className="label border border-dirty/25 bg-obsidian px-2 py-2 text-dirty focus:border-dirty focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <span className="label hidden text-concrete sm:inline" aria-live="polite">
              {list.length} item{list.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-start gap-6 py-24">
          <p className="font-display text-big">Nothing in stock here.</p>
          <p className="text-dirty/70">Turn off the stock filter or explore the full catalogue.</p>
          <ButtonLink href="/shop">Shop all</ButtonLink>
        </div>
      ) : (
        <ProductGrid products={list} />
      )}
    </div>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "label shrink-0 border px-3 py-2 transition-colors",
        active ? "border-dirty bg-dirty text-obsidian" : "border-dirty/20 text-dirty/75 hover:border-dirty hover:text-dirty",
      )}
    >
      {children}
    </Link>
  );
}

/** Pure, client-safe catalogue helpers (no data imports). */
import type { Product, ProductSortKey } from "./types";

export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return products.filter((p) => {
    const hay = [p.title, p.productType, p.code, p.description, ...p.tags, ...p.collections].join(" ").toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}

export function sortProducts(products: Product[], key: ProductSortKey): Product[] {
  const list = [...products];
  switch (key) {
    case "newest":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return list.sort((a, b) => Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount));
    case "price-desc":
      return list.sort((a, b) => Number(b.priceRange.minVariantPrice.amount) - Number(a.priceRange.minVariantPrice.amount));
    default:
      return list;
  }
}

/**
 * Commerce facade. Pages and components only ever import from here.
 *
 * Shopify migration: implement the same functions in providers/shopify.ts
 * (Storefront API: products, productByHandle, collectionByHandle, search) and
 * switch the `provider` constant. Nothing else needs to change.
 */
import { mockProvider } from "./providers/mock";
import type { Product } from "./types";

const provider = mockProvider;

export const getProducts = provider.getProducts;
export const getProduct = provider.getProduct;
export const getCollections = provider.getCollections;
export const getCollection = provider.getCollection;
export const getCollectionProducts = provider.getCollectionProducts;

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await provider.getProducts();
  const scored = all
    .filter((p) => p.handle !== product.handle)
    .map((p) => ({
      p,
      score:
        p.collections.filter((c) => product.collections.includes(c)).length * 2 +
        p.tags.filter((t) => product.tags.includes(t)).length +
        (p.productType === product.productType ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.p);
}

export * from "./types";
export { searchProducts, sortProducts } from "./sort";

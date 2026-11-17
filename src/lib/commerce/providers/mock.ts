import { productImage } from "@/content/media";
import { collections } from "@/data/collections";
import { rawProducts, type RawProduct } from "@/data/products";
import type { Collection, Money, Product } from "../types";

const money = (n: number): Money => ({ amount: n.toFixed(2), currencyCode: "EUR" });

function toProduct(raw: RawProduct): Product {
  const images = [
    productImage(raw.slug, "front", raw.alt),
    productImage(raw.slug, "back", raw.alt.replace("stesa", "vista retro").replace("stesi", "vista retro")),
    productImage(raw.slug, "detail", `${raw.title} — dettaglio (segnaposto demo)`),
  ];
  const variants = raw.sizes.map((size, i) => ({
    id: `gid://demo/ProductVariant/${raw.slug}-${size.toLowerCase().replace(/\s+/g, "-")}`,
    title: size,
    sku: `${raw.code}-${size.replace(/\s+/g, "")}`,
    availableForSale: (raw.stock[i] ?? 0) > 0,
    quantityAvailable: raw.stock[i] ?? 0,
    selectedOptions: [{ name: "Taglia", value: size }],
    price: money(raw.price),
  }));
  return {
    id: `gid://demo/Product/${raw.slug}`,
    handle: raw.slug,
    title: raw.title,
    code: raw.code,
    vendor: "22SIDE",
    productType: raw.productType,
    description: raw.description,
    details: raw.details,
    tags: raw.tags,
    collections: raw.collections,
    options: [{ id: "size", name: "Taglia", values: raw.sizes }],
    variants,
    featuredImage: images[0],
    images,
    priceRange: { minVariantPrice: money(raw.price), maxVariantPrice: money(raw.price) },
    availableForSale: variants.some((v) => v.availableForSale),
    createdAt: raw.createdAt,
    isDemo: true,
  };
}

const products = rawProducts.map(toProduct);

export const mockProvider = {
  async getProducts(): Promise<Product[]> {
    return products;
  },
  async getProduct(handle: string): Promise<Product | undefined> {
    return products.find((p) => p.handle === handle);
  },
  async getCollections(): Promise<Collection[]> {
    return collections;
  },
  async getCollection(handle: string): Promise<Collection | undefined> {
    return collections.find((c) => c.handle === handle);
  },
  async getCollectionProducts(handle: string): Promise<Product[]> {
    const col = collections.find((c) => c.handle === handle);
    const list = products.filter((p) => p.collections.includes(handle));
    if (col?.sortOrder === "created-desc") {
      return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return list;
  },
};

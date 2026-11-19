import { collections } from "@/data/collections";
import { rawProducts, type RawProduct } from "@/data/products";
import type { Collection, Money, Product } from "../types";

const money = (n: number): Money => ({ amount: n.toFixed(2), currencyCode: "EUR" });

function toProduct(raw: RawProduct): Product {
  const images = raw.images.map((im) => ({
    url: `/media/products/real/${im.file}.webp`,
    altText: im.alt,
    width: 1200,
    height: 1600,
  }));
  const priceConfirmed = raw.price !== null && raw.sizes !== null;
  const price = money(raw.price ?? 0);
  const sizes = raw.sizes ?? ["Da confermare"];
  const variants = sizes.map((size, i) => {
    const qty = priceConfirmed ? (raw.stock ? (raw.stock[i] ?? 0) : 99) : 0;
    return {
      id: `gid://22side/ProductVariant/${raw.slug}-${size.toLowerCase().replace(/\s+/g, "-")}`,
      title: size,
      sku: `${raw.code}-${size.replace(/\s+/g, "")}`,
      availableForSale: qty > 0,
      quantityAvailable: qty,
      selectedOptions: [{ name: "Taglia", value: size }],
      price,
    };
  });
  return {
    id: `gid://22side/Product/${raw.slug}`,
    handle: raw.slug,
    title: raw.title,
    code: raw.code,
    vendor: "22SIDE",
    productType: raw.productType,
    description: raw.description,
    details: raw.details,
    tags: raw.tags,
    collections: raw.collections,
    options: [{ id: "size", name: "Taglia", values: sizes }],
    variants,
    featuredImage: images[0],
    images,
    priceRange: { minVariantPrice: price, maxVariantPrice: price },
    availableForSale: variants.some((v) => v.availableForSale),
    priceConfirmed,
    createdAt: raw.createdAt,
    isDemo: false,
    sizeGuide: raw.sizeGuide,
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

/**
 * Commerce domain types.
 *
 * Shapes intentionally mirror the Shopify Storefront API / Liquid objects
 * (product, variant, collection, cart line) so the mock provider can later be
 * swapped for a Shopify provider — or the components mapped 1:1 onto Liquid
 * sections — without touching presentation code.
 */

export type CurrencyCode = "EUR";

export interface Money {
  /** Decimal string, e.g. "45.00" (Shopify convention). */
  amount: string;
  currencyCode: CurrencyCode;
}

export interface Image {
  url: string;
  altText: string;
  width: number;
  height: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  availableForSale: boolean;
  /** Units in stock. Demo data only. */
  quantityAvailable: number;
  selectedOptions: SelectedOption[];
  price: Money;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  /** Short internal reference shown in editorial microtext. */
  code: string;
  vendor: string;
  productType: string;
  description: string;
  /** Equivalent to a Shopify metafield list (materials, fit, care...). */
  details: string[];
  tags: string[];
  /** Collection handles this product belongs to. */
  collections: string[];
  options: ProductOption[];
  variants: ProductVariant[];
  featuredImage: Image;
  images: Image[];
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  availableForSale: boolean;
  createdAt: string;
  /** Always true in this prototype — flags demo merchandise in the UI. */
  isDemo: boolean;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  /** Editorial kicker shown above the title. */
  kicker: string;
  description: string;
  image: Image;
  /** "manual" = explicit list, "smart" = rule-based (like Shopify smart collections). */
  sortOrder: "manual" | "created-desc";
}

export type ProductSortKey = "featured" | "newest" | "price-asc" | "price-desc";

export interface CartLine {
  /** Uses the variant id as line id (one line per variant). */
  id: string;
  merchandiseId: string;
  quantity: number;
  maxQuantity: number;
  product: {
    handle: string;
    title: string;
    code: string;
    image: Image;
  };
  variantTitle: string;
  price: Money;
}

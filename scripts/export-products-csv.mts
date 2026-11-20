/**
 * Export the catalogue as a Shopify product-import CSV.
 * Run: node --experimental-strip-types scripts/export-products-csv.mts [base-url]
 * Products without price/sizes are exported as "draft" with empty price.
 */
import { writeFileSync } from "node:fs";
import { rawProducts } from "../src/data/products.ts";
import { collections } from "../src/data/collections.ts";

const base = (process.argv[2] ?? "https://22sideshop.vercel.app").replace(/\/$/, "");
const cols = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value", "Variant SKU", "Variant Price", "Variant Inventory Qty",
  "Variant Inventory Policy", "Variant Fulfillment Service", "Variant Requires Shipping", "Variant Taxable",
  "Image Src", "Image Position", "Image Alt Text", "Status", "Collections (22SIDE)", "Codice (product.metafields.custom.codice)", "Note",
];
const esc = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const html = (p: (typeof rawProducts)[number]) =>
  `<p>${p.description}</p><ul>${p.details.map((d) => `<li>${d}</li>`).join("")}</ul>`;

const rows: string[][] = [];
for (const p of rawProducts) {
  const sizes = p.sizes ?? ["Da confermare"];
  const confirmed = p.price !== null && p.sizes !== null;
  const colls = p.collections.map((h) => collections.find((c) => c.handle === h)?.title ?? h).join("; ");
  const n = Math.max(sizes.length, p.images.length);
  for (let i = 0; i < n; i++) {
    const size = sizes[i];
    const img = p.images[i];
    const first = i === 0;
    rows.push([
      p.slug,
      first ? p.title : "",
      first ? html(p) : "",
      first ? "22SIDE" : "",
      first ? p.productType : "",
      first ? [...p.tags, ...(confirmed ? [] : ["prezzo-da-confermare"])].join(", ") : "",
      first ? (confirmed ? "TRUE" : "FALSE") : "",
      first ? "Taglia" : "",
      size ?? "",
      size ? `${p.code}-${size.replace(/\s+/g, "")}` : "",
      size && p.price !== null ? p.price.toFixed(2) : "",
      size ? String(p.stock?.[sizes.indexOf(size)] ?? (confirmed ? "" : "0")) : "",
      size ? "deny" : "",
      size ? "manual" : "",
      size ? "TRUE" : "",
      size ? "TRUE" : "",
      img ? `${base}/media/products/real/${img.file}.webp` : "",
      img ? String(i + 1) : "",
      img ? img.alt : "",
      first ? (confirmed ? "active" : "draft") : "",
      first ? colls : "",
      first ? p.code : "",
      first && !confirmed ? "Prezzo e taglie da confermare" : "",
    ]);
  }
}
const csv = "﻿" + [cols, ...rows].map((r) => r.map(esc).join(",")).join("\n") + "\n";
writeFileSync("exports/22side-prodotti-shopify.csv", csv);
console.log(`${rawProducts.length} prodotti, ${rows.length} righe -> exports/22side-prodotti-shopify.csv`);

// Simple sheet (one row per product, ";" for Italian Excel) for the brand to fill in prices/sizes.
const head = ["Codice", "Nome", "Tipo", "Collezioni", "Prezzo (EUR)", "Taglie disponibili", "Taglie esaurite", "Tessuto / composizione", "Vestibilità", "Link pagina"];
const esc2 = (v: string) => (/[";\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const simple = rawProducts.map((p) => [
  p.code,
  p.title,
  p.productType,
  p.collections.map((h) => collections.find((c) => c.handle === h)?.title ?? h).join(", "),
  p.price !== null ? p.price.toFixed(2).replace(".", ",") : "",
  p.sizes ? p.sizes.join(", ") : "",
  "",
  "",
  "",
  `${base}/products/${p.slug}`,
]);
writeFileSync("exports/22side-prodotti-da-compilare.csv", "﻿" + [head, ...simple].map((r) => r.map(esc2).join(";")).join("\n") + "\n");
console.log("exports/22side-prodotti-da-compilare.csv");

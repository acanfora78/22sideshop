/* eslint-disable @typescript-eslint/no-explicit-any -- loose mocks of Shopify objects for a throwaway preview */
/**
 * Local smoke render of the Shopify theme (no Shopify store needed).
 * Approximates Shopify Liquid with liquidjs + mocked objects so the home page,
 * a collection and a product page can be opened in a browser and screenshotted.
 *   npx tsx scripts/theme/preview.mts <liquidjs dir> <out dir>
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { rawProducts as raw } from "../../src/data/products.ts";

const [, , liquidDir, outDir] = process.argv;
const require = createRequire(path.join(liquidDir, "x.js"));
const { Liquid, Tag } = require("liquidjs");
const T = path.resolve("shopify-theme");
const read = (p: string) => fs.readFileSync(path.join(T, p), "utf8");
const locale = JSON.parse(read("locales/it.default.json"));
const schemaOf = (name: string) => {
  const m = read(`sections/${name}.liquid`).match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
  return m ? JSON.parse(m[1]) : {};
};
const defaults = (settings: any[] = []) => Object.fromEntries(settings.filter((s) => "default" in s).map((s) => [s.id, s.default]));

// ── mock catalogue ──
const img = (file: string, alt: string) => ({ src: `/products/${file}.webp`, alt, width: 1200, height: 1500, media_type: "image" });
const products = raw.map((p: any, i: number) => {
  const media = p.images.map((im: any) => img(im.file, im.alt));
  const sizes: string[] = p.sizes ?? ["Da confermare"];
  const variants = sizes.map((sz, j) => ({ id: 1000 + i * 10 + j, title: sz, available: true, price: (p.price ?? 0) * 100, compare_at_price: null, options: [sz] }));
  const variant = variants[0];
  return {
    id: i + 1, handle: p.slug, title: p.title, url: `/products/${p.slug}`, type: p.productType, vendor: "22SIDE",
    available: true, tags: [...p.tags, ...(p.price === null ? ["prezzo-da-confermare"] : []), ...(p.sizes === null ? ["taglie-da-confermare"] : [])], media, featured_media: media[0], featured_image: media[0],
    variants, selected_or_first_available_variant: variant, has_only_default_variant: false, price_varies: false,
    options: ["Taglia"], options_with_values: [{ name: "Taglia", values: sizes, selected_value: sizes[0] }],
    description: `<p>${p.description ?? ""}</p>`,
    metafields: { custom: { codice: p.code, immagini_didascalie: { value: p.images.map((im: any) => im.caption) } } },
  };
});
const coll = (handle: string, title: string, list: any[]) => ({ handle, title, url: `/collections/${handle}`, products: list, products_count: list.length, featured_image: list[0]?.featured_image, sort_options: [{ value: "manual", name: "In evidenza" }], sort_by: "manual", description: "" });
const byLine = (h: string) => products.filter((_: any, i: number) => raw[i].collections.includes(h));
const collections: any = [
  coll("coordinati", "Coordinati", byLine("coordinati")),
  coll("longsleeve", "Longsleeve", byLine("longsleeve")),
  coll("pantaloni", "Pantaloni", byLine("pantaloni")),
  coll("t-shirt", "T-shirt", byLine("t-shirt")),
];
for (const c of [...collections]) collections[c.handle] = c;
collections.all = coll("all", "Tutti i prodotti", products);

// ── engine ──
const engine = new Liquid({ root: [path.join(T, "snippets")], extname: ".liquid", strictFilters: false, jsTruthy: false });
const lookup = (key: string) => key.split(".").reduce((o: any, k) => (o ? o[k] : undefined), locale);
engine.registerFilter("t", (key: string, ...args: any[]) => {
  let v = lookup(key);
  const params: any = Object.fromEntries(args.filter(Array.isArray));
  if (v && typeof v === "object") v = params.count === 1 ? v.one : v.other;
  if (typeof v !== "string") return `[${key}]`;
  return v.replace(/{{\s*(\w+)\s*}}/g, (_: string, k: string) => String(params[k] ?? ""));
});
engine.registerFilter("asset_url", (f: string) => `/assets/${f}`);
engine.registerFilter("image_url", (o: any) => (typeof o === "string" ? o : o?.src ?? ""));
engine.registerFilter("image_tag", (src: string, ...args: any[]) => {
  const a: any = Object.fromEntries(args.filter(Array.isArray));
  return `<img src="${src}" alt="${a.alt ?? ""}" class="${a.class ?? ""}" loading="${a.loading ?? "lazy"}" width="1200" height="1500">`;
});
engine.registerFilter("stylesheet_tag", (u: string) => `<link rel="stylesheet" href="${u}">`);
engine.registerFilter("money", (c: number) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format((c || 0) / 100));
engine.registerFilter("placeholder_svg_tag", (_: string, cls: string) => `<svg class="${cls}"></svg>`);
engine.registerFilter("format_code", (s: string) => s);
engine.registerFilter("media_tag", () => "");

engine.registerTag("schema", class extends Tag {
  constructor(token: any, remain: any[], liquid: any) { super(token, remain, liquid); while (remain.length) { const t = remain.shift(); if (t.name === "endschema") break; } }
  *render() { return ""; }
});
const blockTag = (name: string, open: (ctx: any, args: string) => string, close: string) =>
  engine.registerTag(name, class extends Tag {
    tpls: any[] = []; args: string;
    constructor(token: any, remain: any[], liquid: any) {
      super(token, remain, liquid);
      this.args = token.args;
      const stream = liquid.parser.parseStream(remain).on(`tag:end${name}`, () => stream.stop()).on("template", (t: any) => this.tpls.push(t)).on("end", () => { throw new Error(`${name} not closed`); });
      stream.start();
    }
    *render(ctx: any, emitter: any) { emitter.write(open(ctx, this.args)); yield liquid_render(this.tpls, ctx, emitter); emitter.write(close); }
  });
const liquid_render: any = (tpls: any, ctx: any, emitter: any) => engine.renderer.renderTemplates(tpls, ctx, emitter);
blockTag("form", (_c, args) => `<form method="post" action="/cart/add" ${args.includes("data-product-form") ? "data-product-form data-main-form" : ""} class="mt-8 space-y-6">`, "</form>");
blockTag("paginate", (ctx) => { ctx.push({ paginate: { pages: 1, current_page: 1 } }); return ""; }, "");

function sectionObj(type: string, data: any = {}) {
  const schema = schemaOf(type);
  const blockDefs = Object.fromEntries((schema.blocks ?? []).map((b: any) => [b.type, b]));
  const order = data.block_order ?? [];
  const blocks = order.map((id: string) => ({ id, type: data.blocks[id].type, shopify_attributes: "", settings: { ...defaults(blockDefs[data.blocks[id].type]?.settings), ...data.blocks[id].settings } }));
  return { id: type, settings: { ...defaults(schema.settings), ...(data.settings ?? {}) }, blocks };
}
const globals: any = {
  shop: {
    name: "22SIDE", url: "/",
    privacy_policy: { title: "Informativa sulla privacy", url: "/policies/privacy-policy" },
    policies: [
      { title: "Termini di servizio", url: "/policies/terms-of-service" },
      { title: "Politica di rimborso", url: "/policies/refund-policy" },
      { title: "Politica di spedizione", url: "/policies/shipping-policy" },
      { title: "Informativa sulla privacy", url: "/policies/privacy-policy" },
    ],
    enabled_payment_types: [],
    metafields: { brand: {} },
  },
  pages: {
    cookie: { title: "Cookie policy", url: "/pages/cookie" },
    garanzia: { title: "Garanzia legale", url: "/pages/garanzia" },
    recesso: { title: "Recedi dal contratto qui", url: "/pages/recesso" },
  }, request: { locale: { iso_code: "it" } }, settings: JSON.parse(read("config/settings_data.json")).current,
  routes: { root_url: "/", cart_url: "/cart", cart_add_url: "/cart/add", cart_change_url: "/cart/change", search_url: "/search", all_products_collection_url: "/collections/all", collections_url: "/collections", product_recommendations_url: "/recommendations/products" },
  cart: { item_count: 0, items: [], total_price: 0 }, collections,
  // Shopify's default main menu, as on the real store
  linklists: { "main-menu": { title: "Menu principale", links: [
    { title: "Home", url: "/", type: "frontpage_link", links: [] },
    { title: "Catalogo", url: "/collections/all", type: "catalog_link", links: [] },
    { title: "Contatti", url: "/pages/contact", type: "page_link", links: [] },
  ] } }, content_for_header: "", canonical_url: "/", page_title: "22SIDE", current_page: 1,
  template: { name: "index" },
};
// Shopify globals are visible inside {% render %} snippets too (liquidjs isolates them unless set as engine globals).
Object.assign(engine.options.globals, globals);
async function renderSection(type: string, data: any, extra: any = {}) {
  return engine.parseAndRender(read(`sections/${type}.liquid`), { ...globals, ...extra, section: sectionObj(type, data) });
}
engine.registerTag("section", class extends Tag {
  name2: string;
  constructor(token: any, remain: any[], liquid: any) { super(token, remain, liquid); this.name2 = token.args.trim().replace(/['"]/g, ""); }
  *render(ctx: any, emitter: any) { emitter.write(yield renderSection(this.name2, {}, ctx.getAll())); }
});

async function page(file: string, templateName: string, extra: any = {}) {
  const tpl = JSON.parse(read(`templates/${templateName}.json`));
  let body = "";
  for (const key of tpl.order) body += await renderSection(tpl.sections[key].type, tpl.sections[key], extra);
  const html = await engine.parseAndRender(read("layout/theme.liquid"), { ...globals, ...extra, template: { name: templateName.split(".")[0], suffix: templateName.split(".")[1] }, content_for_layout: body });
  fs.mkdirSync(path.dirname(path.join(outDir, file)), { recursive: true });
  fs.writeFileSync(path.join(outDir, file), html);
  console.log("wrote", file, html.length);
}

await page("index.html", "index");
await page("collections/all/index.html", "collection", { collection: collections.all });
await page("products/heaven-tee/index.html", "product", { product: products[2] });
await page("products/baggy-jeans-vintage-blue/index.html", "product", { product: products[9] });
await page("cart/index.html", "cart");
for (const v of ["privacy", "recesso", "garanzia", "cookie", "condizioni"]) await page(`legal/${v}/index.html`, `index.${v}`);
fs.rmSync(path.join(outDir, "assets"), { force: true, recursive: true });
fs.symlinkSync(path.join(T, "assets"), path.join(outDir, "assets"));
fs.rmSync(path.join(outDir, "products-img"), { force: true });
if (!fs.existsSync(path.join(outDir, "products", "cash-mouth-layered-tee-1.webp")))
  for (const f of fs.readdirSync("public/media/products/real")) fs.copyFileSync(path.join("public/media/products/real", f), path.join(outDir, "products", f));

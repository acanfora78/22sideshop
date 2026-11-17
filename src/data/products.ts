/**
 * DEMO CATALOGUE — NOT REAL 22SIDE MERCHANDISE.
 *
 * Every product, price and stock level below is a placeholder used to make the
 * prototype navigable. Nothing here describes an actual 22SIDE garment.
 * When the Shopify store is connected this file is replaced by live data
 * (see src/lib/commerce/index.ts).
 */

export interface RawProduct {
  code: string;
  slug: string;
  title: string;
  productType: string;
  description: string;
  details: string[];
  collections: string[];
  tags: string[];
  /** Placeholder price, EUR. */
  price: number;
  sizes: string[];
  /** Demo stock per size (same order as `sizes`). */
  stock: number[];
  createdAt: string;
  alt: string;
}

const APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];

export const rawProducts: RawProduct[] = [
  {
    code: "D-01",
    slug: "demo-heavyweight-tee-black",
    title: "Demo Heavyweight Tee — Black",
    productType: "T-Shirt",
    description:
      "Placeholder product used to demonstrate the product page layout. A boxy, dropped-shoulder tee with a small chest wordmark and a full back statement print.",
    details: ["Demo placeholder — final fabric to be confirmed by 22SIDE", "Boxy oversized fit (demo spec)", "Chest wordmark + back print", "Size guide available at launch"],
    collections: ["drop-001", "tops", "new-arrivals"],
    tags: ["tee", "black", "print"],
    price: 45,
    sizes: APPAREL,
    stock: [3, 8, 12, 9, 4, 0],
    createdAt: "2026-11-02",
    alt: "Demo placeholder: black tee, flat lay, back print reading No Rules. Just Attitude.",
  },
  {
    code: "D-02",
    slug: "demo-oversized-hoodie-washed-black",
    title: "Demo Oversized Hoodie — Washed Black",
    productType: "Hoodie",
    description:
      "Placeholder product. Oversized hooded sweatshirt silhouette with kangaroo pocket, red chest wordmark and a back statement print.",
    details: ["Demo placeholder — composition to be confirmed", "Oversized fit, dropped shoulders (demo spec)", "Kangaroo pocket, flat drawcords", "Back print: NOT MADE TO FIT IN"],
    collections: ["drop-001", "tops", "new-arrivals"],
    tags: ["hoodie", "washed", "print"],
    price: 95,
    sizes: APPAREL,
    stock: [0, 4, 6, 7, 2, 1],
    createdAt: "2026-11-04",
    alt: "Demo placeholder: washed black hoodie, flat lay, red 22SIDE chest print.",
  },
  {
    code: "D-03",
    slug: "demo-crewneck-heather-grey",
    title: "Demo Crewneck — Heather Grey",
    productType: "Sweatshirt",
    description: "Placeholder product. Classic crewneck sweatshirt silhouette with a stacked chest print and ribbed trims.",
    details: ["Demo placeholder", "Relaxed fit (demo spec)", "Ribbed collar, cuffs and hem", "Stacked chest print"],
    collections: ["drop-001", "tops"],
    tags: ["crewneck", "grey"],
    price: 79,
    sizes: APPAREL,
    stock: [2, 5, 5, 6, 3, 2],
    createdAt: "2026-10-20",
    alt: "Demo placeholder: heather grey crewneck with stacked UNDERGROUND 22SIDE print.",
  },
  {
    code: "D-04",
    slug: "demo-cargo-pant-asphalt",
    title: "Demo Cargo Pant — Asphalt",
    productType: "Pants",
    description: "Placeholder product. Wide-leg cargo silhouette with bellow pockets on the thigh.",
    details: ["Demo placeholder", "Wide straight leg (demo spec)", "Thigh cargo pockets", "Waist sizing at launch"],
    collections: ["drop-001", "bottoms", "new-arrivals"],
    tags: ["cargo", "pants"],
    price: 110,
    sizes: ["28", "30", "32", "34", "36"],
    stock: [1, 4, 6, 3, 0],
    createdAt: "2026-11-06",
    alt: "Demo placeholder: asphalt grey cargo pants, flat lay.",
  },
  {
    code: "D-05",
    slug: "demo-longsleeve-bone",
    title: "Demo Longsleeve — Bone",
    productType: "Longsleeve",
    description: "Placeholder product. Off-white longsleeve with a small chest number and a back typographic print.",
    details: ["Demo placeholder", "Regular fit (demo spec)", "Chest number + back print"],
    collections: ["tops"],
    tags: ["longsleeve", "bone"],
    price: 59,
    sizes: APPAREL,
    stock: [4, 6, 0, 5, 5, 2],
    createdAt: "2026-09-28",
    alt: "Demo placeholder: bone longsleeve with small 22 chest print.",
  },
  {
    code: "D-06",
    slug: "demo-six-panel-cap-black",
    title: "Demo Six-Panel Cap — Black",
    productType: "Cap",
    description: "Placeholder product. Six-panel cap silhouette with front wordmark.",
    details: ["Demo placeholder", "Adjustable strap (demo spec)", "Front wordmark"],
    collections: ["headwear", "drop-001"],
    tags: ["cap", "headwear"],
    price: 39,
    sizes: ["One Size"],
    stock: [14],
    createdAt: "2026-10-30",
    alt: "Demo placeholder: black six-panel cap with white 22SIDE wordmark.",
  },
  {
    code: "D-07",
    slug: "demo-work-jacket-concrete",
    title: "Demo Work Jacket — Concrete",
    productType: "Jacket",
    description: "Placeholder product. Workwear-inspired jacket silhouette with chest pockets and a back print.",
    details: ["Demo placeholder", "Boxy fit (demo spec)", "Button front, chest pockets", "Back print"],
    collections: ["tops", "new-arrivals"],
    tags: ["jacket", "outerwear"],
    price: 149,
    sizes: ["S", "M", "L", "XL"],
    stock: [0, 0, 0, 0],
    createdAt: "2026-11-08",
    alt: "Demo placeholder: concrete grey work jacket, flat lay.",
  },
  {
    code: "D-08",
    slug: "demo-graphic-tee-bone",
    title: "Demo Graphic Tee — Bone",
    productType: "T-Shirt",
    description: "Placeholder product. Off-white tee with a red chest slogan and an oversized stacked back graphic.",
    details: ["Demo placeholder", "Oversized fit (demo spec)", "Red chest slogan, large back graphic"],
    collections: ["drop-001", "tops", "new-arrivals"],
    tags: ["tee", "bone", "print"],
    price: 49,
    sizes: APPAREL,
    stock: [5, 9, 11, 10, 6, 3],
    createdAt: "2026-11-10",
    alt: "Demo placeholder: bone tee with red YOU CREATE IT chest print.",
  },
  {
    code: "D-09",
    slug: "demo-mesh-short-black",
    title: "Demo Mesh Short — Black",
    productType: "Shorts",
    description: "Placeholder product. Loose basketball-short silhouette with a leg number.",
    details: ["Demo placeholder", "Loose fit, above knee (demo spec)", "Leg number print"],
    collections: ["bottoms"],
    tags: ["shorts", "black"],
    price: 55,
    sizes: ["S", "M", "L", "XL"],
    stock: [3, 3, 4, 2],
    createdAt: "2026-08-12",
    alt: "Demo placeholder: black mesh shorts with 22 leg print.",
  },
  {
    code: "D-10",
    slug: "demo-rib-beanie-blood",
    title: "Demo Rib Beanie — Blood Red",
    productType: "Beanie",
    description: "Placeholder product. Ribbed cuffed beanie in the brand accent red.",
    details: ["Demo placeholder", "Cuffed rib knit (demo spec)", "Woven wordmark on cuff"],
    collections: ["headwear", "new-arrivals"],
    tags: ["beanie", "headwear", "red"],
    price: 35,
    sizes: ["One Size"],
    stock: [9],
    createdAt: "2026-11-12",
    alt: "Demo placeholder: blood red rib beanie with white 22SIDE label.",
  },
];

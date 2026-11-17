/**
 * CATALOGO DEMO — NON È MERCE REALE 22SIDE.
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
    title: "T-shirt Heavyweight Demo — Nera",
    productType: "T-Shirt",
    description:
      "Prodotto segnaposto per mostrare il layout della pagina prodotto. T-shirt squadrata con spalla scesa, piccolo logo sul petto e grande stampa statement sulla schiena.",
    details: ["Segnaposto demo — tessuto definitivo da confermare da 22SIDE", "Vestibilità oversize squadrata (specifica demo)", "Logo sul petto + stampa sul retro", "Guida taglie disponibile al lancio"],
    collections: ["drop-001", "tops", "new-arrivals"],
    tags: ["tee", "t-shirt", "maglietta", "nero", "stampa", "black"],
    price: 45,
    sizes: APPAREL,
    stock: [3, 8, 12, 9, 4, 0],
    createdAt: "2026-11-02",
    alt: "Segnaposto demo: t-shirt nera stesa, stampa sul retro No Rules. Just Attitude.",
  },
  {
    code: "D-02",
    slug: "demo-oversized-hoodie-washed-black",
    title: "Felpa Oversize con Cappuccio Demo — Nero Slavato",
    productType: "Felpa con cappuccio",
    description:
      "Prodotto segnaposto. Felpa oversize con cappuccio, tasca a marsupio, logo rosso sul petto e stampa statement sul retro.",
    details: ["Segnaposto demo — composizione da confermare", "Vestibilità oversize, spalla scesa (specifica demo)", "Tasca a marsupio, coulisse piatte", "Stampa sul retro: NOT MADE TO FIT IN"],
    collections: ["drop-001", "tops", "new-arrivals"],
    tags: ["hoodie", "felpa", "cappuccio", "nero", "stampa"],
    price: 95,
    sizes: APPAREL,
    stock: [0, 4, 6, 7, 2, 1],
    createdAt: "2026-11-04",
    alt: "Segnaposto demo: felpa con cappuccio nero slavato stesa, stampa 22SIDE rossa sul petto.",
  },
  {
    code: "D-03",
    slug: "demo-crewneck-heather-grey",
    title: "Felpa Girocollo Demo — Grigio Melange",
    productType: "Felpa",
    description: "Prodotto segnaposto. Felpa girocollo classica con stampa sovrapposta sul petto e bordi a costine.",
    details: ["Segnaposto demo", "Vestibilità comoda (specifica demo)", "Collo, polsini e fondo a costine", "Stampa sovrapposta sul petto"],
    collections: ["drop-001", "tops"],
    tags: ["crewneck", "felpa", "girocollo", "grigio"],
    price: 79,
    sizes: APPAREL,
    stock: [2, 5, 5, 6, 3, 2],
    createdAt: "2026-10-20",
    alt: "Segnaposto demo: felpa girocollo grigio melange con stampa UNDERGROUND 22SIDE.",
  },
  {
    code: "D-04",
    slug: "demo-cargo-pant-asphalt",
    title: "Pantalone Cargo Demo — Asfalto",
    productType: "Pantaloni",
    description: "Prodotto segnaposto. Cargo a gamba larga con tasconi a soffietto sulla coscia.",
    details: ["Segnaposto demo", "Gamba larga e dritta (specifica demo)", "Tasconi cargo sulla coscia", "Taglie in vita al lancio"],
    collections: ["drop-001", "bottoms", "new-arrivals"],
    tags: ["cargo", "pantaloni", "grigio"],
    price: 110,
    sizes: ["28", "30", "32", "34", "36"],
    stock: [1, 4, 6, 3, 0],
    createdAt: "2026-11-06",
    alt: "Segnaposto demo: pantaloni cargo grigio asfalto stesi.",
  },
  {
    code: "D-05",
    slug: "demo-longsleeve-bone",
    title: "Maglia Manica Lunga Demo — Osso",
    productType: "Manica lunga",
    description: "Prodotto segnaposto. Maglia a manica lunga color osso con piccolo numero sul petto e stampa tipografica sul retro.",
    details: ["Segnaposto demo", "Vestibilità regolare (specifica demo)", "Numero sul petto + stampa sul retro"],
    collections: ["tops"],
    tags: ["longsleeve", "manica lunga", "maglia", "bianco"],
    price: 59,
    sizes: APPAREL,
    stock: [4, 6, 0, 5, 5, 2],
    createdAt: "2026-09-28",
    alt: "Segnaposto demo: maglia manica lunga color osso con piccolo 22 sul petto.",
  },
  {
    code: "D-06",
    slug: "demo-six-panel-cap-black",
    title: "Cappellino Six-Panel Demo — Nero",
    productType: "Cappellino",
    description: "Prodotto segnaposto. Cappellino a sei pannelli con logo frontale.",
    details: ["Segnaposto demo", "Cinturino regolabile (specifica demo)", "Logo frontale"],
    collections: ["headwear", "drop-001"],
    tags: ["cap", "cappellino", "cappello", "nero"],
    price: 39,
    sizes: ["Taglia unica"],
    stock: [14],
    createdAt: "2026-10-30",
    alt: "Segnaposto demo: cappellino nero a sei pannelli con logo 22SIDE bianco.",
  },
  {
    code: "D-07",
    slug: "demo-work-jacket-concrete",
    title: "Giacca Work Demo — Cemento",
    productType: "Giacca",
    description: "Prodotto segnaposto. Giacca ispirata al workwear con tasche sul petto e stampa sul retro.",
    details: ["Segnaposto demo", "Vestibilità squadrata (specifica demo)", "Abbottonatura frontale, tasche sul petto", "Stampa sul retro"],
    collections: ["tops", "new-arrivals"],
    tags: ["jacket", "giacca", "giubbotto", "grigio"],
    price: 149,
    sizes: ["S", "M", "L", "XL"],
    stock: [0, 0, 0, 0],
    createdAt: "2026-11-08",
    alt: "Segnaposto demo: giacca work grigio cemento stesa.",
  },
  {
    code: "D-08",
    slug: "demo-graphic-tee-bone",
    title: "T-shirt Grafica Demo — Osso",
    productType: "T-Shirt",
    description: "Prodotto segnaposto. T-shirt color osso con slogan rosso sul petto e grande grafica sovrapposta sul retro.",
    details: ["Segnaposto demo", "Vestibilità oversize (specifica demo)", "Slogan rosso sul petto, grande grafica sul retro"],
    collections: ["drop-001", "tops", "new-arrivals"],
    tags: ["tee", "t-shirt", "maglietta", "bianco", "stampa"],
    price: 49,
    sizes: APPAREL,
    stock: [5, 9, 11, 10, 6, 3],
    createdAt: "2026-11-10",
    alt: "Segnaposto demo: t-shirt color osso con stampa rossa YOU CREATE IT sul petto.",
  },
  {
    code: "D-09",
    slug: "demo-mesh-short-black",
    title: "Short in Rete Demo — Nero",
    productType: "Pantaloncini",
    description: "Prodotto segnaposto. Pantaloncino da basket ampio con numero sulla gamba.",
    details: ["Segnaposto demo", "Vestibilità ampia, sopra il ginocchio (specifica demo)", "Numero stampato sulla gamba"],
    collections: ["bottoms"],
    tags: ["shorts", "pantaloncini", "basket", "nero"],
    price: 55,
    sizes: ["S", "M", "L", "XL"],
    stock: [3, 3, 4, 2],
    createdAt: "2026-08-12",
    alt: "Segnaposto demo: short in rete neri con 22 stampato sulla gamba.",
  },
  {
    code: "D-10",
    slug: "demo-rib-beanie-blood",
    title: "Berretto a Costine Demo — Rosso Sangue",
    productType: "Berretto",
    description: "Prodotto segnaposto. Berretto a costine con risvolto, nel rosso del brand.",
    details: ["Segnaposto demo", "Maglia a costine con risvolto (specifica demo)", "Etichetta tessuta sul risvolto"],
    collections: ["headwear", "new-arrivals"],
    tags: ["beanie", "berretto", "cappello", "rosso"],
    price: 35,
    sizes: ["Taglia unica"],
    stock: [9],
    createdAt: "2026-11-12",
    alt: "Segnaposto demo: berretto a costine rosso sangue con etichetta 22SIDE bianca.",
  },
];

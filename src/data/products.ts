/**
 * CATALOGO DIMOSTRATIVO — NON SONO ARTICOLI REALI 22SIDE.
 *
 * Every product, price and stock level below is a placeholder used to make the
 * prototype navigable. Names are English (identity), descriptions Italian
 * (experience). Replaced by live Shopify data at integration time.
 */

import type { SizeGuideKey } from "./size-guides";

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
  sizeGuide: SizeGuideKey;
  createdAt: string;
  alt: string;
}

const APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];
const DEMO = "Prodotto dimostrativo — materiali definitivi da confermare";

export const rawProducts: RawProduct[] = [
  {
    code: "D-01",
    slug: "demo-heavyweight-tee-black",
    title: "Heavyweight Tee — Black",
    productType: "T-shirt",
    description:
      "Una t-shirt dal carattere deciso, pensata per chi interpreta lo streetwear senza seguire le regole. Linea squadrata, spalla scesa, logo piccolo sul petto e manifesto stampato sulla schiena.",
    details: [DEMO, "Vestibilità oversize dal taglio squadrato", "Logo sul petto, stampa No Rules. Just Attitude. sul retro", "Girocollo a costine"],
    collections: ["drop-001", "tops", "new-arrivals"],
    tags: ["tee", "t-shirt", "maglietta", "nero", "stampa", "black"],
    price: 45,
    sizes: APPAREL,
    stock: [3, 8, 12, 9, 4, 0],
    sizeGuide: "top",
    createdAt: "2026-11-02",
    alt: "Prodotto dimostrativo: t-shirt nera stesa, stampa sul retro No Rules. Just Attitude.",
  },
  {
    code: "D-02",
    slug: "demo-oversized-hoodie-washed-black",
    title: "Oversized Hoodie — Washed Black",
    productType: "Felpa con cappuccio",
    description:
      "La felpa delle notti lunghe. Volume generoso, nero slavato che sembra già vissuto, logo rosso sul petto e Not Made To Fit In sulla schiena.",
    details: [DEMO, "Vestibilità oversize, spalla scesa", "Tasca a marsupio, coulisse piatte", "Stampa sul retro: Not Made To Fit In"],
    collections: ["drop-001", "tops", "new-arrivals"],
    tags: ["hoodie", "felpa", "cappuccio", "nero", "stampa"],
    price: 95,
    sizes: APPAREL,
    stock: [0, 4, 6, 7, 2, 1],
    sizeGuide: "top",
    createdAt: "2026-11-04",
    alt: "Prodotto dimostrativo: felpa con cappuccio nero slavato stesa, stampa 22SIDE rossa sul petto.",
  },
  {
    code: "D-03",
    slug: "demo-crewneck-heather-grey",
    title: "Crewneck — Heather Grey",
    productType: "Felpa",
    description: "Un classico che non passa: girocollo grigio melange con stampa Underground sovrapposta sul petto. Si abbina a tutto, non somiglia a niente.",
    details: [DEMO, "Vestibilità comoda", "Collo, polsini e fondo a costine", "Stampa sovrapposta sul petto"],
    collections: ["drop-001", "tops"],
    tags: ["crewneck", "felpa", "girocollo", "grigio"],
    price: 79,
    sizes: APPAREL,
    stock: [2, 5, 5, 6, 3, 2],
    sizeGuide: "top",
    createdAt: "2026-10-20",
    alt: "Prodotto dimostrativo: felpa girocollo grigio melange con stampa UNDERGROUND 22SIDE.",
  },
  {
    code: "D-04",
    slug: "demo-cargo-pant-asphalt",
    title: "Cargo Pant — Asphalt",
    productType: "Pantaloni",
    description: "Gamba ampia e tasconi laterali: il cargo fatto per camminare tutta la notte. Il colore è quello dell’asfalto dopo la pioggia.",
    details: [DEMO, "Gamba larga e dritta", "Tasconi cargo a soffietto sulla coscia", "Taglie in vita"],
    collections: ["drop-001", "bottoms", "new-arrivals"],
    tags: ["cargo", "pantaloni", "grigio"],
    price: 110,
    sizes: ["28", "30", "32", "34", "36"],
    stock: [1, 4, 6, 3, 0],
    sizeGuide: "bottom",
    createdAt: "2026-11-06",
    alt: "Prodotto dimostrativo: pantaloni cargo grigio asfalto stesi.",
  },
  {
    code: "D-05",
    slug: "demo-longsleeve-bone",
    title: "Longsleeve — Bone",
    productType: "Manica lunga",
    description: "Manica lunga color osso, essenziale davanti e tipografica dietro. Il pezzo giusto per le mezze stagioni in città.",
    details: [DEMO, "Vestibilità regolare", "Numero sul petto, stampa tipografica sul retro"],
    collections: ["tops"],
    tags: ["longsleeve", "manica lunga", "maglia", "bianco"],
    price: 59,
    sizes: APPAREL,
    stock: [4, 6, 0, 5, 5, 2],
    sizeGuide: "top",
    createdAt: "2026-09-28",
    alt: "Prodotto dimostrativo: maglia manica lunga color osso con piccolo 22 sul petto.",
  },
  {
    code: "D-06",
    slug: "demo-six-panel-cap-black",
    title: "Six-Panel Cap — Black",
    productType: "Cappellino",
    description: "Sei pannelli, visiera curva, logo frontale. Il dettaglio che chiude il look.",
    details: [DEMO, "Cinturino regolabile sul retro", "Logo ricamato sul fronte"],
    collections: ["headwear", "drop-001"],
    tags: ["cap", "cappellino", "cappello", "nero"],
    price: 39,
    sizes: ["Taglia unica"],
    stock: [14],
    sizeGuide: "one-size",
    createdAt: "2026-10-30",
    alt: "Prodotto dimostrativo: cappellino nero a sei pannelli con logo 22SIDE bianco.",
  },
  {
    code: "D-07",
    slug: "demo-work-jacket-concrete",
    title: "Work Jacket — Concrete",
    productType: "Giacca",
    description: "Ispirata alle giacche da lavoro, tagliata per la strada. Tasche sul petto, abbottonatura frontale e stampa 22SIDE Workwear sul retro.",
    details: [DEMO, "Vestibilità squadrata", "Abbottonatura frontale, tasche applicate sul petto", "Stampa sul retro"],
    collections: ["tops", "new-arrivals"],
    tags: ["jacket", "giacca", "giubbotto", "grigio"],
    price: 149,
    sizes: ["S", "M", "L", "XL"],
    stock: [0, 0, 0, 0],
    sizeGuide: "top",
    createdAt: "2026-11-08",
    alt: "Prodotto dimostrativo: giacca da lavoro grigio cemento stesa.",
  },
  {
    code: "D-08",
    slug: "demo-graphic-tee-bone",
    title: "Graphic Tee — Bone",
    productType: "T-shirt",
    description: "Davanti, una frase in rosso. Dietro, un 22 enorme che non passa inosservato. T-shirt color osso dal volume ampio.",
    details: [DEMO, "Vestibilità oversize", "Slogan rosso sul petto, grafica XL sul retro"],
    collections: ["drop-001", "tops", "new-arrivals"],
    tags: ["tee", "t-shirt", "maglietta", "bianco", "stampa"],
    price: 49,
    sizes: APPAREL,
    stock: [5, 9, 11, 10, 6, 3],
    sizeGuide: "top",
    createdAt: "2026-11-10",
    alt: "Prodotto dimostrativo: t-shirt color osso con stampa rossa YOU CREATE IT sul petto.",
  },
  {
    code: "D-09",
    slug: "demo-mesh-short-black",
    title: "Mesh Short — Black",
    productType: "Pantaloncini",
    description: "Il pantaloncino da campetto, in rete traspirante e taglio ampio. Numero 22 stampato sulla gamba.",
    details: [DEMO, "Vestibilità ampia, sopra il ginocchio", "Elastico in vita con coulisse", "Numero stampato sulla gamba"],
    collections: ["bottoms"],
    tags: ["shorts", "pantaloncini", "basket", "nero"],
    price: 55,
    sizes: ["S", "M", "L", "XL"],
    stock: [3, 3, 4, 2],
    sizeGuide: "bottom",
    createdAt: "2026-08-12",
    alt: "Prodotto dimostrativo: short in rete neri con 22 stampato sulla gamba.",
  },
  {
    code: "D-10",
    slug: "demo-rib-beanie-blood",
    title: "Rib Beanie — Blood Red",
    productType: "Berretto",
    description: "Berretto a costine con risvolto, nel rosso del brand. Il segnale che si vede da un isolato di distanza.",
    details: [DEMO, "Maglia a costine con risvolto", "Etichetta tessuta sul risvolto"],
    collections: ["headwear", "new-arrivals"],
    tags: ["beanie", "berretto", "cappello", "rosso"],
    price: 35,
    sizes: ["Taglia unica"],
    stock: [9],
    sizeGuide: "one-size",
    createdAt: "2026-11-12",
    alt: "Prodotto dimostrativo: berretto a costine rosso sangue con etichetta 22SIDE bianca.",
  },
];

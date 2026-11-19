/**
 * CATALOGO UFFICIALE 22SIDE — foto fornite dal brand (public/media/products/real).
 *
 * Prezzi, taglie, disponibilità e composizione NON sono ancora stati comunicati:
 * finché `price` / `sizes` sono null il prodotto mostra "Prezzo da confermare"
 * e non si può acquistare. Per attivarlo basta compilare questi campi.
 * Nomi in inglese (identità), descrizioni in italiano (esperienza), basate solo
 * su ciò che si vede nelle foto.
 */
import type { SizeGuideKey } from "./size-guides";

export interface RawImage {
  file: string;
  alt: string;
}

export interface RawProduct {
  code: string;
  slug: string;
  title: string;
  productType: string;
  description: string;
  details: string[];
  collections: string[];
  tags: string[];
  /** EUR. null = da confermare. */
  price: number | null;
  /** null = taglie da confermare. */
  sizes: string[] | null;
  /** Stock per taglia (stesso ordine di `sizes`). Se assente: disponibile. */
  stock?: number[];
  sizeGuide: SizeGuideKey;
  createdAt: string;
  images: RawImage[];
}

const TBC = "Tessuto, vestibilità e taglie in arrivo";
const ALL = ["new-arrivals"];

export const rawProducts: RawProduct[] = [
  {
    code: "22-01",
    slug: "cash-mouth-layered-tee",
    title: "Cash Mouth Layered Tee — Black / Camo",
    productType: "T-shirt layered",
    description:
      "T-shirt nera con maniche lunghe camouflage sovrapposte. Davanti, una bocca leopardata con grillz di diamanti e una mazzetta di dollari, incorniciata da un bordo di strass.",
    details: ["Corpo nero, maniche lunghe effetto layered in camouflage", "Grande stampa frontale con cornice di strass", TBC],
    collections: [...ALL, "drop-001", "tops", "graphic-tees", "long-sleeve"],
    tags: ["tee", "t-shirt", "maglietta", "manica lunga", "camo", "nero", "stampa", "strass"],
    price: null,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T01",
    images: [{ file: "cash-mouth-layered-tee-1", alt: "Ragazzo con t-shirt nera con stampa bocca leopardata e maniche camouflage." }],
  },
  {
    code: "22-02",
    slug: "chase-light-longsleeve",
    title: "Chase Light Longsleeve — White",
    productType: "Manica lunga",
    description:
      "Manica lunga bianca con collo alto a costine. Davanti un angelo bendato tra le scritte Chase Light e Break Fear; sulle maniche, il lettering e una croce.",
    details: ["Bianco, collo alto a costine", "Stampa frontale e stampe su entrambe le maniche", TBC],
    collections: [...ALL, "tops", "long-sleeve"],
    tags: ["longsleeve", "manica lunga", "maglia", "bianco", "angelo", "stampa"],
    price: null,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T02",
    images: [{ file: "chase-light-longsleeve-1", alt: "Ragazzo con maglia bianca a manica lunga stampa Chase Light Break Fear." }],
  },
  {
    code: "22-03",
    slug: "heaven-tee",
    title: "Heaven Tee — Black",
    productType: "T-shirt",
    description:
      "T-shirt nera oversize con la scritta Heaven borchiata in stile metal e un angelo bendato che tiene una bilancia con due mazzette di banconote.",
    details: ["Nero, taglio oversize", "Lettering Heaven con borchie, stampa frontale", TBC],
    collections: [...ALL, "drop-001", "tops", "graphic-tees"],
    tags: ["tee", "t-shirt", "maglietta", "nero", "angelo", "borchie", "stampa"],
    price: null,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T03",
    images: [
      { file: "heaven-tee-1", alt: "Ragazzo con t-shirt nera Heaven con angelo bendato e bilancia." },
      { file: "heaven-tee-2", alt: "Outfit completo: t-shirt Heaven nera e pantalone tuta nero." },
    ],
  },
  {
    code: "22-04",
    slug: "rise-with-faith-tee",
    title: "Rise With Faith Tee — Black",
    productType: "T-shirt",
    description: "T-shirt nera con la scritta Rise with Faith in corsivo e un piccolo angelo seduto con una colomba bianca.",
    details: ["Nero, taglio oversize", "Stampa frontale con lettering e dettagli in strass", TBC],
    collections: [...ALL, "tops", "graphic-tees"],
    tags: ["tee", "t-shirt", "maglietta", "nero", "angelo", "colomba", "stampa"],
    price: null,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T04",
    images: [{ file: "rise-with-faith-tee-1", alt: "Ragazzo in un parcheggio con t-shirt nera Rise with Faith e jeans blu." }],
  },
  {
    code: "22-05",
    slug: "cash-grill-tee",
    title: "Cash Grill Tee — Black",
    productType: "T-shirt",
    description:
      "T-shirt nera con una grande bocca dai grillz d'argento che stringe un rotolo di dollari, una croce dorata con pietre e strass applicati su spalle e scollo.",
    details: ["Nero, taglio oversize", "Stampa frontale XL, strass su spalle e scollo", TBC],
    collections: [...ALL, "drop-001", "tops", "graphic-tees"],
    tags: ["tee", "t-shirt", "maglietta", "nero", "dollari", "croce", "strass", "stampa"],
    price: null,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T05",
    images: [
      { file: "cash-grill-tee-1", alt: "Ragazzo con t-shirt nera con stampa bocca, dollari e croce dorata." },
      { file: "cash-grill-tee-2", alt: "Outfit completo: t-shirt Cash Grill nera e jeans neri larghi." },
    ],
  },
  {
    code: "22-06",
    slug: "eternity-tee",
    title: "Eternity Tee — White",
    productType: "T-shirt",
    description:
      "T-shirt bianca con la scritta Eternity borchiata e la Statua della Libertà su una New York in rovina. In basso, la firma Our Eternal City. Retro pulito.",
    details: ["Bianco, taglio oversize, retro senza stampa", "Grande stampa frontale con lettering borchiato", TBC],
    collections: [...ALL, "drop-001", "tops", "graphic-tees"],
    tags: ["tee", "t-shirt", "maglietta", "bianco", "new york", "statua della libertà", "stampa"],
    price: null,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T06",
    images: [
      { file: "eternity-tee-1", alt: "Ragazzo con t-shirt bianca Eternity con la Statua della Libertà." },
      { file: "eternity-tee-2", alt: "Outfit completo: t-shirt Eternity bianca e jeans blu larghi." },
      { file: "eternity-tee-back", alt: "Retro della t-shirt Eternity bianca, senza stampa." },
    ],
  },
  {
    code: "22-07",
    slug: "cash-lips-longsleeve",
    title: "Cash Lips Longsleeve — White",
    productType: "Manica lunga",
    description: "Manica lunga bianca con una bocca rivestita di banconote, denti con croci e un crocifisso. Strass applicati intorno allo scollo.",
    details: ["Bianco", "Stampa frontale XL, strass sullo scollo", TBC],
    collections: [...ALL, "tops", "long-sleeve"],
    tags: ["longsleeve", "manica lunga", "maglia", "bianco", "dollari", "croce", "strass", "stampa"],
    price: null,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T07",
    images: [{ file: "cash-lips-longsleeve-1", alt: "Ragazzo con maglia bianca a manica lunga con stampa bocca e banconote." }],
  },
  {
    code: "22-08",
    slug: "baggy-jeans-washed-black",
    title: "Baggy Jeans — Washed Black",
    productType: "Jeans",
    description: "Jeans dal fit baggy in denim nero slavato, con cuciture sagomate sulle gambe e fondo ampio che cade sulle sneakers.",
    details: ["Denim nero effetto slavato", "Gamba larga, fit baggy", TBC],
    collections: [...ALL, "bottoms", "essentials"],
    tags: ["jeans", "denim", "baggy", "pantaloni", "nero"],
    price: null,
    sizes: null,
    sizeGuide: "bottom",
    createdAt: "2026-11-19T08",
    images: [
      { file: "baggy-jeans-washed-black-1", alt: "Jeans baggy neri slavati indossati, vista frontale." },
      { file: "cash-grill-tee-2", alt: "Outfit completo con jeans baggy neri slavati." },
    ],
  },
  {
    code: "22-09",
    slug: "wide-sweatpants-black",
    title: "Wide Sweatpants — Black",
    productType: "Pantalone tuta",
    description: "Pantalone tuta nero a gamba ampia, con pinces sul davanti e un lungo laccio in vita color panna.",
    details: ["Nero, laccio color panna", "Gamba ampia e dritta, pinces frontali", TBC],
    collections: [...ALL, "bottoms", "essentials"],
    tags: ["pantaloni", "tuta", "sweatpants", "nero"],
    price: null,
    sizes: null,
    sizeGuide: "bottom",
    createdAt: "2026-11-19T09",
    images: [
      { file: "wide-sweatpants-black-1", alt: "Pantalone tuta nero con laccio panna indossato, vista frontale." },
      { file: "heaven-tee-2", alt: "Outfit completo con pantalone tuta nero." },
    ],
  },
  {
    code: "22-10",
    slug: "baggy-jeans-vintage-blue",
    title: "Baggy Jeans — Vintage Blue",
    productType: "Jeans",
    description: "Jeans baggy blu scuro con lavaggio vintage: sfumature chiare su cosce e ginocchia e fondo ampio.",
    details: ["Denim blu con lavaggio vintage", "Gamba larga, fit baggy", TBC],
    collections: [...ALL, "drop-001", "bottoms", "essentials"],
    tags: ["jeans", "denim", "baggy", "pantaloni", "blu"],
    price: null,
    sizes: null,
    sizeGuide: "bottom",
    createdAt: "2026-11-19T10",
    images: [
      { file: "baggy-jeans-vintage-blue-1", alt: "Jeans baggy blu vintage indossati, vista frontale." },
      { file: "eternity-tee-back", alt: "Jeans baggy blu vintage, vista posteriore." },
    ],
  },
  {
    code: "22-11",
    slug: "cargo-jacket-black",
    title: "Cargo Jacket — Black",
    productType: "Giacca",
    description: "Giacca nera con zip, collo alto e due grandi tasche cargo con lacci sul petto. Polsini elasticizzati. Si abbina al Cargo Pant.",
    details: ["Nero, chiusura con zip, collo alto", "Tasche cargo frontali con lacci, polsini elastici", "Fa coppia con il Cargo Pant — Black", TBC],
    collections: [...ALL, "drop-001", "tops", "sets"],
    tags: ["giacca", "jacket", "cargo", "completo", "nero"],
    price: null,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T11",
    images: [
      { file: "cargo-jacket-black-1", alt: "Ragazzo con giacca cargo nera con tasche e lacci in un parcheggio giallo." },
      { file: "cargo-set-black-full", alt: "Completo cargo nero: giacca e pantalone." },
      { file: "cargo-set-black-back", alt: "Completo cargo nero, vista posteriore." },
    ],
  },
  {
    code: "22-12",
    slug: "cargo-pant-black",
    title: "Cargo Pant — Black",
    productType: "Pantalone cargo",
    description: "Pantalone cargo nero a gamba ampia con quattro tasconi e lacci pendenti, coulisse in vita. Si abbina alla Cargo Jacket.",
    details: ["Nero, coulisse in vita", "Quattro tasche cargo con lacci, gamba ampia", "Fa coppia con la Cargo Jacket — Black", TBC],
    collections: [...ALL, "drop-001", "bottoms", "sets", "essentials"],
    tags: ["pantaloni", "cargo", "completo", "nero"],
    price: null,
    sizes: null,
    sizeGuide: "bottom",
    createdAt: "2026-11-19T12",
    images: [
      { file: "cargo-pant-black-1", alt: "Pantalone cargo nero con tasconi e lacci indossato." },
      { file: "cargo-set-black-full", alt: "Completo cargo nero: giacca e pantalone." },
      { file: "cargo-set-black-back", alt: "Completo cargo nero, vista posteriore." },
    ],
  },
  {
    code: "22-13",
    slug: "faded-zip-hoodie-grey",
    title: "Faded Zip Hoodie — Grey",
    productType: "Felpa con zip",
    description: "Felpa con cappuccio e zip in grigio con sfumature scure lungo le cuciture, effetto vissuto. Si abbina ai Faded Sweatpants.",
    details: ["Grigio con sfumature scure", "Zip intera, cappuccio con coulisse, tasche frontali", "Fa coppia con i Faded Sweatpants — Grey", TBC],
    collections: [...ALL, "drop-001", "tops", "sets"],
    tags: ["hoodie", "felpa", "zip", "cappuccio", "completo", "grigio"],
    price: null,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T13",
    images: [
      { file: "faded-zip-hoodie-1", alt: "Felpa grigia sfumata con zip e cappuccio indossata." },
      { file: "faded-set-grey-full", alt: "Completo grigio sfumato: felpa con zip e pantalone tuta." },
    ],
  },
  {
    code: "22-14",
    slug: "faded-sweatpants-grey",
    title: "Faded Sweatpants — Grey",
    productType: "Pantalone tuta",
    description: "Pantalone tuta grigio a gamba dritta con le stesse sfumature della felpa e coulisse in vita. Si abbina alla Faded Zip Hoodie.",
    details: ["Grigio con sfumature scure", "Gamba dritta, coulisse in vita", "Fa coppia con la Faded Zip Hoodie — Grey", TBC],
    collections: [...ALL, "bottoms", "sets", "essentials"],
    tags: ["pantaloni", "tuta", "sweatpants", "completo", "grigio"],
    price: null,
    sizes: null,
    sizeGuide: "bottom",
    createdAt: "2026-11-19T14",
    images: [
      { file: "faded-sweatpants-1", alt: "Pantalone tuta grigio sfumato indossato." },
      { file: "faded-set-grey-full", alt: "Completo grigio sfumato: felpa con zip e pantalone tuta." },
    ],
  },
];

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
  /** What the shot shows (Fig. caption). Never derived from the image position. */
  caption: string;
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
    collections: [...ALL, "tops", "graphic-tees", "long-sleeve"],
    tags: ["tee", "t-shirt", "maglietta", "manica lunga", "camo", "nero", "stampa", "strass"],
    price: 15,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T01",
    images: [{ file: "cash-mouth-layered-tee-1", alt: "Ragazzo con t-shirt nera con stampa bocca leopardata e maniche camouflage.", caption: "Fronte" }],
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
    price: 20,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T02",
    images: [{ file: "chase-light-longsleeve-1", alt: "Ragazzo con maglia bianca a manica lunga stampa Chase Light Break Fear.", caption: "Fronte" }],
  },
  {
    code: "22-03",
    slug: "heaven-tee",
    title: "Heaven Tee — Black",
    productType: "T-shirt",
    description:
      "T-shirt nera oversize con la scritta Heaven borchiata in stile metal e un angelo bendato che tiene una bilancia con due mazzette di banconote.",
    details: ["Nero, taglio oversize", "Lettering Heaven con borchie, stampa frontale", TBC],
    collections: [...ALL, "tops", "graphic-tees"],
    tags: ["tee", "t-shirt", "maglietta", "nero", "angelo", "borchie", "stampa"],
    price: 15,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T03",
    images: [
      { file: "heaven-tee-1", alt: "Ragazzo con t-shirt nera Heaven con angelo bendato e bilancia.", caption: "Fronte" },
      { file: "heaven-tee-2", alt: "Outfit completo: t-shirt Heaven nera e pantalone tuta nero.", caption: "Outfit" },
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
    price: 15,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T04",
    images: [{ file: "rise-with-faith-tee-1", alt: "Ragazzo in un parcheggio con t-shirt nera Rise with Faith e jeans blu.", caption: "Fronte" }],
  },
  {
    code: "22-05",
    slug: "cash-grill-tee",
    title: "Cash Grill Tee — Black",
    productType: "T-shirt",
    description:
      "T-shirt nera con una grande bocca dai grillz d'argento che stringe un rotolo di dollari, una croce dorata con pietre e strass applicati su spalle e scollo.",
    details: ["Nero, taglio oversize", "Stampa frontale XL, strass su spalle e scollo", TBC],
    collections: [...ALL, "tops", "graphic-tees"],
    tags: ["tee", "t-shirt", "maglietta", "nero", "dollari", "croce", "strass", "stampa"],
    price: 15,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T05",
    images: [
      { file: "cash-grill-tee-1", alt: "Ragazzo con t-shirt nera con stampa bocca, dollari e croce dorata.", caption: "Fronte" },
      { file: "cash-grill-tee-2", alt: "Outfit completo: t-shirt Cash Grill nera e jeans neri larghi.", caption: "Outfit" },
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
    collections: [...ALL, "tops", "graphic-tees"],
    tags: ["tee", "t-shirt", "maglietta", "bianco", "new york", "statua della libertà", "stampa"],
    price: 15,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T06",
    images: [
      { file: "eternity-tee-1", alt: "Ragazzo con t-shirt bianca Eternity con la Statua della Libertà.", caption: "Fronte" },
      { file: "eternity-tee-2", alt: "Outfit completo: t-shirt Eternity bianca e jeans blu larghi.", caption: "Outfit" },
      { file: "eternity-tee-back", alt: "Retro della t-shirt Eternity bianca, senza stampa.", caption: "Retro" },
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
    price: 20,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T07",
    images: [{ file: "cash-lips-longsleeve-1", alt: "Ragazzo con maglia bianca a manica lunga con stampa bocca e banconote.", caption: "Fronte" }],
  },
  {
    code: "22-08",
    slug: "baggy-jeans-washed-black",
    title: "Baggy Jeans — Washed Black",
    productType: "Jeans",
    description: "Jeans dal fit baggy in denim nero slavato, con cuciture sagomate sulle gambe e fondo ampio che cade sulle sneakers.",
    details: ["Denim nero effetto slavato", "Gamba larga, fit baggy", TBC],
    collections: [...ALL, "bottoms"],
    tags: ["jeans", "denim", "baggy", "pantaloni", "nero"],
    price: 30,
    sizes: null,
    sizeGuide: "bottom",
    createdAt: "2026-11-19T08",
    images: [
      { file: "baggy-jeans-washed-black-1", alt: "Jeans baggy neri slavati indossati, vista frontale.", caption: "Fronte" },
      { file: "cash-grill-tee-2", alt: "Outfit completo con jeans baggy neri slavati.", caption: "Outfit" },
    ],
  },
  {
    code: "22-09",
    slug: "wide-sweatpants-black",
    title: "Wide Sweatpants — Black",
    productType: "Pantalone tuta",
    description: "Pantalone tuta nero a gamba ampia, con pinces sul davanti e un lungo laccio in vita color panna.",
    details: ["Nero, laccio color panna", "Gamba ampia e dritta, pinces frontali", TBC],
    collections: [...ALL, "bottoms"],
    tags: ["pantaloni", "tuta", "sweatpants", "nero"],
    price: 25,
    sizes: null,
    sizeGuide: "bottom",
    createdAt: "2026-11-19T09",
    images: [
      { file: "wide-sweatpants-black-1", alt: "Pantalone tuta nero con laccio panna indossato, vista frontale.", caption: "Fronte" },
      { file: "heaven-tee-2", alt: "Outfit completo con pantalone tuta nero.", caption: "Outfit" },
    ],
  },
  {
    code: "22-10",
    slug: "baggy-jeans-vintage-blue",
    title: "Baggy Jeans — Vintage Blue",
    productType: "Jeans",
    description: "Jeans baggy blu scuro con lavaggio vintage: sfumature chiare su cosce e ginocchia e fondo ampio.",
    details: ["Denim blu con lavaggio vintage", "Gamba larga, fit baggy", TBC],
    collections: [...ALL, "bottoms"],
    tags: ["jeans", "denim", "baggy", "pantaloni", "blu"],
    price: 30,
    sizes: null,
    sizeGuide: "bottom",
    createdAt: "2026-11-19T10",
    images: [
      { file: "baggy-jeans-vintage-blue-1", alt: "Jeans baggy blu vintage indossati, vista frontale.", caption: "Fronte" },
    ],
  },
  {
    code: "22-11",
    slug: "cargo-set-black",
    title: "Cargo Set — Black",
    productType: "Completo",
    description:
      "Coordinato nero giacca + pantalone cargo. La giacca ha zip, collo alto, due grandi tasche cargo con lacci sul petto e polsini elasticizzati; il pantalone, a gamba ampia, ha quattro tasconi con lacci pendenti e coulisse in vita.",
    details: [
      "Completo: giacca + pantalone cargo",
      "Giacca: zip, collo alto, tasche cargo con lacci, polsini elastici",
      "Pantalone: quattro tasche cargo con lacci, coulisse in vita, gamba ampia",
      TBC,
    ],
    collections: [...ALL, "sets"],
    tags: ["completo", "coordinato", "set", "giacca", "jacket", "pantaloni", "cargo", "nero"],
    price: 60,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T11",
    images: [
      { file: "cargo-set-black-full", alt: "Completo cargo nero, giacca e pantalone, in un parcheggio giallo.", caption: "Completo" },
      { file: "cargo-jacket-black-1", alt: "Giacca del completo cargo nero con tasche e lacci.", caption: "Giacca" },
      { file: "cargo-pant-black-1", alt: "Pantalone del completo cargo nero con tasconi e lacci.", caption: "Pantalone" },
      { file: "cargo-set-black-back", alt: "Completo cargo nero, vista posteriore.", caption: "Retro" },
    ],
  },
  {
    code: "22-12",
    slug: "faded-tracksuit-grey",
    title: "Faded Tracksuit — Grey",
    productType: "Completo",
    description:
      "Coordinato grigio felpa con zip + pantalone tuta, con sfumature scure lungo le cuciture per un effetto vissuto. Felpa con cappuccio e coulisse, pantalone a gamba dritta con coulisse in vita.",
    details: [
      "Completo: felpa con zip + pantalone tuta",
      "Grigio con sfumature scure",
      "Felpa: zip intera, cappuccio con coulisse, tasche frontali",
      "Pantalone: gamba dritta, coulisse in vita",
      TBC,
    ],
    collections: [...ALL, "sets"],
    tags: ["completo", "coordinato", "set", "tuta", "tracksuit", "felpa", "hoodie", "zip", "pantaloni", "grigio"],
    price: 45,
    sizes: null,
    sizeGuide: "top",
    createdAt: "2026-11-19T12",
    images: [
      { file: "faded-set-grey-full", alt: "Completo grigio sfumato, felpa con zip e pantalone tuta.", caption: "Completo" },
      { file: "faded-zip-hoodie-1", alt: "Felpa con zip del completo grigio sfumato.", caption: "Felpa" },
      { file: "faded-sweatpants-1", alt: "Pantalone tuta del completo grigio sfumato.", caption: "Pantalone" },
    ],
  },
];

/**
 * Site copy & navigation (Italian). In Shopify these become section settings /
 * blocks and linklists (menus) — keep copy out of components.
 *
 * Brand lines (slogan, "Not made to fit in.", "You don't follow the side…",
 * "Enter the side") stay in English on purpose: they are part of the identity.
 */
export const site = {
  name: "22SIDE",
  slogan: "No rules. Just attitude.",
  positioning: "Streetwear indipendente",
  instagram: "https://www.instagram.com/22sideshop/",
  instagramHandle: "@22sideshop",
  demoNotice:
    "Prototipo demo — prodotti, prezzi e disponibilità sono segnaposto, non merce reale 22SIDE. Il checkout è disattivato.",
};

export const mainNav = [
  { label: "Shop", href: "/shop" },
  { label: "Novità", href: "/new-arrivals" },
  { label: "Collezioni", href: "/collections" },
  { label: "Chi siamo", href: "/about" },
] as const;

export const home = {
  intro: {
    cta: "Enter the side",
  },
  hero: {
    issue: "Numero 22 — Turno di notte",
    lineOne: "No rules.",
    lineTwo: "Just attitude.",
    sub: "Per chi le regole le scavalca con lo skate, fa tardi e si veste a volume alto. Streetwear indipendente, dritto dal blocco.",
    primaryCta: { label: "Scopri il drop", href: "/collections/drop-001" },
    secondaryCta: { label: "La cultura", href: "#culture" },
    marquee: ["No rules", "Just attitude", "Nuovo drop", "Prendilo prima che finisca", "Underground NYC", "La tua crew, il tuo side", "22SIDE®"],
  },
  statement: {
    index: "03",
    label: "Manifesto",
    headline: "Not made to fit in.",
    body: "Più che vestiti. Una prospettiva diversa. Un'attitudine indipendente, nata dalla cultura di strada.",
    aside:
      "Fatto per chi non ha mai chiesto il permesso. Cotone pesante, stampe che si fanno sentire, un po' grezzo ai bordi — come la tua crew.",
  },
  drop: {
    index: "04",
    label: "Ultimo drop",
    title: "Drop 001 — Turno di notte",
    cta: { label: "Vedi tutto il drop", href: "/collections/drop-001" },
  },
  culture: {
    index: "05",
    label: "Cultura underground",
    title: "Appunti dall'underground",
    intro:
      "Prima del drop c'è la città: il sibilo delle porte del treno, le cisterne sui tetti contro un cielo bianco, una scala antincendio che diventa un palco. Sono le immagini a cui torniamo sempre.",
    quote: "La strada non ti dà uno stile. Ti dà un punto di vista.",
    notes: [
      { media: "subway", fig: "Fig. 01", caption: "Ultimo treno verso downtown. La banchina è la passerella." },
      { media: "waterTowers", fig: "Fig. 02", caption: "Skyline dai tetti. Giganti di legno che fanno la guardia." },
      { media: "tiles", fig: "Fig. 03", caption: "22 Side St. Una fermata che esiste solo se la conosci." },
      { media: "fireEscape", fig: "Fig. 04", caption: "Scale di ferro, muri di mattoni. Notti d'estate fuori dalla finestra." },
      { media: "chainlink", fig: "Fig. 05", caption: "Al campetto dopo il buio. Le luci della città dietro la rete." },
    ],
    columns: [
      "L'hip-hop della golden age ha insegnato a una generazione che puoi costruire un mondo intero con quello che la città lascia indietro: un giradischi, un muro, un microfono in prestito. Quello spirito — pieno di risorse, rumoroso, orgogliosamente indipendente — è il nostro progetto.",
      "La grinta della East Coast, lo swag della West Coast e le silhouette oversize che venivano con entrambe. Citiamo quell'epoca, non la ripetiamo. Anni '90 reinventati, tagliati per oggi.",
    ],
  },
  shop: {
    index: "06",
    label: "Shop la collezione",
    title: "Scegli il tuo side",
    note: "Cinque capitoli. Un'unica attitudine. Scegline uno e buttati.",
    cta: { label: "Esplora tutti i prodotti", href: "/shop" },
  },
  final: {
    lineOne: "You don't follow the side.",
    lineTwo: "You create it.",
  },
};

export const about = {
  title: "L'altro lato della strada",
  intro:
    "22SIDE è un brand di streetwear indipendente. Nessun investitore che detta le regole, nessuna previsione di tendenza — solo un punto di vista nato dalla cultura di strada americana, dall'underground di New York e dalla golden age dell'hip-hop.",
  chapters: [
    {
      n: "01",
      title: "Indipendenti per scelta",
      body: "Indipendenti vuol dire che ogni decisione è nostra: cosa facciamo, che faccia ha, quando esce. È più lento. È più difficile. È l'unico modo che conosciamo.",
    },
    {
      n: "02",
      title: "Cresciuti nella cultura",
      body: "Gradini di Brooklyn, treni a tarda notte, mixtape passati di mano in mano, East e West Coast sempre in dialogo. Siamo cresciuti guardando gli anni '90 e non abbiamo mai distolto lo sguardo.",
    },
    {
      n: "03",
      title: "No rules. Just attitude.",
      body: "Il nostro slogan non è una tagline, è un filtro. Se un capo potrebbe essere di chiunque, non è nostro.",
    },
  ],
};

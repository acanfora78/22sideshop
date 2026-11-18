/**
 * Site copy & navigation.
 *
 * LANGUAGE STRATEGY — "English for identity, Italian for experience":
 *   EN → headlines, section titles, slogans, editorial/campaign titles,
 *        product names, short decorative phrases (stickers, marquees, signage).
 *   IT → every description, detail, functional label, button that buys,
 *        cart / shipping / returns / support, empty states, errors, microcopy.
 * Never translate the brand slogans.
 *
 * In Shopify these become section settings / blocks and linklists.
 */
export const site = {
  name: "22SIDE",
  slogan: "No rules. Just attitude.",
  positioning: "Independent Streetwear",
  station: "22 Side Street",
  line: "22",
  instagram: "https://www.instagram.com/22sideshop/",
  instagramHandle: "@22sideshop",
  demoNotice:
    "Prototipo dimostrativo: prodotti, prezzi e disponibilità sono segnaposto, non articoli reali 22SIDE. Il pagamento non è attivo.",
};

/** Functional navigation stays Italian for clarity. */
export const mainNav = [
  { label: "Shop", href: "/shop" },
  { label: "Novità", href: "/new-arrivals" },
  { label: "Collezioni", href: "/collections" },
  { label: "Chi siamo", href: "/about" },
] as const;

/** Station names shown by the "Next stop" page transition. */
export const stops: { match: (p: string) => boolean; name: string }[] = [
  { match: (p) => p === "/", name: "The Movement" },
  { match: (p) => p.startsWith("/shop"), name: "The Whole Block" },
  { match: (p) => p.startsWith("/new-arrivals"), name: "New Arrivals" },
  { match: (p) => p.startsWith("/collections"), name: "Collections" },
  { match: (p) => p.startsWith("/products"), name: "The Fitting Room" },
  { match: (p) => p.startsWith("/about"), name: "The Other Side" },
  { match: (p) => p.startsWith("/cart"), name: "The Counter" },
  { match: (p) => p.startsWith("/search"), name: "Lost & Found" },
];

export const home = {
  arrival: {
    caption: "Line 22 — last train — 02:22 AM",
    direction: "Downtown & the underground",
    cta: "Enter the side",
    skip: "Salta l’intro",
    soundOn: "Audio on",
    soundOff: "Audio off",
  },
  route: [
    { id: "arrival", label: "The Movement" },
    { id: "manifesto", label: "Manifesto" },
    { id: "why-22", label: "Why 22" },
    { id: "store", label: "The Store" },
    { id: "underground", label: "Underground Culture" },
    { id: "collection", label: "The Collection" },
    { id: "last-stop", label: "Last Stop" },
  ],
  hero: {
    issue: "Issue 22 — Night Shift",
    platform: "Platform 2",
    title: "The street is ours.",
    sub: "Streetwear indipendente cresciuto tra cemento, treni notturni e il suono della golden age. Per chi le regole non le segue: le riscrive.",
    primaryCta: { label: "Shop the drop", href: "/collections/drop-001" },
    secondaryCta: { label: "The culture", href: "#underground" },
    marquee: ["No rules", "Just attitude", "Fresh drop", "Built different", "Underground NYC", "Line 22", "22SIDE®"],
  },
  statement: {
    index: "02",
    label: "Manifesto",
    headline: "Not made to fit in.",
    body: "Più che vestiti. Una prospettiva diversa. Un’attitudine indipendente, nata dalla cultura di strada.",
    aside:
      "Ogni capo nasce per chi non ha mai chiesto il permesso: cotone pesante, stampe decise, nessun compromesso. Lo indossi una volta e capisci da che parte stai.",
    quoteLabel: "A different perspective.",
  },
  drop: {
    index: "03",
    label: "Latest Drop",
    title: "Drop 001",
    subtitle: "Night Shift",
    description:
      "Il primo capitolo, fotografato dopo il tramonto. Volumi ampi, stampe che si fanno notare, un solo segnale rosso. Prodotti dimostrativi per l’anteprima del layout.",
    cta: { label: "Scopri tutto il drop", href: "/collections/drop-001" },
  },
  underground: {
    index: "04",
    label: "Underground Culture",
    title: "Underground Culture",
    intro:
      "Prima del drop c’è la città. Cinque fermate lungo la Line 22: le immagini, i suoni e le persone che hanno dato forma al nostro modo di vestire.",
    chapters: [
      {
        n: "01",
        title: "The Block",
        media: "streetNight",
        caption: "Avenue, 02:14 AM",
        text: "Il blocco è il primo atelier. Marciapiedi bagnati, finestre accese, gli amici sotto casa: qui si decide cosa conta davvero.",
      },
      {
        n: "02",
        title: "The Train",
        media: "subway",
        caption: "Last train downtown",
        text: "Le notti passate in metropolitana. La banchina diventa passerella, il rumore dei binari una colonna sonora.",
      },
      {
        n: "03",
        title: "The Rooftops",
        media: "waterTowers",
        caption: "Water towers, sunrise",
        text: "Dai tetti la città sembra più piccola e i sogni più grandi. Cisterne di legno, antenne, un cielo bianco che non dorme mai.",
      },
      {
        n: "04",
        title: "The Sound",
        media: "turntable",
        caption: "Side A — Line 22 Sessions",
        text: "Un giradischi, un muro, un microfono in prestito. L’hip-hop della golden age ha insegnato a costruire un mondo con quello che c’era.",
      },
      {
        n: "05",
        title: "The Culture",
        media: "tiles",
        caption: "22 Side St. — mosaic",
        text: "East Coast e West Coast, silhouette oversize e attitudine. Citiamo quell’epoca senza ripeterla: anni ’90 reinventati, tagliati per oggi.",
      },
    ],
    quote: "The street doesn’t hand you a style. It hands you a point of view.",
  },
  shop: {
    index: "05",
    label: "Shop the Collection",
    title: "Pick your line.",
    note: "Sei linee, un’unica attitudine. Scegli da dove partire.",
    cta: { label: "Scopri tutti i prodotti", href: "/shop" },
  },
  final: {
    label: "Last Stop",
    lineOne: "You don't follow the side.",
    lineTwo: "You create it.",
    follow: "Seguici su Instagram",
  },
};

export const pages = {
  shop: {
    kicker: "Shop",
    title: "The Whole Block",
    description: "Tutti i capi in un unico posto. Catalogo dimostrativo: i prodotti sono segnaposto per l’anteprima del layout.",
    marquee: ["The whole block", "Independent streetwear", "No rules", "Just attitude"],
  },
  collections: { kicker: "Collezioni", title: "Choose your line" },
  cart: { kicker: "Carrello", title: "Il tuo carrello" },
  search: { kicker: "Cerca", title: "Lost & Found" },
  notFound: {
    kicker: "Errore 404",
    title: "Wrong stop.",
    text: "Questo treno qui non ferma. La pagina che cerchi è stata spostata o non esiste più.",
    home: "Torna alla home",
    shop: "Scopri tutti i prodotti",
  },
};

export const about = {
  title: "The other side of the street",
  intro:
    "22SIDE è un brand di streetwear indipendente. Nessun investitore che detta le regole, nessuna previsione di tendenza: solo un punto di vista nato dalla cultura di strada americana, dall’underground di New York e dalla golden age dell’hip-hop.",
  chapters: [
    {
      n: "01",
      title: "Independent by design",
      body: "Indipendenti significa che ogni decisione è nostra: cosa creiamo, che aspetto ha, quando esce. È una strada più lenta e più difficile. Ed è l’unica che conosciamo.",
    },
    {
      n: "02",
      title: "Raised on the culture",
      body: "I gradini di Brooklyn, i treni a tarda notte, i mixtape passati di mano in mano, East e West Coast sempre in dialogo. Siamo cresciuti guardando gli anni ’90 e non abbiamo mai distolto lo sguardo.",
    },
    {
      n: "03",
      title: "No rules. Just attitude.",
      body: "Il nostro slogan non è una frase a effetto, è un filtro. Se un capo potrebbe appartenere a chiunque, non appartiene a noi.",
    },
  ],
};

/** Customer-facing service copy (Italian). Placeholder until the live store. */
export const service = {
  shipping: "Spedizione disponibile in tutta Italia. Tempi e costi verranno comunicati con l’apertura del negozio online.",
  returns: "Le condizioni di reso e rimborso saranno pubblicate con il negozio online.",
  support: "Hai bisogno di aiuto? Scrivici su Instagram @22sideshop.",
  demoProduct:
    "Questo è un prodotto dimostrativo per l’anteprima dell’esperienza di acquisto. Immagini, prezzo e disponibilità non sono reali.",
};

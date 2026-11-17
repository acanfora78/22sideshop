/**
 * Site copy & navigation. In Shopify these become section settings / blocks
 * and linklists (menus) — keep copy out of components.
 */
export const site = {
  name: "22SIDE",
  slogan: "No rules. Just attitude.",
  positioning: "Independent Streetwear",
  instagram: "https://www.instagram.com/22sideshop/",
  instagramHandle: "@22sideshop",
  demoNotice:
    "Demo prototype — all products, prices and stock levels are placeholders, not real 22SIDE merchandise. Checkout is disabled.",
};

export const mainNav = [
  { label: "Shop", href: "/shop" },
  { label: "New", href: "/new-arrivals" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
] as const;

export const home = {
  intro: {
    frames: [
      { media: "streetNight", caption: "SCENE 01 — AVENUE, 02:14 AM" },
      { media: "subway", caption: "SCENE 02 — LAST TRAIN DOWNTOWN" },
      { media: "fireEscape", caption: "SCENE 03 — BRICK & IRON" },
      { media: "tiles", caption: "SCENE 04 — 22 SIDE ST" },
    ],
    cta: "Enter the side",
  },
  hero: {
    issue: "Issue 22 — Night Shift",
    lineOne: "No rules.",
    lineTwo: "Just attitude.",
    sub: "Independent streetwear raised on concrete, late trains and the golden-era sound that never left the block.",
    primaryCta: { label: "Shop the drop", href: "/collections/drop-001" },
    secondaryCta: { label: "The culture", href: "#culture" },
    marquee: ["No rules", "Just attitude", "Independent streetwear", "Underground NYC", "1990s reimagined", "22SIDE®"],
  },
  statement: {
    index: "03",
    label: "Manifesto",
    headline: "Not made to fit in.",
    body: "More than clothing. A different perspective. An independent attitude shaped by street culture.",
    aside:
      "We build pieces the way the block builds people: heavy, honest, a little rough at the edges. No trend reports. No permission asked.",
  },
  drop: {
    index: "04",
    label: "Latest Drop",
    title: "Drop 001 — Night Shift",
    cta: { label: "View the full drop", href: "/collections/drop-001" },
  },
  culture: {
    index: "05",
    label: "Underground Culture",
    title: "Field notes from the underground",
    intro:
      "Before the drop there is the city: the hiss of the train doors, water towers against a white sky, a fire escape that doubles as a stage. These are the frames we keep returning to.",
    quote: "The street doesn't hand you a style. It hands you a point of view.",
    notes: [
      { media: "subway", fig: "Fig. 01", caption: "Last train downtown. The platform is the runway." },
      { media: "waterTowers", fig: "Fig. 02", caption: "Rooftop skyline. Wooden giants keeping watch." },
      { media: "tiles", fig: "Fig. 03", caption: "22 Side St. A station that only exists if you know." },
      { media: "fireEscape", fig: "Fig. 04", caption: "Iron stairs, brick walls. Summer nights outside the window." },
      { media: "chainlink", fig: "Fig. 05", caption: "Courtside after dark. City lights behind the fence." },
    ],
    columns: [
      "Golden-era hip-hop taught a generation that you could build a whole world out of what the city left behind: a turntable, a wall, a borrowed mic. That spirit — resourceful, loud, proudly independent — is the blueprint.",
      "East Coast grit, West Coast swagger, and the oversized silhouettes that came with both. We reference the era, we don't replay it. 1990s reimagined, cut for now.",
    ],
  },
  shop: {
    index: "06",
    label: "Shop the Collection",
    title: "Pick your side",
    cta: { label: "Explore all products", href: "/shop" },
  },
  final: {
    lineOne: "You don't follow the side.",
    lineTwo: "You create it.",
  },
};

export const about = {
  title: "The other side of the street",
  intro:
    "22SIDE is an independent streetwear brand. No investors writing the rules, no trend forecasts — just a point of view shaped by American street culture, the New York underground and the golden age of hip-hop.",
  chapters: [
    {
      n: "01",
      title: "Independent by design",
      body: "Independent means every decision is ours: what we make, how it looks, when it drops. It's slower. It's harder. It's the only way we know how to do it.",
    },
    {
      n: "02",
      title: "Raised on the culture",
      body: "Brooklyn stoops, late trains, mixtapes passed hand to hand, East and West Coast in constant conversation. We grew up looking at the 90s and we still haven't looked away.",
    },
    {
      n: "03",
      title: "No rules. Just attitude.",
      body: "Our slogan isn't a tagline, it's a filter. If a piece could belong to anyone, it doesn't belong to us.",
    },
  ],
};

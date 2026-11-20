import type { Collection } from "@/lib/commerce/types";

/** Collezioni demo. Handles follow Shopify's URL convention (/collections/{handle}). */
export const collections: Collection[] = [
  {
    id: "gid://22side/Collection/new-arrivals",
    handle: "new-arrivals",
    title: "New Arrivals",
    kicker: "Fresh off the line",
    description: "Gli ultimi capi arrivati sul blocco.",
    image: { url: "/media/products/real/eternity-tee-2.webp", width: 1200, height: 1600, altText: "Outfit con t-shirt Eternity bianca e jeans blu." },
    sortOrder: "created-desc",
  },
  {
    id: "gid://22side/Collection/tops",
    handle: "tops",
    title: "Tops",
    kicker: "Heavy cotton, loud statements",
    description: "T-shirt e maniche lunghe.",
    image: { url: "/media/products/real/heaven-tee-1.webp", width: 1200, height: 1600, altText: "T-shirt Heaven nera indossata." },
    sortOrder: "manual",
  },
  {
    id: "gid://22side/Collection/bottoms",
    handle: "bottoms",
    title: "Bottoms",
    kicker: "Built for the pavement",
    description: "Jeans, cargo e pantaloni tuta tagliati per muoversi liberi.",
    image: { url: "/media/products/real/baggy-jeans-vintage-blue-1.webp", width: 1200, height: 1600, altText: "Jeans baggy blu vintage indossati." },
    sortOrder: "manual",
  },
  {
    id: "gid://22side/Collection/graphic-tees",
    handle: "graphic-tees",
    title: "Graphic Tees",
    kicker: "Loud on the back",
    description: "T-shirt con stampe grandi e messaggi diretti.",
    image: { url: "/media/products/real/cash-grill-tee-1.webp", width: 1200, height: 1600, altText: "T-shirt Cash Grill nera indossata." },
    sortOrder: "manual",
  },
  {
    id: "gid://22side/Collection/sets",
    handle: "sets",
    title: "The Sets",
    kicker: "Head to toe",
    description: "Coordinati venduti insieme: il Cargo Set nero e il Faded Tracksuit grigio.",
    image: { url: "/media/products/real/cargo-set-black-full.webp", width: 1200, height: 1600, altText: "Completo cargo nero in un parcheggio giallo." },
    sortOrder: "manual",
  },
  {
    id: "gid://22side/Collection/long-sleeve",
    handle: "long-sleeve",
    title: "Long Sleeve",
    kicker: "Layer up",
    description: "Maniche lunghe stampate per le mezze stagioni.",
    image: { url: "/media/products/real/chase-light-longsleeve-1.webp", width: 1200, height: 1600, altText: "Manica lunga Chase Light bianca indossata." },
    sortOrder: "manual",
  },
];

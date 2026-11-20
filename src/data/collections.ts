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
    id: "gid://22side/Collection/t-shirt",
    handle: "t-shirt",
    title: "T-shirt",
    kicker: "Loud on the front",
    description: "T-shirt in cotone con stampe grandi: angeli, bocche, dollari e la New York della Line 22.",
    image: { url: "/media/products/real/heaven-tee-1.webp", width: 1200, height: 1600, altText: "T-shirt Heaven nera indossata." },
    sortOrder: "manual",
  },
  {
    id: "gid://22side/Collection/longsleeve",
    handle: "longsleeve",
    title: "Longsleeve",
    kicker: "Layer up",
    description: "Maniche lunghe stampate, con grafiche anche sulle maniche.",
    image: { url: "/media/products/real/chase-light-longsleeve-1.webp", width: 1200, height: 1600, altText: "Manica lunga Chase Light bianca indossata." },
    sortOrder: "manual",
  },
  {
    id: "gid://22side/Collection/coordinati",
    handle: "coordinati",
    title: "Coordinati",
    kicker: "Head to toe",
    description: "Completi venduti insieme: il Cargo Set nero e il Faded Tracksuit grigio.",
    image: { url: "/media/products/real/cargo-set-black-full.webp", width: 1200, height: 1600, altText: "Completo cargo nero in un parcheggio giallo." },
    sortOrder: "manual",
  },
  {
    id: "gid://22side/Collection/pantaloni",
    handle: "pantaloni",
    title: "Pantaloni",
    kicker: "Built for the pavement",
    description: "Jeans baggy e pantaloni tuta larghi, tagliati per muoversi liberi.",
    image: { url: "/media/products/real/baggy-jeans-vintage-blue-1.webp", width: 1200, height: 1600, altText: "Jeans baggy blu vintage indossati." },
    sortOrder: "manual",
  },
];

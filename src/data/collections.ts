import { media } from "@/content/media";
import type { Collection } from "@/lib/commerce/types";

/** Collezioni demo. Handles follow Shopify's URL convention (/collections/{handle}). */
export const collections: Collection[] = [
  {
    id: "gid://demo/Collection/new-arrivals",
    handle: "new-arrivals",
    title: "New Arrivals",
    kicker: "Fresh off the line",
    description: "Gli ultimi capi arrivati sul blocco. Selezione dimostrativa.",
    image: media.subway,
    sortOrder: "created-desc",
  },
  {
    id: "gid://demo/Collection/drop-001",
    handle: "drop-001",
    title: "Drop 001",
    kicker: "Night Shift",
    description: "Il primo capitolo, fotografato dopo il tramonto. Capsule dimostrativa per l’anteprima della collezione.",
    image: media.streetNight,
    sortOrder: "manual",
  },
  {
    id: "gid://demo/Collection/tops",
    handle: "tops",
    title: "Tops",
    kicker: "Heavy cotton, loud statements",
    description: "T-shirt, felpe, girocollo e capispalla. Selezione dimostrativa.",
    image: media.fireEscape,
    sortOrder: "manual",
  },
  {
    id: "gid://demo/Collection/bottoms",
    handle: "bottoms",
    title: "Bottoms",
    kicker: "Built for the pavement",
    description: "Cargo e pantaloncini tagliati per muoversi liberi. Selezione dimostrativa.",
    image: media.chainlink,
    sortOrder: "manual",
  },
  {
    id: "gid://demo/Collection/headwear",
    handle: "headwear",
    title: "Headwear",
    kicker: "Top it off",
    description: "Cappellini e berretti. Selezione dimostrativa.",
    image: media.waterTowers,
    sortOrder: "manual",
  },
];

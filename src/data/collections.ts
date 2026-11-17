import { media } from "@/content/media";
import type { Collection } from "@/lib/commerce/types";

/** Collezioni demo. Handles follow Shopify's URL convention (/collections/{handle}). */
export const collections: Collection[] = [
  {
    id: "gid://demo/Collection/new-arrivals",
    handle: "new-arrivals",
    title: "Novità",
    kicker: "Appena usciti",
    description: "Gli ultimi pezzi arrivati sul blocco. Selezione demo.",
    image: media.subway,
    sortOrder: "created-desc",
  },
  {
    id: "gid://demo/Collection/drop-001",
    handle: "drop-001",
    title: "Drop 001",
    kicker: "Turno di notte",
    description: "Il primo capitolo, scattato dopo il tramonto. Capsule demo per mostrare il layout della collezione.",
    image: media.streetNight,
    sortOrder: "manual",
  },
  {
    id: "gid://demo/Collection/tops",
    handle: "tops",
    title: "Top",
    kicker: "Cotone pesante, messaggi forti",
    description: "T-shirt, felpe, girocollo e capispalla. Selezione demo.",
    image: media.fireEscape,
    sortOrder: "manual",
  },
  {
    id: "gid://demo/Collection/bottoms",
    handle: "bottoms",
    title: "Pantaloni",
    kicker: "Fatti per l'asfalto",
    description: "Cargo e short tagliati per muoversi liberi. Selezione demo.",
    image: media.chainlink,
    sortOrder: "manual",
  },
  {
    id: "gid://demo/Collection/headwear",
    handle: "headwear",
    title: "Cappelli",
    kicker: "Il tocco finale",
    description: "Cappellini e berretti. Selezione demo.",
    image: media.waterTowers,
    sortOrder: "manual",
  },
];

import { media } from "@/content/media";
import type { Collection } from "@/lib/commerce/types";

/** Demo collections. Handles follow Shopify's URL convention (/collections/{handle}). */
export const collections: Collection[] = [
  {
    id: "gid://demo/Collection/new-arrivals",
    handle: "new-arrivals",
    title: "New Arrivals",
    kicker: "Fresh off the line",
    description: "The latest pieces to hit the block. Demo selection.",
    image: media.subway,
    sortOrder: "created-desc",
  },
  {
    id: "gid://demo/Collection/drop-001",
    handle: "drop-001",
    title: "Drop 001",
    kicker: "Night Shift",
    description: "A first chapter shot after dark. Demo capsule used to preview the collection layout.",
    image: media.streetNight,
    sortOrder: "manual",
  },
  {
    id: "gid://demo/Collection/tops",
    handle: "tops",
    title: "Tops",
    kicker: "Heavy cotton, loud statements",
    description: "Tees, hoodies, crews and outer layers. Demo selection.",
    image: media.fireEscape,
    sortOrder: "manual",
  },
  {
    id: "gid://demo/Collection/bottoms",
    handle: "bottoms",
    title: "Bottoms",
    kicker: "Built for the pavement",
    description: "Cargos and shorts cut with room to move. Demo selection.",
    image: media.chainlink,
    sortOrder: "manual",
  },
  {
    id: "gid://demo/Collection/headwear",
    handle: "headwear",
    title: "Headwear",
    kicker: "Top it off",
    description: "Caps and beanies. Demo selection.",
    image: media.waterTowers,
    sortOrder: "manual",
  },
];

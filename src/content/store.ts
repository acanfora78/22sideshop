/**
 * THE STORE — physical displays.
 * Each wall is an AI-generated empty store wall (see public/media/movement/README.md)
 * with a real clothing rail; garments are hung on it in code. Coordinates are
 * fractions of the wall image measured from the photo (rail height, rail span).
 * In Shopify: one section per wall, collection picked in the section settings.
 */
export interface StoreWall {
  id: string;
  /** Collection handle shown on this wall. */
  collection: string;
  /** Editorial title (EN) + description (IT). */
  title: string;
  number: string;
  description: string;
  image: { url: string; width: number; height: number; alt: string };
  rail: { y: number; x0: number; x1: number };
  tone: "dark" | "light";
}

const wall = (file: string, width: number, height: number, alt: string) => ({ url: `/media/movement/${file}`, width, height, alt });

export const storeWalls: StoreWall[] = [
  {
    id: "latest-drop",
    collection: "drop-001",
    title: "Latest Drop",
    number: "22.01",
    description: "Il primo capitolo, appeso sotto il neon: stampe decise, volumi ampi, i pezzi del Drop 001.",
    image: wall("wall-drop.webp", 1376, 765, "Parete in cemento con un'insegna al neon rossa a forma di 22 e una barra appendiabiti in metallo."),
    rail: { y: 0.443, x0: 0.06, x1: 0.95 },
    tone: "dark",
  },
  {
    id: "graphic-tees",
    collection: "graphic-tees",
    title: "Graphic Tees",
    number: "22.02",
    description: "Stampe grandi, messaggi diretti, sulla parete di piastrelle della vecchia stazione.",
    image: wall("wall-tiles.webp", 1376, 768, "Parete di piastrelle bianche da metropolitana con una barra appendiabiti nera."),
    rail: { y: 0.218, x0: 0.08, x1: 0.92 },
    tone: "light",
  },
  {
    id: "sets",
    collection: "sets",
    title: "The Sets",
    number: "22.03",
    description: "Completi da indossare insieme, contro il mattone nero: il cargo nero e la tuta grigia sfumata.",
    image: wall("wall-brick.webp", 1341, 768, "Muro di mattoni dipinto di nero con una barra appendiabiti in tubo d'acciaio."),
    rail: { y: 0.218, x0: 0.12, x1: 0.86 },
    tone: "dark",
  },
  {
    id: "long-sleeve",
    collection: "long-sleeve",
    title: "Long Sleeve",
    number: "22.04",
    description: "Maniche lunghe stampate sotto le lampade industriali.",
    image: wall("wall-steel.webp", 1376, 768, "Parete in lamiera ondulata con lampade industriali e una barra appendiabiti sospesa."),
    rail: { y: 0.387, x0: 0.1, x1: 0.88 },
    tone: "dark",
  },
  {
    id: "essentials",
    collection: "essentials",
    title: "The Essentials",
    number: "22.05",
    description: "Le basi che non mancano mai: jeans larghi, cargo e pantaloni tuta.",
    image: wall("wall-essentials.webp", 1376, 768, "Parete in cemento chiaro con una lunga barra appendiabiti in acciaio e pavimento in legno."),
    rail: { y: 0.4, x0: 0.06, x1: 0.94 },
    tone: "light",
  },
];

export const hangingImage = (handle: string) => `/media/products/${handle}-hanging.webp`;

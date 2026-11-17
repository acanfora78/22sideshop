import type { Image } from "@/lib/commerce/types";

/**
 * MEDIA MANIFEST — single source of truth for every editorial image.
 *
 * All files currently in /public/media are original, procedurally generated
 * art-direction frames (see scripts/assets). To swap in real campaign
 * photography, drop the new file in /public/media and update `url` / size here.
 * In Shopify these map to `image_picker` settings on the matching sections.
 */
const img = (file: string, width: number, height: number, altText: string): Image => ({
  url: `/media/${file}`,
  width,
  height,
  altText,
});

export const media = {
  streetNight: img("scene-street-night.jpg", 2400, 1500, "Viale notturno tra palazzi di mattoni, l'asfalto bagnato riflette le finestre illuminate."),
  streetFigure: img("scene-street-figure.jpg", 2400, 1500, "Una figura col cappuccio in mezzo a una strada notturna nella nebbia."),
  streetPortrait: img("scene-street-portrait.jpg", 1400, 2000, "Sagoma incappucciata in un viale deserto di notte."),
  subway: img("scene-subway.jpg", 2400, 1500, "Banchina della metro che si perde nel buio, un treno sfreccia."),
  skyline: img("scene-skyline-bridge.jpg", 2400, 1500, "Skyline della città oltre il fiume di notte, ponte sospeso in primo piano."),
  fireEscape: img("scene-fire-escape.jpg", 1400, 1900, "Facciata di mattoni con scala antincendio a zig-zag e ombre nette."),
  waterTowers: img("scene-water-towers.jpg", 2000, 1400, "Cisterne sui tetti in controluce contro un cielo chiaro."),
  tiles: img("scene-tiles-22side.jpg", 2200, 1300, "Mosaico di piastrelle della metro con la scritta 22 SIDE ST."),
  chainlink: img("scene-chainlink.jpg", 2000, 1300, "Rete metallica davanti alle luci sfocate della città."),
  concrete: img("texture-concrete.jpg", 2000, 1300, "Texture di muro in cemento grezzo."),
  asphalt: img("texture-asphalt.jpg", 1600, 1600, "Texture di asfalto scuro."),
} as const;

export type MediaKey = keyof typeof media;

/** Product image file convention: /public/media/products/{slug}-{front|back|detail}.jpg */
export const productImage = (slug: string, view: "front" | "back" | "detail", alt: string): Image => ({
  url: `/media/products/${slug}-${view}.jpg`,
  width: 1200,
  height: 1500,
  altText: alt,
});

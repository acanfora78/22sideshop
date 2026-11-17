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
  streetNight: img("scene-street-night.jpg", 2400, 1500, "Night avenue between brick tenements, wet asphalt reflecting window light."),
  streetFigure: img("scene-street-figure.jpg", 2400, 1500, "A hooded figure stands in the middle of a foggy night street."),
  streetPortrait: img("scene-street-portrait.jpg", 1400, 2000, "Hooded silhouette in an empty avenue at night."),
  subway: img("scene-subway.jpg", 2400, 1500, "Subway platform receding into the dark, a train streaks past."),
  skyline: img("scene-skyline-bridge.jpg", 2400, 1500, "City skyline across the river at night, suspension bridge in the foreground."),
  fireEscape: img("scene-fire-escape.jpg", 1400, 1900, "Brick facade with a zig-zag fire escape casting hard shadows."),
  waterTowers: img("scene-water-towers.jpg", 2000, 1400, "Rooftop water towers silhouetted against a pale sky."),
  tiles: img("scene-tiles-22side.jpg", 2200, 1300, "Subway tile mosaic sign reading 22 SIDE ST."),
  chainlink: img("scene-chainlink.jpg", 2000, 1300, "Chain-link fence in front of out-of-focus city lights."),
  concrete: img("texture-concrete.jpg", 2000, 1300, "Raw concrete wall texture."),
  asphalt: img("texture-asphalt.jpg", 1600, 1600, "Dark asphalt texture."),
} as const;

export type MediaKey = keyof typeof media;

/** Product image file convention: /public/media/products/{slug}-{front|back|detail}.jpg */
export const productImage = (slug: string, view: "front" | "back" | "detail", alt: string): Image => ({
  url: `/media/products/${slug}-${view}.jpg`,
  width: 1200,
  height: 1500,
  altText: alt,
});

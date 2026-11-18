export type SizeGuideKey = "top" | "bottom" | "one-size";

/** Indicative demo measurements (cm). Official size guide published at launch. */
export const sizeGuides: Record<SizeGuideKey, { columns: string[]; rows: string[][] }> = {
  top: {
    columns: ["Taglia", "Larghezza petto", "Lunghezza", "Manica"],
    rows: [
      ["XS", "54", "68", "21"],
      ["S", "57", "70", "22"],
      ["M", "60", "72", "23"],
      ["L", "63", "74", "24"],
      ["XL", "66", "76", "25"],
      ["XXL", "69", "78", "26"],
    ],
  },
  bottom: {
    columns: ["Taglia", "Vita", "Cavallo interno", "Fondo gamba"],
    rows: [
      ["28 / S", "72", "78", "24"],
      ["30 / M", "77", "79", "25"],
      ["32 / L", "82", "80", "26"],
      ["34 / XL", "87", "81", "27"],
      ["36", "92", "82", "28"],
    ],
  },
  "one-size": {
    columns: ["Taglia", "Circonferenza"],
    rows: [["Taglia unica", "54 – 60"]],
  },
};

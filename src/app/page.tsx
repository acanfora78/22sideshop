import { getCollectionProducts, getCollections } from "@/lib/commerce";
import { IntroSequence } from "@/components/home/IntroSequence";
import { Hero } from "@/components/home/Hero";
import { BrandStatement } from "@/components/home/BrandStatement";
import { Why22 } from "@/components/home/Why22";
import { UndergroundCulture } from "@/components/home/UndergroundCulture";
import { ShopTheCollection } from "@/components/home/ShopTheCollection";
import { FinalStatement } from "@/components/home/FinalStatement";
import { TheStore } from "@/components/store/TheStore";
import { Marquee } from "@/components/motion/Marquee";
import { RouteMap } from "@/components/transit/RouteMap";
import { TrackLines } from "@/components/twentytwo/TwentyTwo";
import { home } from "@/content/site";

/** Collections shown as "lines" in the Pick-your-line index. */
const LINES = ["new-arrivals", "drop-001", "graphic-tees", "sets", "long-sleeve", "essentials"];

/**
 * Homepage — one continuous film: intro → the movement → manifesto → why 22 →
 * the store → underground culture → the collection → last stop.
 * (Shopify: templates/index.json, one section file per component.)
 */
export default async function Home() {
  const all = await getCollections();
  const collections = LINES.map((h) => all.find((c) => c.handle === h)).filter((c): c is NonNullable<typeof c> => !!c);
  const counts = Object.fromEntries(
    await Promise.all(collections.map(async (c) => [c.handle, (await getCollectionProducts(c.handle)).length] as const)),
  );

  return (
    <>
      <IntroSequence />
      <RouteMap stops={home.route} />
      <Hero />
      <BrandStatement />
      <Marquee
        items={["Not made to fit in", "22", "Built different", "22", "The movement", "22"]}
        className="font-display -rotate-2 scale-105 border-y border-dirty/15 bg-dirty py-3 text-4xl text-obsidian md:text-6xl"
        speed={36}
      />
      <Why22 />
      <TheStore />
      <TrackLines label="Next stop — Underground Culture" />
      <UndergroundCulture />
      <ShopTheCollection collections={collections} counts={counts} />
      <FinalStatement />
    </>
  );
}

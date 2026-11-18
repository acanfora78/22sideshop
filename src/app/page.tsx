import { getCollectionProducts, getCollections } from "@/lib/commerce";
import { IntroSequence } from "@/components/home/IntroSequence";
import { Hero } from "@/components/home/Hero";
import { BrandStatement } from "@/components/home/BrandStatement";
import { LatestDrop } from "@/components/home/LatestDrop";
import { UndergroundCulture } from "@/components/home/UndergroundCulture";
import { ShopTheCollection } from "@/components/home/ShopTheCollection";
import { FinalStatement } from "@/components/home/FinalStatement";
import { Marquee } from "@/components/motion/Marquee";
import { RouteMap } from "@/components/transit/RouteMap";
import { home } from "@/content/site";

/**
 * Homepage = ordered list of sections (maps to Shopify templates/index.json
 * with one section file per component below).
 */
export default async function Home() {
  const [drop, collections] = await Promise.all([getCollectionProducts("drop-001"), getCollections()]);
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
        items={["Not made to fit in", "22SIDE®", "Built different", "Drop 001", "Line 22"]}
        className="font-display -rotate-2 scale-105 border-y border-dirty/15 bg-dirty py-3 text-4xl text-obsidian md:text-6xl"
        speed={36}
      />
      <LatestDrop products={drop} />
      <UndergroundCulture />
      <ShopTheCollection collections={collections} counts={counts} />
      <FinalStatement />
    </>
  );
}

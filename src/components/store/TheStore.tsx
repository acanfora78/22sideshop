import { getCollectionProducts } from "@/lib/commerce";
import { storeWalls } from "@/content/store";
import { movement } from "@/content/movement";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, SplitText } from "@/components/motion/Reveal";
import { Pattern22, TrackLines, TwentyTwoReveal } from "@/components/twentytwo/TwentyTwo";
import { LineBullet } from "@/components/transit/Transit";
import { StoreWall } from "./StoreWall";

/**
 * THE STORE — the collection shown as a physical boutique: a giant 22 opens
 * onto the shop floor, then each collection hangs on its own wall.
 * (Shopify: a "store" section listing walls → collection pickers.)
 */
export async function TheStore() {
  const { store } = movement;
  const walls = await Promise.all(storeWalls.map(async (w) => ({ wall: w, products: await getCollectionProducts(w.collection) })));
  return (
    <section id="store" aria-labelledby="store-title" className="relative bg-obsidian">
      <TwentyTwoReveal image={store.overview} alt={store.overviewAlt}>
        <p className="label flex items-center gap-2 text-dirty/80">
          <LineBullet size="xs" /> {store.index} / {store.label}
        </p>
        <p className="label hidden text-dirty/60 sm:block">Scorri per entrare</p>
      </TwentyTwoReveal>

      <div className="relative overflow-hidden">
        <Pattern22 />
        <div className="px-gutter relative pb-12 pt-20 md:pb-16 md:pt-28">
          <SectionLabel index={store.index} label={store.label} />
          <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-12 md:items-end">
            <h2 id="store-title" className="md:col-span-7">
              <SplitText text={store.title} className="font-display text-huge block" />
            </h2>
            <Reveal className="md:col-span-4 md:col-start-9">
              <p className="text-base leading-relaxed text-dirty/80 md:text-lg">{store.intro}</p>
              <p className="label mt-4 text-blood-bright">{store.note}</p>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="space-y-6 pb-24 md:space-y-10 md:pb-32">
        {walls.map(({ wall, products }, i) => (
          <div key={wall.id}>
            {i > 0 && <TrackLines label={`Next wall — ${wall.title}`} />}
            <StoreWall wall={wall} products={products} />
          </div>
        ))}
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCollectionProducts, getCollections } from "@/lib/commerce";
import { pages } from "@/content/site";
import { LineBullet } from "@/components/transit/Transit";
import { PageHero } from "@/components/collection/PageHero";
import { ImageReveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/format";
import { storeWalls } from "@/content/store";
import { StoreWall } from "@/components/store/StoreWall";
import { TrackLines } from "@/components/twentytwo/TwentyTwo";

export const metadata: Metadata = { title: "Collezioni" };

export default async function CollectionsIndex() {
  const collections = await getCollections();
  const counts = await Promise.all(collections.map((c) => getCollectionProducts(c.handle).then((p) => p.length)));
  const walls = await Promise.all(storeWalls.map(async (w) => ({ wall: w, products: await getCollectionProducts(w.collection) })));
  return (
    <>
      <PageHero kicker={pages.collections.kicker} title={pages.collections.title} image={{ url: "/media/movement/store-overview.webp", width: 1376, height: 768, altText: "" }} index="03" count={collections.length} countLabel={["linea", "linee"]} />
      <div className="space-y-6 pb-16 md:space-y-10">
        {walls.map(({ wall, products }, i) => (
          <div key={wall.id}>
            {i > 0 && <TrackLines />}
            <StoreWall wall={wall} products={products} headingLevel="h2" />
          </div>
        ))}
      </div>
      <p className="px-gutter label mb-6 text-concrete">Tutte le linee</p>
      <div className="px-gutter grid gap-3 pb-24 md:grid-cols-2">
        {collections.map((c, i) => (
          <Link
            key={c.handle}
            href={c.handle === "new-arrivals" ? "/new-arrivals" : `/collections/${c.handle}`}
            className={cn("group relative block overflow-hidden bg-asphalt", i === 0 ? "aspect-[4/5] md:col-span-2 md:aspect-[21/9]" : "aspect-[4/5] md:aspect-[4/3]")}
          >
            <ImageReveal className="absolute inset-0" delay={i * 0.05}>
              <Image
                src={c.image.url}
                alt={c.image.altText}
                fill
                sizes={i === 0 ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                className="object-cover opacity-70 transition-[transform,opacity] duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:opacity-90"
              />
            </ImageReveal>
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-8">
              <div className="label flex justify-between text-dirty/80">
                <span className="flex items-center gap-2">
                  <LineBullet size="xs" label={String(i + 1).padStart(2, "0")} /> {c.kicker}
                </span>
                <span>{counts[i]} pezzi</span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-[clamp(3rem,9vw,9rem)]">{c.title}</h2>
                <ArrowUpRight className="mb-3 size-10 shrink-0 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

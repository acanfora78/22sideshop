import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCollectionProducts, getCollections } from "@/lib/commerce";
import { media } from "@/content/media";
import { PageHero } from "@/components/collection/PageHero";
import { ImageReveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/format";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsIndex() {
  const collections = await getCollections();
  const counts = await Promise.all(collections.map((c) => getCollectionProducts(c.handle).then((p) => p.length)));
  return (
    <>
      <PageHero kicker="Collections" title="Choose a chapter" image={media.skyline} index="03" count={collections.length} />
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
                <span>
                  <span className="text-blood">{String(i + 1).padStart(2, "0")}</span> / {c.kicker}
                </span>
                <span>{counts[i]} pieces</span>
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

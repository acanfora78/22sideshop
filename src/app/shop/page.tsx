import type { Metadata } from "next";
import { getCollections, getProducts } from "@/lib/commerce";
import { media } from "@/content/media";
import { PageHero } from "@/components/collection/PageHero";
import { CollectionView } from "@/components/collection/CollectionView";
import { Marquee } from "@/components/motion/Marquee";

export const metadata: Metadata = { title: "Shop All" };

export default async function ShopPage() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);
  return (
    <>
      <PageHero
        kicker="Shop all"
        title="The whole block"
        description="Every piece in one place. Demo catalogue — placeholders for layout preview, not real 22SIDE products."
        image={media.streetNight}
        count={products.length}
        index="01"
      />
      <Marquee items={["Shop all", "Independent streetwear", "No rules", "Just attitude"]} className="font-display border-y border-dirty/10 py-3 text-3xl md:text-5xl" />
      <div className="px-gutter pb-24 pt-0">
        <CollectionView products={products} collections={collections} />
      </div>
    </>
  );
}

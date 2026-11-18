import { getCollectionProducts, getCollections } from "@/lib/commerce";
import type { Collection } from "@/lib/commerce/types";
import { PageHero } from "./PageHero";
import { CollectionView } from "./CollectionView";
import { storeWalls } from "@/content/store";
import { StoreWall } from "@/components/store/StoreWall";

/** Shared template for /collections/[handle] and /new-arrivals (Shopify: templates/collection.json). */
export async function CollectionPage({ collection, index }: { collection: Collection; index: string }) {
  const [products, collections] = await Promise.all([getCollectionProducts(collection.handle), getCollections()]);
  const wall = storeWalls.find((w) => w.collection === collection.handle);
  return (
    <>
      <PageHero
        kicker={collection.kicker}
        title={collection.title}
        description={collection.description}
        image={collection.image}
        count={products.length}
        index={index}
      />
      {wall && (
        <div className="pb-16 pt-4 md:pb-24">
          <StoreWall wall={wall} products={products} headingLevel="h2" />
        </div>
      )}
      <div className="px-gutter pb-24">
        <CollectionView
          products={products}
          collections={collections}
          activeHandle={collection.handle}
          defaultSort={collection.sortOrder === "created-desc" ? "newest" : "featured"}
        />
      </div>
    </>
  );
}

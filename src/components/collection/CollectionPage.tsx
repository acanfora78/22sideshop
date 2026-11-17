import { getCollectionProducts, getCollections } from "@/lib/commerce";
import type { Collection } from "@/lib/commerce/types";
import { PageHero } from "./PageHero";
import { CollectionView } from "./CollectionView";

/** Shared template for /collections/[handle] and /new-arrivals (Shopify: templates/collection.json). */
export async function CollectionPage({ collection, index }: { collection: Collection; index: string }) {
  const [products, collections] = await Promise.all([getCollectionProducts(collection.handle), getCollections()]);
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

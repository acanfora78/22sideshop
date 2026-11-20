import { getProducts } from "@/lib/commerce";
import { movement } from "@/content/movement";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, SplitText } from "@/components/motion/Reveal";
import { Pattern22, TwentyTwoReveal } from "@/components/twentytwo/TwentyTwo";
import { LineBullet } from "@/components/transit/Transit";
import { ProductGrid } from "@/components/collection/ProductGrid";
import { ButtonLink } from "@/components/ui/Button";

/**
 * THE STORE — a giant 22 opens onto the shop floor, then the real catalogue.
 * (Shopify: a featured-collection section.)
 */
export async function TheStore() {
  const { store } = movement;
  const products = await getProducts();
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

      <div className="px-gutter pb-24 md:pb-32">
        <ProductGrid products={products} />
        <div className="mt-16 flex justify-center">
          <ButtonLink href="/shop" variant="red">
            Acquista ora
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

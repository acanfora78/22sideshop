import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getProduct, getProducts, getRelatedProducts } from "@/lib/commerce";
import { formatMoney } from "@/lib/format";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductForm } from "@/components/product/ProductForm";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionLabel, DemoTag } from "@/components/ui/SectionLabel";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const p = await getProduct(handle);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    openGraph: { images: [{ url: p.featuredImage.url, width: p.featuredImage.width, height: p.featuredImage.height }] },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();
  const [related, primary] = await Promise.all([getRelatedProducts(product, 4), getCollection(product.collections[0])]);

  return (
    <>
      <div className="pt-[var(--header-h)]">
        <nav aria-label="Percorso" className="px-gutter label flex flex-wrap gap-2 py-4 text-concrete">
          <Link href="/shop" className="hover:text-dirty">
            Shop
          </Link>
          <span aria-hidden>/</span>
          {primary && (
            <>
              <Link href={primary.handle === "new-arrivals" ? "/new-arrivals" : `/collections/${primary.handle}`} className="hover:text-dirty">
                {primary.title}
              </Link>
              <span aria-hidden>/</span>
            </>
          )}
          <span className="text-dirty" aria-current="page">
            {product.code}
          </span>
        </nav>

        <div className="md:px-gutter grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <ProductGallery images={product.images} title={product.title} />
          </div>

          <div className="px-gutter md:col-span-5 md:px-0">
            <div className="md:sticky md:top-[calc(var(--header-h)+1rem)]">
              <div className="label flex items-center gap-3 text-concrete">
                <span className="text-blood">{product.code}</span> / {product.productType} {product.isDemo && <DemoTag />}
              </div>
              <h1 className="font-display mt-4 text-[clamp(2.8rem,5.4vw,5.5rem)]">{product.title}</h1>
              <p className="mt-4 font-mono text-xl tabular-nums">
                {formatMoney(product.priceRange.minVariantPrice)}
                <span className="label ml-3 text-concrete">Prezzo segnaposto</span>
              </p>
              <p className="mt-6 max-w-md text-dirty/75">{product.description}</p>
              <div className="mt-8">
                <ProductForm product={product} />
              </div>
              <div className="mt-10">
                <ProductDetails product={product} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Marquee
        items={["No rules", "Just attitude", product.title, "22SIDE®"]}
        className="font-display mt-24 border-y border-dirty/10 py-4 text-4xl md:text-6xl"
        speed={50}
      />

      <section className="px-gutter py-20 md:py-28" aria-labelledby="related-title">
        <SectionLabel index="↳" label="Complete the look" />
        <Reveal>
          <h2 id="related-title" className="font-display text-big mt-8">
            Also on the block
          </h2>
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
          {related.map((p, i) => (
            <li key={p.handle} className={i % 2 ? "lg:mt-16" : ""}>
              <ProductCard product={p} index={i} sizes="(min-width: 1024px) 25vw, 50vw" />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

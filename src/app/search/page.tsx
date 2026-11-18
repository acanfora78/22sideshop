import type { Metadata } from "next";
import { getProducts } from "@/lib/commerce";
import { SearchView } from "@/components/search/SearchView";
import { pages } from "@/content/site";

export const metadata: Metadata = { title: "Cerca" };

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const products = await getProducts();
  return (
    <div className="px-gutter min-h-[85vh] pb-24 pt-[calc(var(--header-h)+2rem)]">
      <p className="label text-concrete">
        <span className="text-blood">06</span> / {pages.search.kicker}
      </p>
      <h1 className="font-display text-big mb-10 mt-6 md:mb-14">{pages.search.title}</h1>
      <SearchView products={products} initialQuery={q} />
    </div>
  );
}

import type { Metadata } from "next";
import { getProducts } from "@/lib/commerce";
import { SearchView } from "@/components/search/SearchView";

export const metadata: Metadata = { title: "Cerca" };

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const products = await getProducts();
  return (
    <div className="px-gutter min-h-[85vh] pb-24 pt-[calc(var(--header-h)+2rem)]">
      <p className="label mb-10 text-concrete md:mb-16">
        <span className="text-blood">06</span> / Cerca
      </p>
      <SearchView products={products} initialQuery={q} />
    </div>
  );
}

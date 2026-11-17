import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCollection, getCollections } from "@/lib/commerce";
import { CollectionPage } from "@/components/collection/CollectionPage";

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const c = await getCollection(handle);
  return c ? { title: c.title, description: c.description } : {};
}

export default async function Page({ params }: PageProps<"/collections/[handle]">) {
  const { handle } = await params;
  if (handle === "new-arrivals") redirect("/new-arrivals");
  if (handle === "all") redirect("/shop");
  const collection = await getCollection(handle);
  if (!collection) notFound();
  return <CollectionPage collection={collection} index="03" />;
}

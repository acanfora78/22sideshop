import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollection } from "@/lib/commerce";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = { title: "New Arrivals" };

export default async function NewArrivalsPage() {
  const collection = await getCollection("new-arrivals");
  if (!collection) notFound();
  return <CollectionPage collection={collection} index="02" />;
}

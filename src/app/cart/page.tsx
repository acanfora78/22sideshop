import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";
import { pages } from "@/content/site";
import { StationSign } from "@/components/transit/Transit";

export const metadata: Metadata = { title: "Carrello" };

export default function CartPage() {
  return (
    <div className="px-gutter min-h-[80vh] pb-24 pt-[calc(var(--header-h)+2rem)]">
      <div className="flex items-start justify-between gap-4">
        <p className="label text-concrete">
          <span className="text-blood">05</span> / {pages.cart.kicker}
        </p>
        <StationSign name="The Counter" size="sm" className="hidden sm:inline-flex" />
      </div>
      <h1 className="font-display text-huge mb-10 mt-8 md:mt-14">{pages.cart.title}</h1>
      <CartPageView />
    </div>
  );
}

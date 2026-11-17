import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="px-gutter min-h-[80vh] pb-24 pt-[calc(var(--header-h)+2rem)]">
      <p className="label text-concrete">
        <span className="text-blood">05</span> / Your bag
      </p>
      <h1 className="font-display text-huge mb-10 mt-8 md:mt-14">Cart</h1>
      <CartPageView />
    </div>
  );
}

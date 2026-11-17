"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/lib/commerce/types";
import { cn } from "@/lib/format";
import { ProductCard } from "@/components/product/ProductCard";

/**
 * Collection grid with an editorial rhythm: every 5th card spans two columns
 * on desktop and some columns are offset, so it reads like a lookbook rather
 * than a stock grid.
 */
export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <ul className={cn("grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 md:gap-y-16 lg:grid-cols-4", className)}>
      {products.map((p, i) => {
        const feature = i % 5 === 0;
        return (
          <motion.li
            key={p.handle}
            layout={!reduce}
            initial={{ opacity: 0, y: reduce ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -5% 0px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.06 }}
            className={cn(feature && "col-span-2 lg:row-span-1", !feature && i % 5 === 2 && "lg:mt-24")}
          >
            <ProductCard
              product={p}
              index={i}
              priority={i < 2}
              aspect={feature ? "aspect-[4/5] lg:aspect-[16/11]" : "aspect-[4/5]"}
              sizes={feature ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
            />
          </motion.li>
        );
      })}
    </ul>
  );
}

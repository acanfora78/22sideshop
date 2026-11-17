"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { cn } from "@/lib/format";

/** Accordion: details / shipping / demo notice. */
export function ProductDetails({ product }: { product: Product }) {
  const panels = [
    {
      id: "details",
      title: "Details",
      body: (
        <ul className="space-y-2">
          {product.details.map((d) => (
            <li key={d} className="flex gap-3">
              <span className="text-blood">—</span>
              {d}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "shipping",
      title: "Shipping & returns",
      body: <p>Shipping rates, delivery times and return policy will be published by 22SIDE with the live store.</p>,
    },
    {
      id: "demo",
      title: "About this demo",
      body: (
        <p>
          This is a placeholder product used to preview the shopping experience. Images are generated flat-lay renders, and the
          price and stock shown are not real.
        </p>
      ),
    },
  ];
  const [open, setOpen] = useState<string | null>("details");
  return (
    <div className="border-t border-dirty/15">
      {panels.map((p) => {
        const isOpen = open === p.id;
        return (
          <div key={p.id} className="border-b border-dirty/15">
            <h3>
              <button
                type="button"
                id={`acc-${p.id}`}
                aria-expanded={isOpen}
                aria-controls={`panel-${p.id}`}
                onClick={() => setOpen(isOpen ? null : p.id)}
                className="label flex w-full items-center justify-between py-4 text-left text-dirty hover:text-blood-bright"
              >
                {p.title}
                <Plus className={cn("size-4 transition-transform duration-300", isOpen && "rotate-45")} strokeWidth={1.5} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`panel-${p.id}`}
                  role="region"
                  aria-labelledby={`acc-${p.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 text-sm leading-relaxed text-dirty/70">{p.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

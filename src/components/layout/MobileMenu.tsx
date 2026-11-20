"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { media } from "@/content/media";
import { mainNav, site } from "@/content/site";
import { useScrollLock } from "@/components/motion/SmoothScroll";
import { EASE_IN_OUT, EASE_OUT } from "@/components/motion/Reveal";
import { useCart } from "@/components/cart/CartProvider";

const extra = [
  { label: "Cerca", href: "/search" },
  { label: "Carrello", href: "/cart" },
];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useScrollLock(open);
  const router = useRouter();
  const [q, setQ] = useState("");
  const { totalQuantity } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-obsidian pt-[var(--header-h)] md:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: EASE_IN_OUT }}
        >
          <div className="absolute inset-0 -z-10 opacity-25">
            <Image src={media.tiles.url} alt="" fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/60 to-obsidian" />
          </div>

          <form
            role="search"
            className="px-gutter mt-4 flex items-center gap-3 border-b border-dirty/20 pb-3"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/search?q=${encodeURIComponent(q)}`);
              onClose();
            }}
          >
            <Search className="size-4 text-concrete" strokeWidth={1.5} aria-hidden />
            <label htmlFor="mobile-search" className="sr-only">
              Cerca prodotti
            </label>
            <input
              id="mobile-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cerca un prodotto"
              className="label w-full bg-transparent py-2 text-sm text-dirty placeholder:text-concrete focus:outline-none"
            />
          </form>

          <nav aria-label="Navigazione mobile" className="px-gutter mt-8 flex flex-1 flex-col">
            {mainNav.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: EASE_OUT }}
                className="border-b border-dirty/10"
              >
                <Link href={item.href} onClick={onClose} className="flex items-baseline justify-between py-3">
                  <span className="font-display text-[17vw] leading-[0.95]">{item.label}</span>
                  <span aria-hidden className="label text-blood-bright">↗</span>
                </Link>
                {item.children && (
                  <ul className="-mt-1 grid grid-cols-2 gap-2 pb-4">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} onClick={onClose} className="label flex min-h-11 items-center border border-dirty/20 px-3 text-dirty">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
            <motion.div
              className="mt-6 grid grid-cols-2 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {extra.map((x) => (
                <Link key={x.href} href={x.href} onClick={onClose} className="label border border-dirty/25 px-4 py-4 text-center">
                  {x.label}
                  {x.href === "/cart" ? ` (${totalQuantity})` : ""}
                </Link>
              ))}
            </motion.div>
          </nav>

          <div className="px-gutter label mt-10 flex items-center justify-between pb-8 text-concrete">
            <a href={site.instagram} target="_blank" rel="noreferrer" className="text-dirty">
              Instagram ↗
            </a>
            <span>{site.slogan}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

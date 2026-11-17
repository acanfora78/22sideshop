"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useScrollLock } from "@/components/motion/SmoothScroll";
import { EASE_IN_OUT } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CartLineItem } from "./CartLineItem";
import { CartSummary } from "./CartSummary";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { isOpen, close, lines, ready } = useCart();
  const pathname = usePathname();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  useScrollLock(isOpen);

  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const t = window.setTimeout(() => closeBtn.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.button
            type="button"
            aria-label="Chiudi il carrello"
            className="absolute inset-0 cursor-default bg-obsidian/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-dirty/10 bg-asphalt"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: EASE_IN_OUT }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between border-b border-dirty/10 px-6 py-5">
              <h2 id="cart-title" className="font-display text-3xl">
                La tua borsa
              </h2>
              <button ref={closeBtn} type="button" onClick={close} className="label flex items-center gap-2 p-2 hover:text-blood-bright">
                Chiudi <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>

            {!ready ? (
              <div className="space-y-4 p-6" aria-busy="true">
                <div className="skeleton h-28" />
                <div className="skeleton h-28" />
              </div>
            ) : lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-6 px-6">
                <p className="label text-blood-bright">Borsa vuota</p>
                <p className="font-display text-6xl leading-[0.9]">Ancora niente qui.</p>
                <p className="max-w-xs text-sm text-dirty/70">Il blocco ti aspetta. Vai a scegliere il tuo side.</p>
                <ButtonLink href="/shop">Vedi tutti i prodotti</ButtonLink>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6" aria-label="Articoli nel carrello">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <CartLineItem key={l.id} line={l} onNavigate={close} />
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="border-t border-dirty/10 bg-obsidian/60 p-6">
                  <CartSummary />
                  <Link href="/cart" className="label link-underline mt-4 block text-center text-dirty/80" onClick={close}>
                    Vai al carrello
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

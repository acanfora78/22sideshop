"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useCart } from "@/components/cart/CartProvider";
import { mainNav, type NavItem } from "@/content/site";
import { cn } from "@/lib/format";
import { MobileMenu } from "./MobileMenu";
import { NycClock } from "./NycClock";

export function Header() {
  const pathname = usePathname();
  const { totalQuantity, open, ready } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu when the route changes (state-derived, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out-expo)]",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
          scrolled && !menuOpen ? "border-b border-dirty/10 bg-obsidian/85 backdrop-blur-md" : "border-b border-transparent",
        )}
      >
        <div className="px-gutter flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" className="relative z-10 text-[1.75rem] text-dirty" aria-label="22SIDE — home page">
            <Logo />
          </Link>

          <nav aria-label="Principale" className="hidden items-center gap-9 md:flex">
            {mainNav.map((item) =>
              item.children ? (
                <NavDropdown key={item.href} item={item} active={isActive(item.href) || item.children.some((c) => isActive(c.href))} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "label group relative flex items-baseline gap-1.5 py-2 transition-colors",
                    isActive(item.href) ? "text-dirty" : "text-dirty/60 hover:text-dirty",
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <span className="link-underline">{item.label}</span>
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <NycClock className="label mr-3 hidden text-concrete lg:inline" />
            <Link
              href="/search"
              className="label hidden items-center gap-2 p-2 text-dirty/70 transition-colors hover:text-dirty md:flex"
              aria-label="Cerca prodotti"
            >
              <Search className="size-4" strokeWidth={1.5} />
              <span className="hidden xl:inline">Cerca</span>
            </Link>
            <button
              type="button"
              onClick={open}
              className="label flex items-center gap-2 p-2 text-dirty transition-colors hover:text-blood-bright"
              aria-label={`Apri il carrello, ${totalQuantity} ${totalQuantity === 1 ? "articolo" : "articoli"}`}
            >
              <ShoppingBag className="size-[1.1rem]" strokeWidth={1.5} />
              <span className="hidden sm:inline">Carrello</span>
              <span className="relative inline-flex h-5 min-w-5 items-center justify-center overflow-hidden bg-dirty px-1 text-[0.65rem] text-obsidian">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={ready ? totalQuantity : "x"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {ready ? totalQuantity : 0}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
            <button
              type="button"
              className="label relative z-10 ml-1 flex h-10 items-center gap-2 px-2 text-dirty md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span>{menuOpen ? "Chiudi" : "Menu"}</span>
              <span aria-hidden className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 h-px w-full bg-dirty transition-transform duration-500",
                    menuOpen ? "top-1/2 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-px w-full bg-dirty transition-transform duration-500",
                    menuOpen ? "top-1/2 -rotate-45" : "bottom-0",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

/** "Catalogo": click opens the list of lines; Esc or a click outside closes it. */
function NavDropdown({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={cn("label flex min-h-11 items-center gap-1.5 transition-colors", active || open ? "text-dirty" : "text-dirty/60 hover:text-dirty")}
      >
        <span className="link-underline">{item.label}</span>
        <ChevronDown aria-hidden className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")} />
      </button>
      <div
        id={id}
        hidden={!open}
        className="absolute left-1/2 top-full z-10 mt-2 w-60 -translate-x-1/2 border border-dirty/15 bg-obsidian/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md"
      >
        <ul>
          {item.children?.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="font-display flex min-h-11 items-center justify-between px-3 text-2xl text-dirty transition-colors hover:bg-dirty hover:text-obsidian">
                {c.label} <span aria-hidden className="label text-xs">↗</span>
              </Link>
            </li>
          ))}
          <li className="mt-1 border-t border-dirty/15 pt-1">
            <Link href={item.href} className="label flex min-h-11 items-center px-3 text-dirty/80 hover:text-dirty">
              Tutto il catalogo →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

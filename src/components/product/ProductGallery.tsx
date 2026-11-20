"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Image as Img } from "@/lib/commerce/types";
import { cn } from "@/lib/format";

/**
 * Desktop: stacked full-height images (editorial scroll) with a sticky index.
 * Mobile: horizontal snap carousel with counter + thumbnails.
 */
export function ProductGallery({ images, title }: { images: Img[]; title: string }) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
  };

  return (
    <div>
      {/* Mobile carousel */}
      <div className="relative md:hidden">
        <div
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            setActive(Math.round(el.scrollLeft / el.clientWidth));
          }}
          aria-roledescription="carousel"
          aria-label={`Immagini di ${title}`}
        >
          {images.map((img, i) => (
            <div key={img.url} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-asphalt" aria-label={`Immagine ${i + 1} di ${images.length}`}>
              <Image src={img.url} alt={img.altText} fill sizes="100vw" priority={i === 0} className="object-cover" />
            </div>
          ))}
        </div>
        <div className="label absolute bottom-3 left-3 bg-obsidian/80 px-2 py-1 tabular-nums">
          {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </div>
        <div className="mt-2 flex gap-2 px-[var(--gutter)]">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Mostra immagine ${i + 1}`}
              aria-current={active === i}
              className={cn("relative h-16 w-13 overflow-hidden border", active === i ? "border-dirty" : "border-transparent opacity-50")}
            >
              <Image src={img.url} alt="" fill sizes="52px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Desktop stack */}
      <div className="hidden gap-2 md:grid md:grid-cols-2">
        {images.map((img, i) => (
          <figure
            key={img.url}
            className={cn("group relative overflow-hidden bg-asphalt", i === 0 ? "col-span-2 aspect-[4/5] lg:aspect-[5/6]" : "aspect-[4/5]")}
          >
            <Image
              src={img.url}
              alt={img.altText}
              fill
              priority={i === 0}
              sizes={i === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 29vw, 50vw"}
              className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
            />
            <figcaption className="label absolute bottom-3 left-3 text-dirty/70">
              Fig. {String(i + 1).padStart(2, "0")}
              {img.caption ? ` — ${img.caption}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ruler, X } from "lucide-react";
import { sizeGuides, type SizeGuideKey } from "@/data/size-guides";
import { useScrollLock } from "@/components/motion/SmoothScroll";
import { LineBullet } from "@/components/transit/Transit";

/** "Guida alle taglie" — dialog with indicative measurements (demo). */
export function SizeGuide({ guide, productTitle }: { guide: SizeGuideKey; productTitle: string }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const data = sizeGuides[guide];
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const btn = trigger.current;
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        className="label link-underline flex items-center gap-1.5 text-dirty/80 hover:text-dirty"
        aria-haspopup="dialog"
      >
        <Ruler className="size-3.5" strokeWidth={1.5} /> Guida alle taglie
      </button>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[75] flex items-end justify-center md:items-center">
            <motion.button
              type="button"
              aria-label="Chiudi la guida alle taglie"
              className="absolute inset-0 cursor-default bg-obsidian/75 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="size-guide-title"
              data-lenis-prevent
              className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto border border-dirty/15 bg-asphalt p-6 md:p-8"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="label flex items-center gap-2 text-concrete">
                    <LineBullet size="xs" /> Size guide
                  </p>
                  <h2 id="size-guide-title" className="font-display mt-3 text-4xl">
                    Guida alle taglie
                  </h2>
                  <p className="mt-1 text-sm text-dirty/70">{productTitle}</p>
                </div>
                <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="label flex items-center gap-2 p-2 hover:text-blood-bright">
                  Chiudi <X className="size-4" strokeWidth={1.5} />
                </button>
              </div>
              <table className="mt-6 w-full border-collapse text-left font-mono text-sm">
                <caption className="sr-only">Misure in centimetri</caption>
                <thead>
                  <tr className="border-b border-dirty/25">
                    {data.columns.map((c) => (
                      <th key={c} scope="col" className="label py-3 pr-3 font-normal text-concrete">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((r) => (
                    <tr key={r[0]} className="border-b border-dirty/10">
                      {r.map((cell, i) =>
                        i === 0 ? (
                          <th key={i} scope="row" className="py-3 pr-3 font-medium text-dirty">
                            {cell}
                          </th>
                        ) : (
                          <td key={i} className="py-3 pr-3 tabular-nums text-dirty/80">
                            {cell}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-5 text-sm leading-relaxed text-dirty/70">
                Misure indicative in centimetri, prese con il capo steso. Se sei tra due taglie e vuoi un fit più ampio, scegli quella più grande.
              </p>
              <p className="label mt-3 text-[0.6rem] text-blood-bright">Valori dimostrativi — la guida ufficiale sarà pubblicata con il lancio.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

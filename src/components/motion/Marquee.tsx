import { Fragment } from "react";

/**
 * Infinite CSS marquee (GPU transform only). Content is duplicated once and
 * the track translates -50%. Paused for reduced motion via CSS.
 */
export function Marquee({
  items,
  className,
  speed = 40,
  reverse = false,
  separator = "✕",
}: {
  items: readonly string[];
  className?: string;
  speed?: number;
  reverse?: boolean;
  separator?: string;
}) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <Fragment key={i}>
          <span className="px-[0.45em] whitespace-nowrap">{t}</span>
          <span className="px-[0.45em] text-blood" aria-hidden>
            {separator}
          </span>
        </Fragment>
      ))}
    </div>
  );
  return (
    <div className={`marquee overflow-hidden ${className ?? ""}`}>
      <div
        className="marquee-track flex w-max"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

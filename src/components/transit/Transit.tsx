import type { ReactNode } from "react";
import { cn } from "@/lib/format";

/**
 * 22 SIDE STREET — transit design system.
 * An imaginary New York line ("Line 22") whose signage becomes the brand's
 * interface language. Original drawings: no real transit marks are used.
 */

const BULLET_SIZE = { xs: "size-5 text-[0.6rem]", sm: "size-7 text-xs", md: "size-10 text-base", lg: "size-16 text-2xl", xl: "size-24 text-4xl" };

/** Round line bullet: "22" in a disc. */
export function LineBullet({
  label = "22",
  size = "sm",
  tone = "red",
  className,
}: {
  label?: string;
  size?: keyof typeof BULLET_SIZE;
  tone?: "red" | "white" | "black";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-sans font-extrabold leading-none tracking-tight [font-stretch:85%]",
        BULLET_SIZE[size],
        tone === "red" && "bg-blood text-dirty",
        tone === "white" && "bg-dirty text-obsidian",
        tone === "black" && "border border-dirty/70 bg-obsidian text-dirty",
        className,
      )}
    >
      {label}
    </span>
  );
}

/**
 * Station sign: black panel, thin white rule on top, bold grotesk name,
 * line bullets and an optional direction line.
 */
export function StationSign({
  name,
  direction,
  size = "md",
  className,
  bullets = ["22"],
}: {
  name: string;
  direction?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  bullets?: string[];
}) {
  return (
    <div
      className={cn("relative inline-flex flex-col bg-obsidian text-dirty shadow-[0_20px_60px_rgba(0,0,0,0.6)]", className)}
      role="img"
      aria-label={`${name}${direction ? ` — ${direction}` : ""}`}
    >
      <span aria-hidden className={cn("block bg-dirty", size === "lg" ? "h-1.5" : "h-1")} />
      <div
        aria-hidden
        className={cn("flex items-center", size === "lg" ? "gap-5 px-7 py-5 md:gap-7 md:px-10 md:py-7" : size === "md" ? "gap-4 px-5 py-3.5" : "gap-2.5 px-3 py-2")}
      >
        <span
          className={cn(
            "whitespace-nowrap font-sans font-bold leading-none tracking-[-0.02em] [font-stretch:90%]",
            size === "lg" ? "text-[clamp(2.2rem,7vw,6.5rem)]" : size === "md" ? "text-2xl md:text-3xl" : "text-sm",
          )}
        >
          {name}
        </span>
        <span className="flex gap-1.5">
          {bullets.map((b) => (
            <LineBullet key={b} label={b} size={size === "lg" ? "lg" : size === "md" ? "md" : "xs"} />
          ))}
        </span>
      </div>
      {direction && (
        <span
          aria-hidden
          className={cn("label border-t border-dirty/20 text-dirty/70", size === "lg" ? "px-7 py-2.5 md:px-10" : size === "md" ? "px-5 py-2" : "px-3 py-1.5 text-[0.55rem]")}
        >
          {direction}
        </span>
      )}
    </div>
  );
}

/** Small platform / issue tag: "PLATFORM 2" boxed in mono. */
export function PlatformTag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("label inline-flex items-center gap-2 border border-dirty/40 px-2 py-1 text-dirty/85", className)}>{children}</span>;
}

/** Vintage transit ticket with perforated stub. */
export function Ticket({
  title,
  serial = "No. 002222",
  children,
  className,
}: {
  title: string;
  serial?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex overflow-hidden bg-dirty text-obsidian", className)}>
      <div className="flex-1 p-5 md:p-6">
        <div className="label flex items-center justify-between text-obsidian/70">
          <span>Line 22 — Admit one</span>
          <span>{serial}</span>
        </div>
        <p className="font-display mt-3 text-4xl md:text-5xl">{title}</p>
        {children && <div className="mt-3">{children}</div>}
      </div>
      <div aria-hidden className="relative flex w-16 flex-col items-center justify-center gap-3 border-l-2 border-dashed border-obsidian/40 md:w-20">
        <LineBullet size="md" />
        <span className="label [writing-mode:vertical-rl]">22 Side St.</span>
      </div>
      {/* punched holes */}
      <span aria-hidden className="absolute -top-2.5 right-[3.6rem] size-5 rounded-full bg-obsidian md:right-[4.6rem]" />
      <span aria-hidden className="absolute -bottom-2.5 right-[3.6rem] size-5 rounded-full bg-obsidian md:right-[4.6rem]" />
    </div>
  );
}

/** Horizontal route strip: stops connected by the red line. */
export function RouteStrip({ stops, className }: { stops: string[]; className?: string }) {
  return (
    <ol className={cn("relative flex items-start justify-between", className)} aria-label="Line 22">
      <span aria-hidden className="absolute left-2 right-2 top-[7px] h-[3px] bg-blood" />
      {stops.map((s, i) => (
        <li key={s} className="relative flex flex-col items-center gap-2 text-center">
          <span className={cn("block size-[17px] rounded-full border-[3px] border-blood", i === 0 || i === stops.length - 1 ? "bg-blood" : "bg-obsidian")} />
          <span className="label max-w-[6rem] text-[0.6rem] text-dirty/70">{s}</span>
        </li>
      ))}
    </ol>
  );
}

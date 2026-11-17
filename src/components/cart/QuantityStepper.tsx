"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/format";

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  label,
  size = "md",
}: {
  value: number;
  min?: number;
  max: number;
  onChange: (n: number) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const btn = cn(
    "flex items-center justify-center text-dirty transition-colors hover:bg-dirty hover:text-obsidian disabled:pointer-events-none disabled:opacity-30",
    size === "sm" ? "size-8" : "size-12",
  );
  return (
    <div className={cn("inline-flex items-center border border-dirty/30", size === "sm" ? "h-8" : "h-12")} role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className="size-3.5" strokeWidth={1.5} />
      </button>
      <output className={cn("text-center font-mono text-sm tabular-nums", size === "sm" ? "w-7" : "w-10")} aria-live="polite">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="size-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

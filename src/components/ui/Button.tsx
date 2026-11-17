import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";

type Variant = "solid" | "outline" | "red" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden px-6 py-4 font-mono text-xs uppercase tracking-[0.16em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  solid: "bg-dirty text-obsidian hover:text-dirty",
  outline: "border border-dirty/60 text-dirty hover:text-obsidian",
  red: "bg-blood text-dirty hover:text-obsidian",
  ghost: "text-dirty hover:text-obsidian",
};

const fill: Record<Variant, string> = {
  solid: "bg-obsidian",
  outline: "bg-dirty",
  red: "bg-dirty",
  ghost: "bg-dirty",
};

function Inner({ children, variant, arrow }: { children: ReactNode; variant: Variant; arrow?: boolean }) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100 group-disabled:scale-y-0",
          fill[variant],
        )}
      />
      <span className="relative z-10 flex items-center gap-3">
        {children}
        {arrow && <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.5} />}
      </span>
    </>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
  arrow = true,
  className,
  ...rest
}: { href: string; children: ReactNode; variant?: Variant; arrow?: boolean } & Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...rest}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </Link>
  );
}

export function Button({
  children,
  variant = "solid",
  arrow = false,
  className,
  ...rest
}: { children: ReactNode; variant?: Variant; arrow?: boolean } & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </button>
  );
}

import { cn } from "@/lib/format";

/** 22SIDE wordmark. Typeset in the display face with a raised ® and a cut bar. */
export function Logo({ className, registered = true }: { className?: string; registered?: boolean }) {
  return (
    <span className={cn("font-display inline-flex items-start leading-none tracking-[-0.02em]", className)} aria-label="22SIDE">
      <span aria-hidden className="relative">
        22
        <span className="absolute left-0 right-[4%] top-[54%] h-[0.05em] bg-blood" />
      </span>
      <span aria-hidden>SIDE</span>
      {registered && (
        <span aria-hidden className="ml-[0.06em] font-sans text-[0.2em] font-bold leading-none">
          ®
        </span>
      )}
    </span>
  );
}

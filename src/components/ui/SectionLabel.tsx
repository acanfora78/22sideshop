import { cn } from "@/lib/format";

/** Magazine-style section marker: "04 / LATEST DROP ———" */
export function SectionLabel({ index, label, className }: { index?: string; label: string; className?: string }) {
  return (
    <div className={cn("label flex items-center gap-3 text-concrete", className)}>
      {index && <span className="text-blood">{index}</span>}
      {index && <span aria-hidden>/</span>}
      <span className="text-dirty">{label}</span>
      <span aria-hidden className="h-px flex-1 bg-concrete/40" />
    </div>
  );
}

export function DemoTag({ className }: { className?: string }) {
  return (
    <span className={cn("label inline-block border border-blood/70 px-1.5 py-0.5 text-[0.6rem] text-blood-bright", className)}>
      Demo
    </span>
  );
}

import { site } from "@/content/site";

/** Persistent but discreet demo disclosure. */
export function DemoBanner() {
  return (
    <div className="label fixed bottom-3 left-3 z-[60] max-w-[calc(100vw-1.5rem)] border border-blood/60 bg-obsidian/90 px-3 py-2 text-[0.58rem] text-dirty/80 backdrop-blur-sm">
      <span className="mr-2 inline-block size-1.5 animate-pulse rounded-full bg-blood-bright align-middle" aria-hidden />
      <span className="sr-only">Avviso: </span>
      Anteprima · Prezzi in arrivo
      <span className="sr-only">. {site.demoNotice}</span>
    </div>
  );
}

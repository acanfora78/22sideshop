import Image from "next/image";
import { media } from "@/content/media";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-dvh items-center overflow-hidden">
      <Image src={media.subway.url} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-40" />
      <div className="px-gutter">
        <p className="label text-blood-bright">Errore 404 — Fermata sbagliata</p>
        <h1 className="font-display text-mega mt-6">Perso?</h1>
        <p className="mt-6 max-w-md text-dirty/75">Questo treno qui non ferma. La pagina che cerchi è stata spostata, è esaurita o non è mai esistita.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">Torna alla home</ButtonLink>
          <ButtonLink href="/shop" variant="outline">
            Vedi tutto
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

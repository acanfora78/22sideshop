import Image from "next/image";
import { media } from "@/content/media";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-dvh items-center overflow-hidden">
      <Image src={media.subway.url} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-40" />
      <div className="px-gutter">
        <p className="label text-blood-bright">Error 404 — Wrong stop</p>
        <h1 className="font-display text-mega mt-6">Lost?</h1>
        <p className="mt-6 max-w-md text-dirty/75">This train doesn&apos;t stop here. The page you&apos;re after moved, sold out, or never existed.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">Back home</ButtonLink>
          <ButtonLink href="/shop" variant="outline">
            Shop all
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { media } from "@/content/media";
import { pages } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-dvh items-center overflow-hidden">
      <Image src={media.subway.url} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-40" />
      <div className="px-gutter">
        <p className="label text-blood-bright">{pages.notFound.kicker}</p>
        <h1 className="font-display text-mega mt-6">{pages.notFound.title}</h1>
        <p className="mt-6 max-w-md text-dirty/75">{pages.notFound.text}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">{pages.notFound.home}</ButtonLink>
          <ButtonLink href="/shop" variant="outline">
            {pages.notFound.shop}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

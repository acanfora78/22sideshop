import type { Metadata } from "next";
import Image from "next/image";
import { about, site } from "@/content/site";
import { media } from "@/content/media";
import { PageHero } from "@/components/collection/PageHero";
import { ImageReveal, Reveal, SplitText } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Marquee } from "@/components/motion/Marquee";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHero kicker="About" title={about.title} image={media.skyline} index="04" />

      <section className="px-gutter grid gap-10 py-16 md:grid-cols-12 md:py-24">
        <Reveal className="md:col-span-7">
          <p className="font-serif text-[clamp(1.8rem,3.6vw,3.4rem)] leading-[1.08] italic text-dirty/90">{about.intro}</p>
        </Reveal>
        <div className="md:col-span-4 md:col-start-9">
          <ImageReveal className="relative aspect-[3/4] overflow-hidden">
            <Image src={media.fireEscape.url} alt={media.fireEscape.altText} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          </ImageReveal>
          <p className="label mt-3 text-concrete">Fig. A — Brick & iron. Art-direction frame.</p>
        </div>
      </section>

      <Marquee items={[site.slogan, site.positioning, "Underground NYC", "1990s reimagined"]} className="font-display border-y border-dirty/10 py-4 text-5xl md:text-7xl" />

      <section className="px-gutter py-20 md:py-28">
        {about.chapters.map((c, i) => (
          <div key={c.n} className="grid gap-6 border-t border-dirty/15 py-10 md:grid-cols-12 md:py-14">
            <p className="label text-blood md:col-span-2">{c.n}</p>
            <SplitText as="h2" text={c.title} className="font-display text-big block md:col-span-6" />
            <Reveal className="md:col-span-4" delay={0.1 + i * 0.05}>
              <p className="text-dirty/75 md:text-lg">{c.body}</p>
            </Reveal>
          </div>
        ))}
      </section>

      <section className="relative">
        <Parallax className="h-[80vh] min-h-[480px]" speed={20}>
          <Image src={media.streetFigure.url} alt={media.streetFigure.altText} fill sizes="100vw" className="object-cover" />
        </Parallax>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-obsidian/30 px-6 text-center">
          <Logo className="text-mega" registered={false} />
          <ButtonLink href="/shop">Shop the side</ButtonLink>
        </div>
      </section>
    </>
  );
}

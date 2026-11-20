import Image from "next/image";
import type { Image as Img } from "@/lib/commerce/types";
import { SplitText } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";

/** Editorial page header used by shop / collection / about pages. */
export function PageHero({
  kicker,
  title,
  description,
  image,
  count,
  index = "22",
  countLabel = ["pezzo", "pezzi"],
}: {
  kicker: string;
  title: string;
  description?: string;
  image?: Img;
  count?: number;
  index?: string;
  countLabel?: [string, string];
}) {
  return (
    <section className="relative isolate overflow-hidden pt-[calc(var(--header-h)+2rem)]">
      {image && (
        <Parallax className="absolute inset-0 -z-10 opacity-45" speed={18}>
          <Image src={image.url} alt="" fill priority sizes="100vw" className="object-cover object-[50%_25%]" />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/30 to-obsidian" />
        </Parallax>
      )}
      <div className="px-gutter relative pb-10 md:pb-14">
        <div className="label flex items-center justify-between text-concrete">
          <span>
            <span className="text-blood">{index}</span> / {kicker}
          </span>
          {count !== undefined && (
            <span>
              {count} {count === 1 ? countLabel[0] : countLabel[1]}
            </span>
          )}
        </div>
        <SplitText as="h1" text={title} trigger="mount" delay={0.35} className="font-display text-huge mt-10 block md:mt-20" />
        {description && <p className="mt-6 max-w-xl text-base text-dirty/75 md:text-lg">{description}</p>}
      </div>
    </section>
  );
}

import { movement } from "@/content/movement";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, SplitText } from "@/components/motion/Reveal";
import { Count22, Pattern22, TwentyTwoMark } from "@/components/twentytwo/TwentyTwo";
import { RouteStrip } from "@/components/transit/Transit";

/** WHY 22 — the number explained: two equal strokes, two tracks, two sides. */
export function Why22() {
  const { why22 } = movement;
  return (
    <section id="why-22" className="relative overflow-hidden py-24 md:py-36" aria-labelledby="why22-title">
      <Pattern22 />
      <div className="px-gutter relative">
        <SectionLabel index="22" label={why22.label} />
        <div className="mt-12 grid items-center gap-10 md:mt-16 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <TwentyTwoMark className="w-full text-dirty" />
            <TwentyTwoMark fill={false} delay={0.4} className="absolute inset-0 w-full translate-x-[3%] translate-y-[3%] text-blood-bright" />
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <h2 id="why22-title">
              <SplitText text={why22.title} className="font-display text-big block" />
            </h2>
            <Reveal>
              <p className="mt-6 text-base leading-relaxed text-dirty/80 md:text-lg">{why22.body}</p>
            </Reveal>
            <div className="mt-10 flex items-end gap-6">
              <Count22 className="font-display text-[clamp(5rem,12vw,10rem)] leading-none text-blood-bright" />
              <p className="label pb-3 text-concrete">
                Line 22
                <br />
                Two tracks · one direction
              </p>
            </div>
          </div>
        </div>
        <div className="no-scrollbar mt-16 overflow-x-auto md:mt-24">
          <RouteStrip stops={["The City", "The Arrival", "The Key", "The Door", "The Store", "The Movement"]} className="min-w-[620px]" />
        </div>
      </div>
    </section>
  );
}

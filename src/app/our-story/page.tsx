import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, ScrubText, Scramble, SplitHeading } from "@/components/motion";
import { StoryHeroImage } from "@/components/story-hero-image";

export const metadata: Metadata = { title: "Our Story" };

const CHARACTER = ["Elevated", "Minimal", "Confident", "Timeless", "Rooted in the UAE"];

export default function OurStory() {
  return (
    <>
      <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-cocoa text-ivory">
        <StoryHeroImage />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-cocoa/85 via-cocoa/30 to-cocoa/30" />
        <div className="mx-auto w-full max-w-[1480px] px-6 pb-16 md:px-12 md:pb-24">
          <p className="eyebrow text-ivory/80"><Scramble text="OUR STORY" delay={0.4} /></p>
          <SplitHeading as="h1" delay={0.2} className="display mt-4 text-[calc((100vw-48px)/12.8)] md:text-[clamp(34px,6.2vw,92px)]">
            <span className="block whitespace-nowrap">Inspired by a land</span>
            <span className="block whitespace-nowrap">that sees beyond.</span>
          </SplitHeading>
        </div>
      </section>

      <section className="bg-paper px-6 py-24 md:px-12 md:py-40">
        <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-[1fr_1.4fr] md:gap-24">
          <div>
            <p className="eyebrow text-taupe"><Scramble text="THE IDEA" /></p>
            <SplitHeading className="display mt-4 text-[clamp(32px,4vw,52px)]">Aquila</SplitHeading>
          </div>
          <div className="space-y-8">
            <ScrubText className="font-serif text-[clamp(22px,2.4vw,34px)] leading-[1.4] text-ink">
              Aquila takes its name from the Latin word for eagle — a symbol of vision, perspective and seeing beyond the ordinary.
            </ScrubText>
            <ScrubText className="text-[15px] leading-[2] tracking-[0.03em] text-ink">
              A UAE-born sunglasses brand with a refined, understated point of view.
            </ScrubText>
            <ScrubText className="text-[15px] leading-[2] tracking-[0.03em] text-ink">
              Designed for those who appreciate individuality, effortless style, and the beauty of simplicity.
            </ScrubText>
          </div>
        </div>
      </section>

      <section id="values" className="px-6 py-16 text-center text-ivory md:px-12 md:py-20">
        <div className="mx-auto max-w-[1180px] border-y border-ivory/15 py-12 md:py-14">
          <p className="eyebrow text-sand"><Scramble text="MORE THAN SUNGLASSES" /></p>
          <SplitHeading className="display mt-3 text-[clamp(28px,3.4vw,44px)]">A mindset.</SplitHeading>
          <Reveal stagger={0.1} as="ul" className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:mt-10 lg:flex-nowrap lg:gap-x-7">
            {CHARACTER.map((c, i) => (
              <li key={c} className="flex items-center gap-6 lg:gap-7">
                {i > 0 && <span aria-hidden className="hidden h-1 w-1 rounded-full bg-sand/60 lg:block" />}
                <span className="font-serif text-[15px] uppercase tracking-[0.2em] text-ivory/90 lg:text-[17px]">{c}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-paper px-6 py-24 text-center md:py-32">
        <SplitHeading className="display text-[clamp(30px,4.5vw,60px)]">
          <span className="block">For those who</span>
          <span className="block">see further.</span>
        </SplitHeading>
        <Reveal delay={0.3}>
          <Link href="/shop" data-cursor="Shop" className="btn-outline mt-10"><span>Shop the collection</span><ArrowRight size={13} strokeWidth={1.2} /></Link>
        </Reveal>
      </section>
    </>
  );
}

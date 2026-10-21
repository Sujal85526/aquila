import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "Our Story" };

const CHARACTER = ["Elevated", "Minimal", "Confident", "Timeless", "Rooted in place"];

export default function OurStory() {
  return (
    <>
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-cocoa text-ivory">
        <Image src="/photos/DSC00446.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-[50%_35%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/30" />
        <Reveal className="mx-auto w-full max-w-[1480px] px-6 pb-16 md:px-12 md:pb-24">
          <p className="eyebrow text-ivory/80">Our story</p>
          <h1 className="display mt-4 max-w-4xl text-[clamp(40px,7vw,96px)]">Inspired by a land<br />that sees further.</h1>
        </Reveal>
      </section>

      <section className="bg-paper px-6 py-24 md:px-12 md:py-36">
        <Reveal className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-[1fr_1.3fr] md:gap-24">
          <div>
            <p className="eyebrow text-taupe">The idea</p>
            <h2 className="display mt-4 text-[clamp(32px,4vw,52px)]">Aquila</h2>
          </div>
          <div className="space-y-6 text-[15px] leading-[2] tracking-[0.03em] text-ink/75">
            <p>Aquila is a UAE-born sunglasses brand with a refined, understated point of view.</p>
            <p>The name is the Latin word for eagle — a symbol of vision, perspective and seeing beyond the ordinary. It is a statement of individuality, and of the confidence to see further.</p>
          </div>
        </Reveal>
      </section>

      <section id="values" className="bg-espresso px-6 py-24 text-ivory md:px-12 md:py-32">
        <div className="mx-auto max-w-[1480px]">
          <Reveal>
            <p className="eyebrow text-sand">More than sunglasses</p>
            <h2 className="display mt-4 text-[clamp(36px,5.5vw,76px)]">A mindset.</h2>
          </Reveal>
          <Reveal stagger={0.08} className="mt-14 grid gap-px bg-ivory/15 sm:grid-cols-2 lg:grid-cols-5">
            {CHARACTER.map((c, i) => (
              <div key={c} className="bg-espresso py-10 pr-6 lg:py-14">
                <span className="text-[11px] tracking-[0.3em] text-sand">0{i + 1}</span>
                <p className="mt-4 font-serif text-[26px] uppercase tracking-wide">{c}</p>
              </div>
            ))}
          </Reveal>
          <Reveal className="relative mt-16 aspect-[4/3] overflow-hidden md:aspect-[16/7]">
            <Image src="/photos/packaging-ref.jpg" alt="Aquila packaging: deep espresso box, bag and microfibre pouch" fill sizes="(min-width:1480px) 1380px, 100vw" className="object-cover object-[50%_45%]" />
          </Reveal>
        </div>
      </section>

      <section className="bg-paper px-6 py-24 text-center md:py-32">
        <Reveal>
          <h2 className="display text-[clamp(30px,4.5vw,60px)]">For those who<br />see further.</h2>
          <Link href="/shop" className="btn-outline mt-10 text-espresso"><span>Shop the collection</span><ArrowRight size={13} strokeWidth={1.2} /></Link>
        </Reveal>
      </section>
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Copy and imagery follow the brand-deck homepage mockup.
const PANELS = [
  {
    eyebrow: "Our story",
    title: ["Inspired by a land", "that sees beyond."],
    cta: "Discover Aquila",
    href: "/our-story",
    src: "/deck/story-1.jpg",
  },
  {
    eyebrow: "More than sunglasses.",
    title: ["A mindset."],
    cta: "Our values",
    href: "/our-story#values",
    src: "/deck/story-2.jpg",
  },
];

export function StoryPanels() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(el, { yPercent: -3 }, { yPercent: 3, ease: "none", force3D: true, scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 } });
        });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-copy]", { y: 36, opacity: 0, duration: 1.1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 78%", once: true } });
      });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="grid gap-px bg-ivory/40 md:grid-cols-2">
      {PANELS.map((p) => (
        <article key={p.title[0]} className="relative isolate flex min-h-[400px] items-end overflow-hidden bg-cocoa text-ivory md:aspect-[2.19/1] md:min-h-0">
          <div className="absolute -inset-y-[4%] inset-x-0 -z-20 will-change-transform" data-parallax>
            <Image src={p.src} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent md:bg-gradient-to-r md:from-ink/45 md:via-transparent" />
          <div data-copy className="w-full px-8 pb-10 md:px-[4.8vw] md:pb-[2.6vw]">
            <p className="eyebrow text-[10px] tracking-[0.26em] text-ivory/90 md:text-[clamp(9px,0.8vw,13px)]">{p.eyebrow}</p>
            <h2 className="display mt-3 text-[clamp(28px,8vw,40px)] md:mt-[0.5vw] md:text-[clamp(22px,2.75vw,48px)]">
              {p.title.map((t) => (
                <span key={t} className="block">{t}</span>
              ))}
            </h2>
            <Link href={p.href} className="btn-outline mt-6 !px-5 !py-[11px] text-[9.5px] md:mt-[1.4vw]">
              <span>{p.cta}</span>
              <ArrowRight size={12} strokeWidth={1.2} />
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}

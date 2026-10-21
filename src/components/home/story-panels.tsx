"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PANELS = [
  {
    eyebrow: "Our story",
    title: ["Inspired by a land", "that sees further."],
    cta: "Discover Aquila",
    href: "/our-story",
    src: "/photos/DSC00403.jpg",
    pos: "50% 30%",
  },
  {
    eyebrow: "More than sunglasses.",
    title: ["A mindset."],
    cta: "Our values",
    href: "/our-story#values",
    src: "/photos/DSC00712.jpg",
    pos: "60% 40%",
  },
];

export function StoryPanels() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(el, { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.from("[data-copy]", { y: 40, opacity: 0, duration: 1.1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="grid md:grid-cols-2 md:gap-px md:bg-ivory/30">
      {PANELS.map((p) => (
        <article key={p.title[0]} className="relative isolate flex min-h-[460px] items-end overflow-hidden bg-cocoa text-ivory md:min-h-[clamp(420px,38vw,560px)]">
          <div className="absolute -inset-y-[9%] inset-x-0 -z-20" data-parallax>
            <Image src={p.src} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" style={{ objectPosition: p.pos }} />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/10" />
          <div data-copy className="px-8 pb-12 md:px-[clamp(32px,4vw,56px)] md:pb-14">
            <p className="eyebrow text-[10px] tracking-[0.28em] text-ivory/85">{p.eyebrow}</p>
            <h2 className="display mt-3 text-[clamp(28px,3.2vw,40px)]">
              {p.title.map((t) => (
                <span key={t} className="block">{t}</span>
              ))}
            </h2>
            <Link href={p.href} className="btn-outline mt-7">
              <span>{p.cta}</span>
              <ArrowRight size={13} strokeWidth={1.2} />
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}

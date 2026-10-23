"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, SplitText, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { whenReady } from "@/lib/ready";
import { Magnetic } from "../motion";

// Copy follows the brand-deck homepage mockup.
// Set SHOW_PHOTOS to false for plain flat panels (no pictures).
const SHOW_PHOTOS = true;
// pos / posMd: where the photo sits in the frame on phones / laptops (keeps faces clear of the text).
// top: true puts the text block in the upper middle on phones (over the dark rock), else it sits low.
const PANELS = [
  { eyebrow: "Our story", title: ["Inspired by a land", "that sees beyond"], cta: "Discover Aquila", href: "/our-story", src: "/deck/story-man.jpg", pos: "50% 14%", posMd: "50% 30%", top: true, ratio: "aspect-[1/1.15]", shift: "md:left-[17%] md:[mask-image:linear-gradient(to_right,transparent,#000_26%)]", cursor: "Discover" },
  { eyebrow: "More than sunglasses.", title: ["A mindset"], cta: "Our values", href: "/our-story#values", src: "/deck/story-glasses.jpg", pos: "50% 52%", posMd: "50% 58%", top: false, ratio: "aspect-square", shift: "", cursor: "Values" },
];

export function StoryPanels() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = root.current!;
      const mm = gsap.matchMedia();
      const splits: SplitText[] = [];
      let off = () => {};

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", el);
        panels.forEach((p, n) => {
          const title = p.querySelector<HTMLElement>("[data-title]")!;
          const split = SplitText.create(title, { type: "lines", mask: "lines", linesClass: "pb-[0.08em]" });
          splits.push(split);
          gsap.set(p.querySelector("[data-img]"), { scale: 1.25 });
          gsap.set(split.lines, { yPercent: 110 });
          gsap.set(p.querySelectorAll("[data-rise]"), { autoAlpha: 0, y: 18 });
          ScrollTrigger.create({
            trigger: p,
            start: "top 82%",
            once: true,
            onEnter: () => {
              gsap
                .timeline({ delay: n * 0.12 })
                .to(p.querySelector("[data-cover]"), { scaleY: 0, duration: 1.4, ease: "expo.inOut" })
                .to(p.querySelector("[data-img]"), { scale: 1, duration: 2, ease: "expo.out", clearProps: "transform" }, 0)
                .set(p.querySelector("[data-cover]"), { display: "none" })
                .to(split.lines, { yPercent: 0, duration: 1.2, stagger: 0.09, ease: "expo.out" }, 0.7)
                .to(p.querySelectorAll("[data-rise]"), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 0.9);
            },
          });
          // parallax drift (laptops only)
          mm.add("(min-width: 768px)", () => {
            gsap.fromTo(p.querySelector("[data-parallax]"), { yPercent: n ? 4 : -4 }, { yPercent: n ? -4 : 4, ease: "none", force3D: true, scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: 0.6 } });
          });
        });
      });
      off = whenReady(() => ScrollTrigger.refresh());
      return () => {
        off();
        mm.revert();
        splits.forEach((s) => s.revert());
      };
    },
    { scope: root },
  );
  return (
    <section ref={root} className="grid gap-px bg-ivory/40 md:grid-cols-2">
      {PANELS.map((p, n) => (
        <article key={p.title[0]} data-panel className={`group relative isolate flex ${p.ratio} items-end overflow-hidden text-ivory md:aspect-[5/4] ${SHOW_PHOTOS ? "bg-cocoa" : n === 0 ? "bg-espresso" : "bg-cocoa"}`}>
          <span data-cover aria-hidden className="absolute inset-0 z-30 origin-bottom bg-paper" />
          <div data-parallax className={`absolute -inset-y-[4%] inset-x-0 -z-20 ${p.shift}`}>
            <div data-img className="absolute inset-0 transition-transform duration-[1800ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]">
              {SHOW_PHOTOS && <Image src={p.src} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover object-(--pos) md:object-(--pos-md)" style={{ "--pos": p.pos, "--pos-md": p.posMd } as React.CSSProperties} />}
            </div>
          </div>
          {SHOW_PHOTOS && <div className={`absolute inset-0 -z-10 ${p.top ? "bg-gradient-to-r from-ink/45 via-ink/5 to-transparent" : "bg-gradient-to-t from-ink/55 via-ink/10 to-transparent"} md:bg-gradient-to-r md:from-ink/65 md:via-ink/10 md:to-transparent`} />}
          <div className={`w-full px-6 md:self-end md:px-[4.8vw] md:pb-[2.6vw] md:pt-0 ${p.top ? "self-start pt-[34%]" : "pb-[18%]"}`}>
            <p data-rise className="eyebrow text-[8px] tracking-[0.26em] text-ivory/90 md:text-[clamp(9px,0.8vw,13px)]">{p.eyebrow}</p>
            <h2 data-title className="display mt-2 text-[19px] md:mt-[0.5vw] md:text-[clamp(22px,2.75vw,48px)]">
              {p.title.map((t) => (
                <span key={t} className="block">{t}</span>
              ))}
            </h2>
            <div data-rise className="mt-4 md:mt-[1.4vw]">
              <Magnetic>
                <Link href={p.href} data-cursor={p.cursor} className="btn-outline !px-3.5 !py-[7px] !text-[8px] md:!px-5 md:!py-[11px] md:!text-[9.5px]">
                  <span>{p.cta}</span>
                  <ArrowRight size={12} strokeWidth={1.2} />
                </Link>
              </Magnetic>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

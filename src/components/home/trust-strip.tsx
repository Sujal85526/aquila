"use client";

import { useRef } from "react";
import { ShieldCheck, Truck } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { whenReady } from "@/lib/ready";
import { Scramble, onceVisible } from "../motion";

/** Open hand holding a sprout, matching the "A greater vision" icon in the deck mockup. */
function HandSprout({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
      <path d="M18 17v-6" />
      <path d="M18 14c0-3.2-2-5-5-5 0 3.2 2 5 5 5Z" />
      <path d="M18 12c0-3.2 2-5.2 5.2-5.2 0 3.2-2 5.2-5.2 5.2Z" />
      <path d="M3 24.5h5.5l5.2 2.4h6.1c1.3 0 1.9 1.7.7 2.3l-4.4 2.2" />
      <path d="M8.5 24.5l9.2-3.1c2.3-.8 5.6.2 6.9 2.1L33 22.8" />
      <path d="M13.7 26.9l-.9 1.9H3" />
    </svg>
  );
}

const ITEMS = [
  { icon: <ShieldCheck size={36} strokeWidth={0.9} className="shrink-0" />, title: "Premium quality", sub: "Crafted to last" },
  { icon: <Truck size={36} strokeWidth={0.9} className="shrink-0" />, title: "UAE wide delivery", sub: "Fast & reliable" },
  { icon: <HandSprout />, title: "A greater vision", sub: "People · Culture · A brighter tomorrow" },
];

/** Icons draw themselves in stroke by stroke, the divider lines grow, and the labels scramble into place. */
export function TrustStrip() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = root.current!;
      const items = gsap.utils.toArray<HTMLElement>("[data-item]", el);
      const strokes = items.map((it) => Array.from(it.querySelectorAll("svg path, svg circle, svg rect, svg line")));
      strokes.flat().forEach((s) => gsap.set(s, { drawSVG: "0%" }));
      gsap.set(el.querySelectorAll("[data-sub]"), { autoAlpha: 0, y: 8 });
      gsap.set(el.querySelectorAll("[data-divider]"), { scaleY: 0 });
      let stop = () => {};
      const off = whenReady(() => {
        stop = onceVisible(el, () => {
          const tl = gsap.timeline();
          items.forEach((it, n) => {
            tl.to(strokes[n], { drawSVG: "100%", duration: 1.5, stagger: 0.08, ease: "power2.inOut" }, n * 0.25)
              .to(it.querySelector("[data-sub]"), { autoAlpha: 1, y: 0, duration: 0.9 }, n * 0.25 + 0.7);
          });
          tl.to(el.querySelectorAll("[data-divider]"), { scaleY: 1, duration: 1.1, stagger: 0.2, ease: "expo.out" }, 0.2);
        });
      });
      return () => {
        off();
        stop();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid gap-7 bg-paper px-8 py-10 md:grid-cols-3 md:gap-0 md:px-[3vw] md:py-[1.9vw]">
      {ITEMS.map(({ icon, title, sub }, i) => (
        <div key={title} data-item className="relative flex items-center gap-5 md:justify-center">
          {i > 0 && <span data-divider aria-hidden className="absolute left-0 top-1/2 hidden h-[130%] w-px origin-center -translate-y-1/2 bg-ink/20 md:block" />}
          {icon}
          <div>
            <p className="eyebrow text-[10px] font-normal tracking-[0.2em] md:text-[clamp(9px,0.78vw,13px)]">
              <Scramble text={title.toUpperCase()} delay={i * 0.2} />
            </p>
            <p data-sub className="mt-1.5 text-[8.5px] uppercase tracking-[0.2em] text-taupe md:text-[clamp(7px,0.6vw,10px)]">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

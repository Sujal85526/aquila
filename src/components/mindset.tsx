"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Scramble, SplitHeading } from "./motion";

const WORDS = ["Elevated", "Minimal", "Confident", "Timeless"];

/** Heading plus four numbered columns: a line draws across each, the word rises out of a mask. */
export function Mindset() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = root.current!;
      const lines = el.querySelectorAll("[data-line]");
      const words = el.querySelectorAll("[data-word]");
      const nums = el.querySelectorAll("[data-num]");
      gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(words, { yPercent: 115 });
      gsap.set(nums, { autoAlpha: 0, y: 8 });
      const st = ScrollTrigger.create({
        trigger: el.querySelector("[data-grid]"),
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap
            .timeline()
            .to(lines, { scaleX: 1, duration: 1.4, stagger: 0.14, ease: "expo.inOut" }, 0)
            .to(words, { yPercent: 0, duration: 1.1, stagger: 0.14, ease: "expo.out" }, 0.35)
            .to(nums, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.14 }, 0.5);
        },
      });
      return () => st.kill();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mx-auto max-w-[1180px]">
      <div className="text-center">
        <p className="eyebrow text-sand"><Scramble text="MORE THAN SUNGLASSES" /></p>
        <SplitHeading className="display mt-3 text-[clamp(28px,3.4vw,44px)]">A mindset.</SplitHeading>
      </div>
      <ul data-grid className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 md:mt-12 md:grid-cols-4 md:gap-x-10">
        {WORDS.map((w, i) => (
          <li key={w} className="group relative pt-5">
            <span data-line aria-hidden className="absolute inset-x-0 top-0 h-px bg-ivory/35 transition-colors duration-500 group-hover:bg-ivory" />
            <span data-num className="block text-[11px] tracking-[0.3em] text-sand/70">0{i + 1}</span>
            <span className="mt-3 block overflow-hidden pb-1">
              <span data-word className="block font-serif text-[clamp(20px,2.1vw,30px)] uppercase leading-tight tracking-[0.06em] text-ivory transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-2">{w}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

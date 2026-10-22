"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** A hairline across the top of the page that fills as you scroll. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: document.documentElement, start: 0, end: "max", scrub: 0.2, invalidateOnRefresh: true },
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.trigger === document.documentElement && t.kill());
  });
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-ivory/80 mix-blend-difference" />
    </div>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { whenReady } from "@/lib/ready";
import { onceVisible } from "./motion";

/** Oversized AQUILA wordmark that rises out of the footer edge, then breathes on scroll. */
export function FooterWordmark() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = root.current!;
      const mark = el.querySelector("[data-mark]")!;
      gsap.set(mark, { yPercent: 105 });
      let stop = () => {};
      const off = whenReady(() => {
        stop = onceVisible(el, () => gsap.to(mark, { yPercent: 0, duration: 1.8, ease: "expo.out" }), "0px 0px -4% 0px");
      });
      return () => {
        off();
        stop();
      };
    },
    { scope: root },
  );
  return (
    <div ref={root} aria-hidden className="mx-auto w-full max-w-[1480px] overflow-hidden px-6 pb-2 md:px-12">
      <span data-mark className="aq-logo mx-auto block w-[min(100%,980px)] text-ivory/90" />
    </div>
  );
}

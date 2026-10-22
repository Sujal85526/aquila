"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { whenReady } from "@/lib/ready";

/** Full-bleed hero photo: eases out of a zoom on load, then drifts slower than the page. */
export function StoryHeroImage() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = root.current!;
      gsap.set(el, { scale: 1.3 });
      const off = whenReady(() => gsap.to(el, { scale: 1.05, duration: 2.6, ease: "expo.out" }));
      const t = gsap.to(el.parentElement!.querySelector("[data-drift]"), { yPercent: 14, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top top", end: "bottom top", scrub: true } });
      return () => {
        off();
        t.scrollTrigger?.kill();
        t.kill();
      };
    },
    { scope: root },
  );
  return (
    <div data-drift className="absolute inset-0 -z-20">
      <div ref={root} className="absolute inset-0 will-change-transform">
        <Image src="/photos/DSC00446.jpg" alt="" fill priority sizes="100vw" quality={90} className="object-cover object-[50%_35%]" />
      </div>
    </div>
  );
}

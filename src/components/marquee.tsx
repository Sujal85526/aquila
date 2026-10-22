"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const WORDS = ["For those who", "See further", "Aquila", "Abu Dhabi", "Vision", "Perspective"];

/**
 * Ticker band. It drifts on its own, and the page's scroll speed pushes it: scroll down and it
 * rushes left, scroll up and it reverses, then it eases back to a gentle drift.
 */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = track.current!;
      const half = () => el.scrollWidth / 2;
      let x = 0;
      let boost = 0; // extra speed from scrolling
      let dir = 1;
      let visible = true;
      const set = gsap.quickSetter(el, "x", "px");
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(root.current!);
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          dir = self.direction;
          boost = Math.min(Math.abs(self.getVelocity()) / 40, 38);
        },
      });
      const tick = (_: number, dt: number) => {
        if (!visible) return;
        boost *= 0.92; // ease back to the base drift
        x -= (46 + boost * 30) * dir * (dt / 1000);
        const w = half();
        if (x <= -w) x += w;
        if (x > 0) x -= w;
        set(x);
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        st.kill();
      };
    },
    { scope: root },
  );

  const row = (
    <div className="flex shrink-0 items-center">
      {WORDS.map((w, n) => (
        <span key={w} className="flex items-center">
          <span
            className={`font-serif text-[clamp(26px,4.6vw,64px)] uppercase leading-none tracking-[0.04em] ${n % 2 ? "text-transparent [-webkit-text-stroke:1px_#faf0d7]" : "text-ivory"}`}
          >
            {w}
          </span>
          <span aria-hidden className="mx-[clamp(18px,3vw,44px)] text-[clamp(14px,1.6vw,22px)] text-sand">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} aria-hidden className="relative overflow-hidden bg-espresso py-[clamp(14px,2vw,28px)]">
      <div ref={track} className="flex w-max will-change-transform">
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}

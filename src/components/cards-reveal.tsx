"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { whenReady } from "@/lib/ready";
import { onceVisible } from "./motion";

/** Grid whose items tip up out of the page in 3D, one after another; siblings dim while one is hovered. */
export function CardsReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const kids = Array.from(ref.current!.children);
      gsap.set(kids, { autoAlpha: 0, y: 110, rotationX: 38, transformPerspective: 900, transformOrigin: "50% 100%" });
      let stop = () => {};
      const off = whenReady(() => {
        stop = onceVisible(ref.current!, () =>
          gsap.to(kids, { autoAlpha: 1, y: 0, rotationX: 0, duration: 1.6, stagger: 0.14, ease: "expo.out", clearProps: "opacity,visibility,transform" }),
        );
      });
      return () => {
        off();
        stop();
      };
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`${className ?? ""} [&:hover>a:not(:hover)]:opacity-35 [&>a]:transition-opacity [&>a]:duration-500`}>
      {children}
    </div>
  );
}

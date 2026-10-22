"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { whenReady } from "@/lib/ready";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Fades/lifts children into view as they scroll in. `stagger` animates direct children one by one. */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 36,
  stagger,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const targets = stagger ? Array.from(el.children) : el;
      gsap.set(targets, { y, opacity: 0 });
      const build = contextSafe(() =>
        gsap.to(targets, {
          y: 0,
          opacity: 1,
          duration: 1.1,
          delay,
          ease: "power3.out",
          stagger: stagger ?? 0,
          clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        }),
      );
      return whenReady(build);
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

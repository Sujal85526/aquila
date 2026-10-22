"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { whenReady } from "@/lib/ready";

/**
 * Calls `play` once the element is on screen. IntersectionObserver rather than ScrollTrigger so it
 * fires reliably on first paint, after client navigation and on phones (address-bar resizes).
 */
export function onceVisible(el: Element, play: () => void, margin = "0px 0px -8% 0px") {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        play();
      }
    },
    { rootMargin: margin },
  );
  io.observe(el);
  return () => io.disconnect();
}

/** Fades children up as they enter the viewport. Pass `stagger` to animate direct children in turn. */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  stagger,
  delay = 0,
  y = 32,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  stagger?: number;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const targets = stagger ? Array.from(ref.current!.children) : ref.current;
      gsap.set(targets, { y, autoAlpha: 0 });
      let stop = () => {};
      const off = whenReady(() => {
        stop = onceVisible(ref.current!, () => gsap.to(targets, { y: 0, autoAlpha: 1, duration: 1.1, delay, stagger, ease: "expo.out", clearProps: "opacity,visibility,transform" }));
      });
      return () => {
        off();
        stop();
      };
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Heading whose lines slide up from behind a mask when scrolled into view. */
export function SplitHeading({ children, className, as: Tag = "h2", delay = 0 }: { children: ReactNode; className?: string; as?: ElementType; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const split = SplitText.create(ref.current!, { type: "lines", mask: "lines", linesClass: "pb-[0.08em]" });
      gsap.set(split.lines, { yPercent: 110 });
      let stop = () => {};
      const off = whenReady(() => {
        stop = onceVisible(ref.current!, () => gsap.to(split.lines, { yPercent: 0, duration: 1.25, delay, stagger: 0.09, ease: "expo.out" }));
      });
      return () => {
        off();
        stop();
        split.revert();
      };
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export function ScrubText({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const split = SplitText.create(ref.current!, { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.16 },
        { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 82%", end: "bottom 55%", scrub: true } },
      );
      return () => split.revert();
    },
    { scope: ref },
  );
  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}

/** Text that scrambles into place when it first scrolls into view (and on hover when `hover`). */
export function Scramble({ text, className, hover, delay = 0 }: { text: string; className?: string; hover?: boolean; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const run = (d = 1) => gsap.to(ref.current, { duration: d, scrambleText: { text, chars: "upperCase", speed: 0.6, revealDelay: 0.1 } });
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      let stop = () => {};
      const off = whenReady(() => {
        stop = onceVisible(ref.current!, () => gsap.delayedCall(delay, () => run(1.3)));
      });
      return () => {
        off();
        stop();
      };
    },
    { scope: ref },
  );
  return (
    <span ref={ref} className={className} onMouseEnter={hover ? () => run(0.7) : undefined}>
      {text}
    </span>
  );
}

/** Pulls its child gently toward the pointer (laptops only). */
export function Magnetic({ children, className, strength = 0.28 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
      const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * strength);
        y((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        x(0);
        y(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );
  return (
    <span ref={ref} className={`inline-flex ${className ?? ""}`}>
      {children}
    </span>
  );
}

/** Block that opens like a shutter as it scrolls into view (a cover slides away; only transforms animate). */
export function ClipReveal({ children, className, delay = 0, from = "bottom", cover = "bg-paper" }: { children: ReactNode; className?: string; delay?: number; from?: "bottom" | "left" | "right"; cover?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = ref.current!;
      const shade = el.querySelector("[data-cover]")!;
      const inner = el.querySelector("[data-content]");
      const axis = from === "bottom" ? { scaleY: 0 } : { scaleX: 0 };
      const origin = from === "left" ? "100% 50%" : from === "right" ? "0% 50%" : "50% 100%";
      gsap.set(shade, { transformOrigin: origin });
      if (inner) gsap.set(inner, { scale: 1.2 });
      let stop = () => {};
      const off = whenReady(() => {
        stop = onceVisible(el, () => {
          gsap.to(shade, { ...axis, duration: 1.4, delay, ease: "expo.inOut" });
          if (inner) gsap.to(inner, { scale: 1, duration: 2, delay, ease: "expo.out", clearProps: "transform" });
        });
      });
      return () => {
        off();
        stop();
      };
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <div data-content className="absolute inset-0">
        {children}
      </div>
      <span data-cover aria-hidden className={`absolute inset-0 z-10 ${cover}`} />
    </div>
  );
}

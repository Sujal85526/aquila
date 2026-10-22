"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Curtain footer: the footer is pinned behind the page, and the page slides up to uncover it. The
 * footer's content eases up out of a slight offset as it is revealed.
 */
export function PageFrame({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const foot = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  useLayoutEffect(() => {
    const el = foot.current!;
    const measure = () => setH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!h || prefersReducedMotion()) return;
      const inner = foot.current!.querySelector("[data-footer-inner]");
      if (!inner) return;
      const t = gsap.fromTo(
        inner,
        { yPercent: -16 },
        { yPercent: 0, ease: "none", scrollTrigger: { trigger: document.documentElement, start: () => ScrollTrigger.maxScroll(window) - h, end: "max", scrub: true, invalidateOnRefresh: true } },
      );
      const box = foot.current!;
      const check = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        box.style.visibility = window.scrollY > max - h - window.innerHeight ? "visible" : "hidden";
      };
      check();
      window.addEventListener("scroll", check, { passive: true });
      window.addEventListener("resize", check);
      return () => {
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
        box.style.visibility = "";
        t.scrollTrigger?.kill();
        t.kill();
      };
    },
    { dependencies: [h] },
  );

  return (
    <>
      <div className="relative z-10 min-h-dvh bg-paper" style={{ marginBottom: h }}>
        {children}
      </div>
      <div ref={foot} className="fixed inset-x-0 bottom-0 z-0">
        {footer}
      </div>
    </>
  );
}

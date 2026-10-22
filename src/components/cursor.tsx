"use client";

import { useRef } from "react";
import { gsap, useGSAP, hasFinePointer, prefersReducedMotion } from "@/lib/gsap";

/**
 * Laptop-only cursor: a small ring that trails the pointer, swells over links and buttons, and
 * shows a label over anything marked `data-cursor="View"`.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!hasFinePointer() || prefersReducedMotion()) return;
      const el = ring.current!;
      gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
      let shown = false;
      const move = (e: PointerEvent) => {
        if (!shown) {
          shown = true;
          gsap.to(el, { autoAlpha: 1, duration: 0.4 });
        }
        x(e.clientX);
        y(e.clientY);
      };
      const over = (e: PointerEvent) => {
        const t = e.target as HTMLElement;
        const tagged = t.closest<HTMLElement>("[data-cursor]");
        const interactive = t.closest("a,button,input,select,label,[role=button]");
        if (tagged) {
          label.current!.textContent = tagged.dataset.cursor ?? "";
          gsap.to(el, { width: 84, height: 84, backgroundColor: "rgba(250,240,215,0.92)", borderColor: "transparent", duration: 0.45, ease: "expo.out" });
          gsap.to(label.current, { autoAlpha: 1, duration: 0.3 });
        } else if (interactive) {
          gsap.to(el, { width: 46, height: 46, backgroundColor: "rgba(250,240,215,0)", borderColor: "rgba(250,240,215,0.9)", duration: 0.4, ease: "expo.out" });
          gsap.to(label.current, { autoAlpha: 0, duration: 0.2 });
        } else {
          gsap.to(el, { width: 14, height: 14, backgroundColor: "rgba(250,240,215,0)", borderColor: "rgba(250,240,215,0.9)", duration: 0.4, ease: "expo.out" });
          gsap.to(label.current, { autoAlpha: 0, duration: 0.2 });
        }
      };
      const leave = () => {
        shown = false;
        gsap.to(el, { autoAlpha: 0, duration: 0.3 });
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerover", over);
      document.documentElement.addEventListener("pointerleave", leave);
      return () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ring },
  );

  return (
    <div
      ref={ring}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[120] hidden size-[14px] place-items-center rounded-full border border-ivory/90 shadow-[0_0_0_1px_rgba(36,30,26,0.28)] md:grid [@media(hover:none)]:hidden"
    >
      <span ref={label} className="text-[9px] font-medium uppercase tracking-[0.2em] text-espresso opacity-0" />
    </div>
  );
}

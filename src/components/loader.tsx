"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markReady } from "@/lib/ready";

const pageLoaded = () =>
  new Promise<void>((resolve) => {
    const done = () => resolve();
    if (document.readyState === "complete") return done();
    window.addEventListener("load", done, { once: true });
    setTimeout(done, 5000); // never trap the visitor behind the loader
  });

/**
 * Horizon intro: a single line draws across the screen, the wordmark rises out of it, then the
 * screen opens along that line — top half up, bottom half down — to reveal the page.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.body.style.overflow = "hidden";
      const finish = () => {
        document.body.style.overflow = "";
        el.style.display = "none";
      };

      if (reduce) {
        gsap.to(el, { opacity: 0, duration: 0.4, onStart: markReady, onComplete: finish });
        return;
      }

      const intro = gsap.timeline();
      intro
        .to(q("[data-line]"), { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.15)
        .fromTo(q("[data-logo]"), { y: 0, yPercent: 125 }, { yPercent: 0, duration: 1.25, ease: "power4.out" }, 0.7)
        .to(q("[data-tag]"), { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 1.25)
        .call(() => {
          intro.pause();
          // hold at least a beat on the finished mark, then open as soon as the page is ready
          Promise.all([pageLoaded(), new Promise((r) => setTimeout(r, 450))]).then(() => {
            gsap
              .timeline({ onComplete: finish })
              .to(q("[data-tag]"), { opacity: 0, duration: 0.3 }, 0)
              .to(q("[data-line]"), { opacity: 0, duration: 0.3 }, 0.1)
              .call(markReady, undefined, 0.3)
              .to(q("[data-top]"), { yPercent: -100, duration: 1.2, ease: "power4.inOut" }, 0.25)
              .to(q("[data-bottom]"), { yPercent: 100, duration: 1.2, ease: "power4.inOut" }, 0.25);
          });
        });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="aq-loader fixed inset-0 z-[100] text-ivory" role="status" aria-label="Loading AQUILA">
      <div data-top className="absolute inset-x-0 top-0 flex h-1/2 items-end justify-center bg-espresso will-change-transform">
        <div className="w-[min(60vw,400px)] overflow-hidden pb-[3px]">
          <span data-logo aria-hidden className="aq-logo w-full" style={{ transform: "translateY(125%)" }} />
        </div>
      </div>
      <div data-bottom className="absolute inset-x-0 bottom-0 flex h-1/2 justify-center bg-espresso will-change-transform">
        <p data-tag className="mt-7 translate-y-3 text-[10px] uppercase tracking-[0.5em] text-sand opacity-0 md:text-[11px]">
          For those who see further
        </p>
      </div>
      <span data-line aria-hidden className="absolute left-0 top-1/2 z-10 block h-px w-full origin-center scale-x-0 bg-ivory/80" />
    </div>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { markReady } from "@/lib/ready";

const pageLoaded = () =>
  new Promise<void>((resolve) => {
    const done = () => resolve();
    if (document.readyState === "complete") return done();
    window.addEventListener("load", done, { once: true });
    setTimeout(done, 5000); // never trap the visitor behind the loader
  });

/**
 * Intro: the AQUILA wordmark fills in from below while a hairline runs across the bottom, the line
 * "for those who see further" scrambles in, then the espresso curtain lifts over the hero.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const finish = () => {
        document.body.style.overflow = "";
        el.style.display = "none";
      };
      document.body.style.overflow = "hidden";
      if (prefersReducedMotion()) {
        gsap.to(el, { opacity: 0, duration: 0.4, onStart: markReady, onComplete: finish });
        return;
      }
      const q = gsap.utils.selector(el);

      const intro = gsap.timeline();
      intro
        .fromTo(q("[data-fill]"), { y: 0, yPercent: 100 }, { yPercent: 0, duration: 1.7, ease: "power2.inOut" }, 0.2)
        .fromTo(q("[data-fill-inner]"), { y: 0, yPercent: -100 }, { yPercent: 0, duration: 1.7, ease: "power2.inOut" }, 0.2)
        .to(q("[data-line]"), { scaleX: 1, duration: 1.7, ease: "power2.inOut" }, 0.2)
        .to(q("[data-tag]"), { autoAlpha: 1, duration: 0.3 }, 0.5)
        .to(q("[data-tag]"), { duration: 1.4, scrambleText: { text: "For those who see further", chars: "upperCase", speed: 0.6, revealDelay: 0.2 } }, 0.5)
        .call(() => {
          intro.pause();
          pageLoaded().then(() => {
            gsap
              .timeline({ onComplete: finish })
              .to(q("[data-mark]"), { scale: 0.9, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, 0.15)
              .to(q("[data-meta]"), { autoAlpha: 0, duration: 0.4 }, 0.15)
              .call(markReady, undefined, 0.75)
              .to(el, { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, 0.55);
          });
        });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="aq-loader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-espresso text-ivory" role="status" aria-label="Loading AQUILA">
      <div data-mark className="relative w-[min(58vw,380px)]">
        <span aria-hidden className="aq-logo w-full opacity-[0.14]" />
        <div data-fill aria-hidden className="absolute inset-0 overflow-hidden" style={{ transform: "translateY(100%)" }}>
          <div data-fill-inner className="absolute inset-0" style={{ transform: "translateY(-100%)" }}>
            <span className="aq-logo w-full" />
          </div>
        </div>
      </div>
      <p data-meta data-tag className="absolute inset-x-0 bottom-10 text-center text-[10px] uppercase tracking-[0.5em] text-sand opacity-0 md:text-[11px]">
        For those who see further
      </p>
      <div data-meta className="absolute inset-x-0 bottom-0 h-px bg-ivory/10">
        <div data-line className="h-full origin-left scale-x-0 bg-ivory/70" />
      </div>
    </div>
  );
}

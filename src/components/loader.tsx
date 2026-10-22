"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { markReady } from "@/lib/ready";

gsap.registerPlugin(useGSAP);

const pageLoaded = () =>
  new Promise<void>((resolve) => {
    const done = () => resolve();
    if (document.readyState === "complete") return done();
    window.addEventListener("load", done, { once: true });
    setTimeout(done, 5000); // never trap the visitor behind the loader
  });

/** Brand intro: the AQUILA wordmark wipes in while the page loads, then the espresso curtain lifts. */
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

      const counter = q("[data-count]")[0] as HTMLElement;
      const progress = { v: 0 };
      const paint = () => {
        counter.textContent = String(Math.round(progress.v)).padStart(3, "0");
      };

      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
      tl.to(q("[data-logo]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5 }, 0.25)
        .fromTo(q("[data-logo]"), { scale: 1.06 }, { scale: 1, duration: 2, ease: "power2.out" }, 0.25)
        .to(q("[data-tag]"), { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 1.0)
        .to(q("[data-meta]"), { opacity: 1, duration: 0.8 }, 0.4)
        .to(progress, { v: 90, duration: 1.7, ease: "power2.inOut", onUpdate: paint }, 0.2)
        .to(q("[data-bar]"), { scaleX: 0.9, duration: 1.7, ease: "power2.inOut" }, 0.2);

      tl.call(
        () => {
          tl.pause();
          pageLoaded().then(() => {
            const out = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: finish });
            out
              .to(progress, { v: 100, duration: 0.45, ease: "power1.out", onUpdate: paint })
              .to(q("[data-bar]"), { scaleX: 1, duration: 0.45, ease: "power1.out" }, 0)
              .to([q("[data-tag]"), q("[data-meta]")], { opacity: 0, duration: 0.35 }, 0.55)
              .to(q("[data-logo-wrap]"), { yPercent: -18, opacity: 0, duration: 0.7, ease: "power2.in" }, 0.7)
              .call(markReady, undefined, 1.0)
              .to(el, { yPercent: -100, duration: 1.15, ease: "power4.inOut" }, 0.95)
              .to(q("[data-curve]"), { scaleY: 0, duration: 0.9, ease: "power2.out" }, 1.45);
          });
        },
        undefined,
        ">",
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} className="aq-loader fixed inset-0 z-[100] text-ivory will-change-transform" role="status" aria-label="Loading AQUILA">
      <div className="grain absolute inset-0 flex flex-col items-center justify-center bg-espresso">
        <div data-logo-wrap className="relative w-[min(64vw,440px)]">
          <span aria-hidden className="aq-logo w-full opacity-[0.12]" />
          <span data-logo aria-hidden className="aq-logo absolute inset-0 w-full" style={{ clipPath: "inset(0% 100% 0% 0%)" }} />
        </div>
        <p data-tag className="mt-9 translate-y-3 text-[10px] uppercase tracking-[0.5em] text-sand opacity-0 md:text-[11px]">
          For those who see further
        </p>

        <div data-meta className="absolute inset-x-6 bottom-8 opacity-0 md:inset-x-12 md:bottom-10">
          <div className="mb-4 flex items-end justify-between text-[10px] uppercase tracking-[0.3em] text-sand">
            <span>Abu Dhabi</span>
            <span data-count className="font-sans text-[22px] font-light tabular-nums tracking-[0.12em] text-ivory md:text-[28px]">000</span>
          </div>
          <div className="h-px w-full bg-ivory/15">
            <div data-bar className="h-full origin-left scale-x-0 bg-ivory" />
          </div>
        </div>
      </div>
      <div
        data-curve
        aria-hidden
        className="absolute left-0 top-full h-[14vw] w-full origin-top bg-espresso"
        style={{ borderRadius: "0 0 50% 50% / 0 0 100% 100%" }}
      />
    </div>
  );
}

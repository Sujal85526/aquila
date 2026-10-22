"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, SplitText, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { whenReady } from "@/lib/ready";
import { Magnetic } from "../motion";

/**
 * Hero: the brand film, full-bleed, with the headline. It stays pinned while the page slides up
 * over it (curtain reveal), and only plays while it is on screen.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  // headline + film reveal once the intro has lifted
  useGSAP(
    () => {
      const el = root.current!;
      const reduce = prefersReducedMotion();
      const split = reduce ? null : SplitText.create("[data-headline]", { type: "chars", mask: "chars" });
      const eyebrow = el.querySelector<HTMLElement>("[data-eyebrow]")!;
      const fades = gsap.utils.toArray<HTMLElement>("[data-fade]", el);
      if (!reduce) {
        gsap.set(split!.chars, { yPercent: 115 });
        gsap.set(fades, { autoAlpha: 0, y: 14 });
        gsap.set("[data-film]", { scale: 1.16 });
      }
      const off = whenReady(() => {
        video.current?.play().catch(() => {});
        if (reduce) return;
        gsap
          .timeline()
          .to("[data-film]", { scale: 1, duration: 2.8, ease: "expo.out" }, 0)
          .to(split!.chars, { yPercent: 0, duration: 1.2, stagger: 0.035, ease: "expo.out" }, 0.45)
          .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.4)
          .to(eyebrow, { duration: 1.1, scrambleText: { text: eyebrow.dataset.text ?? "", chars: "upperCase", speed: 0.7, revealDelay: 0.15 } }, 0.4)
          .to(fades.filter((f) => f !== eyebrow), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, 0.9);
      });
      return () => {
        off();
        split?.revert();
      };
    },
    { scope: root },
  );

  // only decode the film while it is on screen
  useGSAP(
    () => {
      const v = video.current!;
      const io = new IntersectionObserver(([e]) => {
        if (!window.__aqReady) return;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      }, { threshold: 0.05 });
      io.observe(root.current!);
      return () => io.disconnect();
    },
    { scope: root },
  );

  // curtain reveal as the page slides over
  useGSAP(
    () => {
      const el = root.current!;
      if (prefersReducedMotion()) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: document.documentElement, start: 0, end: () => el.offsetHeight, scrub: true, invalidateOnRefresh: true } })
          .to("[data-shade]", { opacity: 0.7 }, 0)
          .to("[data-ui]", { opacity: 0 }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Aquila" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-cocoa text-ivory">
      <div data-film className="absolute inset-0 will-change-transform">
        <video ref={video} className="h-full w-full object-cover object-[50%_35%]" src="/video/hero-v2.mp4" poster="/video/hero-v2-poster.jpg" muted loop playsInline preload="auto" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/45 via-ink/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-ink/20 md:from-ink/60 md:to-ink/10" />

      <div className="relative z-10 flex h-full items-end px-6 pb-[9vh] md:px-0 md:pb-[10vh] md:pl-[4.5vw]">
        <div className="max-w-[900px] text-[#e6d8b6]">
          <p data-fade data-eyebrow data-text="For those who" className="mb-2 font-serif text-[clamp(30px,9.4vw,46px)] uppercase leading-[1.05] tracking-[0.06em] md:mb-[0.7vw] md:text-[clamp(38px,4.3vw,78px)]">
            For those who
          </p>
          <h1 data-headline className="font-sans text-[clamp(13px,3.8vw,18px)] font-normal uppercase leading-[1.2] tracking-[0.46em] md:text-[clamp(15px,1.7vw,30px)]">
            <span className="block pb-[0.06em]">See further</span>
          </h1>
          <div data-fade className="mt-6 md:mt-[2vw]">
            <Magnetic>
              <Link href="/shop" className="btn-outline" data-cursor="Shop">
                <span>Shop the collection</span>
                <ArrowRight size={13} strokeWidth={1.2} />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
      <div data-shade aria-hidden className="pointer-events-none absolute inset-0 z-[15] bg-ink opacity-0" />

      <div data-ui className="absolute bottom-7 right-7 z-20 hidden items-center gap-3 md:bottom-[1.6vw] md:right-[4vw] md:flex">
        <span className="text-[10px] uppercase tracking-[0.34em]">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-ivory/30">
          <span className="aq-cue absolute inset-x-0 top-0 h-1/2 bg-ivory" />
        </span>
      </div>
    </section>
  );
}

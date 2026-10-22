"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { whenReady } from "@/lib/ready";

type Slide = {
  id: string;
  eyebrow: string;
  lines: string[];
  muted?: number; // index of a line rendered in a muted tone
  /** headline size and left offset, taken from the brand-deck mockups */
  size: string;
  left: string;
  video?: boolean;
  src: string;
  pos: string;
  mobilePos: string;
};

const SLIDES: Slide[] = [
  {
    id: "see-further",
    eyebrow: "For those who",
    lines: ["See further."],
    size: "md:text-[clamp(48px,6.1vw,104px)]",
    left: "md:pl-[15vw]",
    src: "/deck/hero-1.jpg",
    pos: "50% 50%",
    mobilePos: "78% 50%",
  },
  {
    id: "perspective",
    eyebrow: "For those who see further.",
    lines: ["A new perspective", "on tomorrow."],
    muted: 1,
    size: "md:text-[clamp(40px,4.7vw,84px)]",
    left: "md:pl-[9.5vw]",
    src: "/deck/hero-2.jpg",
    pos: "50% 50%",
    mobilePos: "76% 50%",
  },
  {
    id: "beyond",
    eyebrow: "For those who see further.",
    lines: ["See beyond", "the ordinary."],
    size: "md:text-[clamp(40px,4.7vw,84px)]",
    left: "md:pl-[9.5vw]",
    video: true,
    src: "/video/hero-v2-poster.jpg",
    pos: "50% 30%",
    mobilePos: "50% 30%",
  },
];

export function Hero() {
  const [i, setI] = useState(0);
  const root = useRef<HTMLElement>(null);
  const first = useRef(true);
  const paused = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let ctx: gsap.Context | undefined;
    const play = () => {
      ctx = gsap.context(() => {
        const slides = gsap.utils.toArray<HTMLElement>("[data-slide]");
        slides.forEach((s, idx) => {
          const active = idx === i;
          gsap.to(s, { opacity: active ? 1 : 0, duration: first.current ? 0 : 1.2, ease: "power2.inOut", zIndex: active ? 2 : 1 });
          if (active) {
            gsap.fromTo(s.querySelectorAll("[data-bg]"), { scale: 1.08 }, { scale: 1, duration: 9, ease: "power1.out", force3D: true });
            gsap.fromTo(s.querySelectorAll("[data-line]"), { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.25, stagger: 0.12, ease: "power4.out", delay: first.current ? 0.1 : 0.5 });
            gsap.fromTo(s.querySelectorAll("[data-fade]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out", delay: first.current ? 0.3 : 0.7 });
          }
        });
        first.current = false;
      }, el);
    };
    const off = first.current ? whenReady(play) : (play(), () => {});
    return () => {
      off();
      ctx?.revert();
    };
  }, [i]);

  // Curtain reveal: the hero is pinned (sticky) by its wrapper; as the page slides over it, it slowly zooms and darkens.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: document.documentElement, start: 0, end: () => el.offsetHeight, scrub: true, invalidateOnRefresh: true },
      });
      tl.to("[data-stage]", { scale: 1.08, force3D: true }, 0)
        .to("[data-shade]", { opacity: 0.65 }, 0)
        .to("[data-ui]", { opacity: 0 }, 0)
        .to("[data-arrow]", { opacity: 0 }, 0);
    });
    return () => mm.revert();
  }, []);

  useEffect(() => {
    const t = setInterval(() => !paused.current && setI((c) => (c + 1) % SLIDES.length), 7500);
    return () => clearInterval(t);
  }, [i]);

  const prev = () => setI((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setI((c) => (c + 1) % SLIDES.length);

  return (
    <section
      ref={root}
      aria-roledescription="carousel"
      aria-label="Aquila highlights"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-cocoa text-ivory md:aspect-[2.54/1] md:h-auto md:min-h-[520px]"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div data-stage className="absolute inset-0 will-change-transform">
        {SLIDES.map((s, idx) => (
          <div key={s.id} data-slide className="absolute inset-0 will-change-[opacity]" style={{ opacity: idx === 0 ? 1 : 0 }} aria-hidden={idx !== i}>
            {s.video ? (
              <VideoBackdrop />
            ) : (
              <div data-bg className="absolute inset-0 will-change-transform">
                <Image
                  src={s.src}
                  alt=""
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="object-cover md:![object-position:var(--pos)]"
                  style={{ objectPosition: s.mobilePos, ["--pos" as string]: s.pos }}
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-ink/35 via-ink/5 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-ink/20 md:from-ink/30 md:to-ink/15" />

            <div className={`relative z-10 flex h-full items-end px-7 pb-24 md:items-center md:px-0 md:pb-0 ${s.left}`}>
              <div className="max-w-[760px] md:pt-6">
                <p data-fade style={{ opacity: 0 }} className="mb-3 text-[12px] uppercase tracking-[0.34em] md:mb-[1.1vw] md:text-[clamp(11px,1.05vw,17px)]">
                  {s.eyebrow}
                </p>
                <h1 className={`font-serif text-[clamp(36px,10vw,56px)] font-normal uppercase leading-[1.02] tracking-[0.02em] ${s.size}`}>
                  {s.lines.map((l, n) => (
                    <span key={n} className="block overflow-hidden pb-[0.06em]">
                      <span data-line style={{ transform: "translateY(110%)" }} className={`block will-change-transform ${s.muted === n ? "text-ivory/60" : ""}`}>{l}</span>
                    </span>
                  ))}
                </h1>
                <div data-fade style={{ opacity: 0 }} className="mt-8 md:mt-[2.3vw]">
                  <Link href="/shop" className="btn-outline">
                    <span>Shop the collection</span>
                    <ArrowRight size={13} strokeWidth={1.2} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div data-shade aria-hidden className="pointer-events-none absolute inset-0 z-[15] bg-ink opacity-0" />

      <button aria-label="Previous slide" onClick={prev} data-arrow className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 p-3 opacity-90 transition hover:opacity-100 md:block md:left-[1.6vw]">
        <ChevronLeft size={28} strokeWidth={1} />
      </button>
      <button aria-label="Next slide" onClick={next} data-arrow className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 p-3 opacity-90 transition hover:opacity-100 md:block md:right-[1.6vw]">
        <ChevronRight size={28} strokeWidth={1} />
      </button>

      <div data-ui className="absolute inset-x-0 bottom-6 z-20 flex justify-center gap-3 md:bottom-[1.4vw]">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === i}
            onClick={() => setI(idx)}
            className={`h-[7px] w-[7px] rounded-full border border-ivory transition-all duration-500 ${idx === i ? "bg-ivory" : "bg-transparent"}`}
          />
        ))}
      </div>
    </section>
  );
}

/** Real brand film (portrait). Full-bleed on phones; on wide screens it sits as a framed portrait on the right. */
function VideoBackdrop() {
  return (
    <>
      <div data-bg className="absolute inset-0 md:hidden">
        <video className="h-full w-full object-cover object-[50%_30%]" src="/video/hero-v2.mp4" poster="/video/hero-v2-poster.jpg" autoPlay muted loop playsInline preload="metadata" />
      </div>
      <div className="absolute inset-0 hidden bg-gradient-to-r from-cocoa via-espresso to-cocoa md:block">
        <div className="absolute inset-y-0 right-[8vw] aspect-[9/16] h-full">
          <video data-bg className="h-full w-full object-cover" src="/video/hero-v2.mp4" poster="/video/hero-v2-poster.jpg" autoPlay muted loop playsInline preload="metadata" />
        </div>
      </div>
    </>
  );
}

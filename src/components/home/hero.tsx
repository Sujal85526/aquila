"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, SplitText, ScrollTrigger, useGSAP, hasFinePointer, prefersReducedMotion } from "@/lib/gsap";
import { whenReady } from "@/lib/ready";
import { Magnetic } from "../motion";

type Slide = {
  id: string;
  eyebrow: string;
  lines: string[];
  muted?: number; // index of a line rendered in a muted tone
  /** headline size and side offset, taken from the brand-deck mockups */
  size: string;
  side: string;
  align?: "right";
  video?: boolean;
  src: string;
  pos: string;
  mobilePos: string;
};

const FURTHER = { eyebrow: "For those who", lines: ["See further."], size: "md:text-[clamp(48px,6.1vw,104px)]" };
const DURATION = 7.5;

const SLIDES: Slide[] = [
  { id: "see-further", ...FURTHER, side: "md:pl-[15vw]", src: "/photos/DSC00450.jpg", pos: "72% 38%", mobilePos: "72% 38%" },
  {
    id: "perspective",
    eyebrow: "For those who see further.",
    lines: ["A new perspective", "on tomorrow."],
    muted: 1,
    size: "md:text-[clamp(40px,4.7vw,84px)]",
    side: "md:pr-[9.5vw]",
    align: "right",
    src: "/photos/DSC00361.jpg",
    pos: "28% 40%",
    mobilePos: "24% 40%",
  },
  { id: "film", ...FURTHER, side: "md:pl-[15vw]", video: true, src: "/video/hero-v2-poster.jpg", pos: "50% 30%", mobilePos: "50% 30%" },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const cur = useRef(0); // index of the slide that is on screen
  const started = useRef(false); // intro has played
  const busy = useRef<gsap.core.Timeline | null>(null);
  const progress = useRef<gsap.core.Tween | null>(null);
  const splits = useRef<SplitText[]>([]);
  const paused = useRef(false);

  // Phones open on the brand film, then rotate through the photos; laptops keep the original order.
  useLayoutEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      const v = SLIDES.findIndex((s) => s.video);
      cur.current = v;
      setI(v);
    }
  }, []);

  const go = (n: number) => setI((n + SLIDES.length) % SLIDES.length);

  // Build the character splits once; revert on unmount.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = root.current!;
      splits.current = gsap.utils.toArray<HTMLElement>("[data-headline]", el).map((h) => SplitText.create(h, { type: "chars", mask: "chars" }));
      splits.current.forEach((s) => gsap.set(s.chars, { yPercent: 115 }));
      gsap.set(gsap.utils.toArray("[data-fade]", el), { autoAlpha: 0, y: 14 });
      return () => splits.current.forEach((s) => s.revert());
    },
    { scope: root },
  );

  // Slide changes (and the first reveal once the loader has lifted).
  useGSAP(
    () => {
      const el = root.current!;
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", el);
      const reduce = prefersReducedMotion();

      const textIn = (s: HTMLElement, at: number, tl: gsap.core.Timeline) => {
        const idx = slides.indexOf(s);
        const chars = splits.current[idx]?.chars;
        if (chars && !reduce) tl.to(chars, { yPercent: 0, duration: 1.2, stagger: 0.035, ease: "expo.out" }, at);
        const eyebrow = s.querySelector<HTMLElement>("[data-eyebrow]");
        if (eyebrow && !reduce) {
          const text = eyebrow.dataset.text ?? "";
          tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.3 }, at)
            .to(eyebrow, { duration: 1.1, scrambleText: { text, chars: "upperCase", speed: 0.7, revealDelay: 0.15 } }, at);
        } else if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.2 }, at);
        tl.to(s.querySelectorAll("[data-fade]:not([data-eyebrow])"), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, at + 0.35);
      };
      const textOut = (s: HTMLElement, tl: gsap.core.Timeline) => {
        const idx = slides.indexOf(s);
        const chars = splits.current[idx]?.chars;
        if (chars) tl.to(chars, { yPercent: -115, duration: 0.5, stagger: 0.01, ease: "power3.in" }, 0);
        tl.to(s.querySelectorAll("[data-fade]"), { autoAlpha: 0, y: -10, duration: 0.35 }, 0);
      };
      const startProgress = (idx: number) => {
        progress.current?.kill();
        const fills = gsap.utils.toArray<HTMLElement>("[data-fill]", el);
        fills.forEach((f, n) => gsap.set(f, { scaleX: n === idx ? 0 : 0 }));
        progress.current = gsap.to(fills[idx], { scaleX: 1, duration: DURATION, ease: "none", onComplete: () => !paused.current && go(idx + 1) });
        if (paused.current) progress.current.pause();
      };

      // first load: hold everything hidden, then reveal when the loader lifts
      if (!started.current) {
        slides.forEach((s, n) => gsap.set(s, { autoAlpha: n === i ? 1 : 0, zIndex: n === i ? 2 : 1 }));
        const play = () => {
          started.current = true;
          cur.current = i;
          const s = slides[i];
          const tl = gsap.timeline();
          if (!reduce) {
            tl.fromTo(el.querySelector("[data-stage]"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "expo.inOut", clearProps: "clipPath" }, 0)
              .fromTo(s.querySelectorAll("[data-bg]"), { scale: 1.25 }, { scale: 1, duration: 2.4, ease: "expo.out", clearProps: "transform" }, 0.05);
          }
          textIn(s, reduce ? 0 : 0.75, tl);
          tl.to(el.querySelectorAll("[data-ui]"), { autoAlpha: 1, duration: 0.8 }, reduce ? 0 : 1.2);
          tl.add(() => startProgress(i), reduce ? 0 : 1.2);
        };
        const off = whenReady(play);
        return () => off();
      }

      // slide change: wipe the new slide in over the old one
      if (i === cur.current) return;
      busy.current?.progress(1);
      const next = slides[i];
      const prev = slides[cur.current];
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(prev, { autoAlpha: 0, zIndex: 1 });
          gsap.set(prev.querySelectorAll("[data-bg]"), { x: 0 });
          gsap.set(next, { zIndex: 2, clearProps: "clipPath" });
          busy.current = null;
        },
      });
      busy.current = tl;
      cur.current = i;
      progress.current?.kill();
      gsap.set(next, { autoAlpha: 1, zIndex: 3, clipPath: reduce ? "none" : "inset(0 0 0 100%)" });
      gsap.set(prev, { zIndex: 2 });
      textOut(prev, tl);
      if (!reduce) {
        tl.to(next, { clipPath: "inset(0 0 0 0%)", duration: 1.3, ease: "expo.inOut" }, 0.1)
          .fromTo(next.querySelectorAll("[data-bg]"), { scale: 1.3 }, { scale: 1, duration: 2, ease: "expo.out" }, 0.1)
          .to(prev.querySelectorAll("[data-bg]"), { x: "-7%", duration: 1.3, ease: "expo.inOut" }, 0.1);
      } else tl.set({}, {}, 0.1);
      textIn(next, 0.7, tl);
      tl.add(() => startProgress(i), 0.9);
    },
    { scope: root, dependencies: [i] },
  );

  // Curtain reveal + mouse parallax.
  useGSAP(
    () => {
      const el = root.current!;
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: document.documentElement, start: 0, end: () => el.offsetHeight, scrub: true, invalidateOnRefresh: true },
          })
          .to("[data-stage]", { scale: 1.08, force3D: true }, 0)
          .to("[data-shade]", { opacity: 0.7 }, 0)
          .to("[data-ui]", { opacity: 0 }, 0)
          .to("[data-arrow]", { opacity: 0 }, 0);
      });
      if (hasFinePointer()) {
        const bgs = gsap.utils.toArray<HTMLElement>("[data-bg]", el);
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(bgs, { xPercent: nx * -2.2, yPercent: ny * -2.2, duration: 1.2, ease: "power3.out", overwrite: "auto" });
          gsap.to("[data-headline]", { x: nx * 14, y: ny * 8, duration: 1.2, ease: "power3.out", overwrite: "auto" });
        };
        el.addEventListener("pointermove", move);
        return () => {
          el.removeEventListener("pointermove", move);
          mm.revert();
        };
      }
      return () => mm.revert();
    },
    { scope: root },
  );

  const hold = (on: boolean) => {
    paused.current = on;
    if (on) progress.current?.pause();
    else progress.current?.resume();
  };

  return (
    <section
      ref={root}
      aria-roledescription="carousel"
      aria-label="Aquila highlights"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-cocoa text-ivory md:h-[100svh]"
      onMouseEnter={() => hold(true)}
      onMouseLeave={() => hold(false)}
    >
      <div data-stage className="absolute inset-0 will-change-transform">
        {SLIDES.map((s, idx) => (
          <div
            key={s.id}
            data-slide
            className={`absolute inset-0 will-change-[opacity,clip-path] ${s.video ? "opacity-0 max-md:opacity-100" : idx === 0 ? "opacity-100 max-md:opacity-0" : "opacity-0"}`}
            aria-hidden={idx !== i}
          >
            {s.video ? (
              <div data-bg className="absolute -inset-[3%] will-change-transform">
                <video className="h-full w-full object-cover object-[50%_35%]" src="/video/hero-v2.mp4" poster="/video/hero-v2-poster.jpg" autoPlay muted loop playsInline preload="auto" />
              </div>
            ) : (
              <div data-bg className="absolute -inset-[3%] will-change-transform">
                <Image
                  src={s.src}
                  alt=""
                  fill
                  priority={idx === 0}
                  quality={90}
                  sizes="106vw"
                  className="object-cover md:![object-position:var(--pos)]"
                  style={{ objectPosition: s.mobilePos, ["--pos" as string]: s.pos }}
                />
              </div>
            )}
            <div className={`absolute inset-0 bg-gradient-to-r from-ink/45 via-ink/10 to-transparent ${s.align ? "md:bg-gradient-to-l" : ""}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-ink/20 md:from-ink/30 md:to-ink/15" />

            <div className={`relative z-10 flex h-full items-end px-7 pb-28 md:items-center md:px-0 md:pb-0 ${s.align ? "md:justify-end md:text-right" : ""} ${s.side}`}>
              <div className="max-w-[760px] md:pt-6">
                <p data-fade data-eyebrow data-text={s.eyebrow} className="mb-3 text-[12px] uppercase tracking-[0.34em] md:mb-[1.1vw] md:text-[clamp(11px,1.05vw,17px)]">
                  {s.eyebrow}
                </p>
                <h1 data-headline className={`font-serif text-[clamp(36px,10vw,56px)] font-normal uppercase leading-[1.02] tracking-[0.02em] ${s.size}`}>
                  {s.lines.map((l, n) => (
                    <span key={n} className={`block pb-[0.06em] ${s.muted === n ? "text-ivory/60" : ""}`}>
                      {l}
                    </span>
                  ))}
                </h1>
                <div data-fade className="mt-8 md:mt-[2.3vw]">
                  <Magnetic>
                    <Link href="/shop" className="btn-outline" data-cursor="Shop">
                      <span>Shop the collection</span>
                      <ArrowRight size={13} strokeWidth={1.2} />
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div data-shade aria-hidden className="pointer-events-none absolute inset-0 z-[15] bg-ink opacity-0" />

      <button aria-label="Previous slide" onClick={() => go(i - 1)} data-arrow className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 p-3 opacity-90 transition hover:opacity-100 md:block md:left-[1.6vw]">
        <ChevronLeft size={28} strokeWidth={1} />
      </button>
      <button aria-label="Next slide" onClick={() => go(i + 1)} data-arrow className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 p-3 opacity-90 transition hover:opacity-100 md:block md:right-[1.6vw]">
        <ChevronRight size={28} strokeWidth={1} />
      </button>

      <div data-ui style={{ opacity: 0 }} className="absolute inset-x-0 bottom-7 z-20 flex justify-center gap-3 md:bottom-[1.6vw]">
        {SLIDES.map((s, idx) => (
          <button key={s.id} aria-label={`Go to slide ${idx + 1}`} aria-current={idx === i} onClick={() => go(idx)} className={`group relative h-6 w-10 ${s.video ? "max-md:-order-1" : ""}`}>
            <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-ivory/35 transition-all group-hover:h-[2px]" />
            <span data-fill className="absolute inset-x-0 top-1/2 block h-px origin-left -translate-y-1/2 scale-x-0 bg-ivory group-hover:h-[2px]" />
          </button>
        ))}
      </div>
    </section>
  );
}

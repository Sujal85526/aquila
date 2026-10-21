"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  id: string;
  eyebrow?: string;
  lines: string[];
  muted?: number; // index of a line rendered in muted tone
  align: "left" | "right";
  video?: boolean;
  src: string;
  pos: string;
};

const SLIDES: Slide[] = [
  { id: "see-further", eyebrow: "For those who", lines: ["See further."], align: "left", src: "/photos/DSC00450.jpg", pos: "72% 38%" },
  { id: "perspective", eyebrow: "For those who see further.", lines: ["A new perspective", "on tomorrow."], muted: 1, align: "right", src: "/photos/DSC00361.jpg", pos: "28% 40%" },
  { id: "vision", eyebrow: "Aquila — Abu Dhabi", lines: ["Made for the", "light of home."], align: "left", video: true, src: "/video/hero-poster.jpg", pos: "50% 30%" },
];

export function Hero() {
  const [i, setI] = useState(0);
  const root = useRef<HTMLElement>(null);
  const first = useRef(true);
  const paused = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]");
      slides.forEach((s, idx) => {
        const active = idx === i;
        gsap.to(s, { opacity: active ? 1 : 0, duration: first.current ? 0 : 1.2, ease: "power2.inOut", zIndex: active ? 2 : 1 });
        if (active) {
          gsap.fromTo(s.querySelectorAll("[data-bg]"), { scale: 1.12 }, { scale: 1, duration: 8, ease: "power1.out" });
          const lines = s.querySelectorAll("[data-line]");
          gsap.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.25, stagger: 0.12, ease: "power4.out", delay: first.current ? 0.35 : 0.5 });
          gsap.fromTo(s.querySelectorAll("[data-fade]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out", delay: first.current ? 0.55 : 0.7 });
        }
      });
      first.current = false;
    }, el);
    return () => ctx.revert();
  }, [i]);

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
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-cocoa text-ivory md:h-[clamp(560px,86vh,820px)]"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {SLIDES.map((s, idx) => (
        <div key={s.id} data-slide className="absolute inset-0" style={{ opacity: idx === 0 ? 1 : 0 }} aria-hidden={idx !== i}>
          {s.video ? <VideoBackdrop /> : (
            <div data-bg className="absolute inset-0">
              <Image src={s.src} alt="" fill priority={idx === 0} sizes="100vw" className="object-cover" style={{ objectPosition: s.pos }} />
            </div>
          )}
          <div className={`absolute inset-0 ${s.align === "left" ? "bg-gradient-to-r" : "bg-gradient-to-l"} from-ink/70 via-ink/20 to-transparent`} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/25" />

          <div
            className={`relative z-10 mx-auto flex h-full max-w-[1480px] items-center px-7 md:px-[clamp(64px,8vw,120px)] ${s.align === "right" ? "justify-end text-right" : ""}`}
          >
            <div className="max-w-[640px] pt-10">
              {s.eyebrow && (
                <p data-fade className={`mb-3 text-[12px] uppercase tracking-[0.42em] md:text-[15px] ${s.id === "see-further" ? "" : "text-ivory/85"}`}>
                  {s.eyebrow}
                </p>
              )}
              <h1 className="font-serif text-[clamp(44px,7.4vw,88px)] font-normal uppercase leading-[1.02] tracking-[0.015em]">
                {s.lines.map((l, n) => (
                  <span key={n} className="block overflow-hidden pb-[0.06em]">
                    <span data-line className={`block ${s.muted === n ? "text-ivory/60" : ""}`}>{l}</span>
                  </span>
                ))}
              </h1>
              <div data-fade className="mt-9">
                <Link href="/shop" className="btn-outline">
                  <span>Shop the collection</span>
                  <ArrowRight size={14} strokeWidth={1.2} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button aria-label="Previous slide" onClick={prev} className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 p-3 opacity-80 transition hover:opacity-100 md:block md:left-8">
        <ChevronLeft size={30} strokeWidth={1} />
      </button>
      <button aria-label="Next slide" onClick={next} className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 p-3 opacity-80 transition hover:opacity-100 md:block md:right-8">
        <ChevronRight size={30} strokeWidth={1} />
      </button>

      <div className="absolute inset-x-0 bottom-7 z-20 flex justify-center gap-3">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === i}
            onClick={() => setI(idx)}
            className={`h-[7px] w-[7px] rounded-full border border-ivory transition-all duration-500 ${idx === i ? "w-6 bg-ivory" : "bg-transparent"}`}
          />
        ))}
      </div>
    </section>
  );
}

/** Portrait film: full-bleed on phones; on wide screens it sits as a framed portrait over a blurred copy of itself. */
function VideoBackdrop() {
  return (
    <>
      <div data-bg className="absolute inset-0 md:hidden">
        <video className="h-full w-full object-cover object-[50%_28%]" src="/video/hero.mp4" poster="/video/hero-poster.jpg" autoPlay muted loop playsInline preload="auto" />
      </div>
      <div className="absolute inset-0 hidden md:block">
        <Image src="/video/hero-poster.jpg" alt="" fill sizes="100vw" className="scale-125 object-cover opacity-60 blur-2xl" />
        <div className="absolute inset-y-0 right-[6vw] w-[min(34vw,460px)] xl:right-[9vw]">
          <video data-bg className="h-full w-full object-cover object-[50%_30%]" src="/video/hero.mp4" poster="/video/hero-poster.jpg" autoPlay muted loop playsInline preload="auto" />
          <div className="absolute inset-y-0 -left-px w-24 bg-gradient-to-r from-cocoa/60 to-transparent" />
        </div>
      </div>
    </>
  );
}

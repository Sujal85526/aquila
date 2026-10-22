"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { CONTACT } from "@/lib/products";
import { ArrowRight } from "lucide-react";
import { Magnetic, Reveal, SplitHeading } from "../motion";

const FEED: { src: string; href: string; pos: string; video?: string }[] = [
  { src: "/instagram/post-1.jpg", href: "https://www.instagram.com/p/DVJbVolko84/", pos: "50% 60%" },
  { src: "/instagram/post-2.jpg", href: "https://www.instagram.com/p/DVdPdMNEjDl/", pos: "50% 50%" },
  { src: "/instagram/reel-3.jpg", video: "/instagram/reel-3.mp4", href: "https://www.instagram.com/reel/DVENcHjkg51/", pos: "50% 45%" },
  { src: "/instagram/post-4.jpg", href: "https://www.instagram.com/p/DVEITfHEsHL/", pos: "50% 50%" },
  { src: "/instagram/reel-5.jpg", video: "/instagram/reel-5.mp4", href: "https://www.instagram.com/reel/DVBr3VHkiiW/", pos: "50% 40%" },
];

const N = FEED.length;

/** Coverflow: the front photo sits flat in the middle, its neighbours fan out behind it. Swipe or drag to bring the next one forward. */
function Carousel() {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stageEl = stage.current!;
    const cards = Array.from(stageEl.querySelectorAll<HTMLElement>("[data-card]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { pos: 0 };
    let spacing = 160;
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastT = 0;
    let vx = 0;
    let visible = true;
    let timer = 0;
    let tween: gsap.core.Tween | null = null;

    const layout = () => {
      const w = stageEl.clientWidth < 640 ? 190 : stageEl.clientWidth < 1100 ? 250 : 320;
      const h = Math.round(w * 1.22);
      spacing = w * (stageEl.clientWidth < 640 ? 0.52 : 0.58);
      stageEl.style.height = `${h + 70}px`;
      stageEl.style.setProperty("--w", `${w}px`);
      stageEl.style.setProperty("--h", `${h}px`);
    };

    const paint = () => {
      cards.forEach((c, i) => {
        let d = (((i - state.pos) % N) + N) % N;
        if (d > N / 2) d -= N;
        const ad = Math.abs(d);
        const sign = d < 0 ? -1 : 1;
        const x = Math.sign(d) * (Math.min(ad, 1) * spacing * 1.25 + Math.max(ad - 1, 0) * spacing * 0.7);
        const rot = -sign * Math.min(ad, 1) * 48;
        const z = -Math.min(ad, 2.5) * 140;
        c.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${rot}deg)`;
        c.style.zIndex = String(Math.round(100 - ad * 10));
        c.style.opacity = String(ad > 2.4 ? 0 : ad < 1.6 ? 1 : 1 - (ad - 1.6) * 1.25);
        c.style.filter = `brightness(${1 - Math.min(ad, 2) * 0.22})`;
        c.style.pointerEvents = ad > 2.4 ? "none" : "auto";
      });
    };

    const goTo = (target: number) => {
      tween?.kill();
      tween = gsap.to(state, { pos: target, duration: reduced ? 0.01 : 1, ease: "expo.out", onUpdate: paint });
    };
    const next = (dir = 1) => goTo(Math.round(state.pos) + dir);
    const restart = () => {
      window.clearInterval(timer);
      if (!reduced) timer = window.setInterval(() => visible && !dragging && next(1), 4500);
    };

    const down = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      vx = 0;
      lastX = e.clientX;
      lastT = performance.now();
      tween?.kill();
      stageEl.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const now = performance.now();
      vx = dx / Math.max(now - lastT, 1);
      lastX = e.clientX;
      lastT = now;
      moved += Math.abs(dx);
      state.pos -= dx / (spacing * 1.1);
      paint();
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      goTo(Math.round(state.pos - vx * 1.2));
      restart();
    };
    const click = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const card = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
      if (!card) return;
      const i = cards.indexOf(card);
      let d = (((i - state.pos) % N) + N) % N;
      if (d > N / 2) d -= N;
      if (Math.abs(d) > 0.5) {
        e.preventDefault(); // a side photo comes to the front first
        goTo(Math.round(state.pos + d));
        restart();
      }
    };

    layout();
    paint();
    const videos = Array.from(stageEl.querySelectorAll("video"));
    const io = new IntersectionObserver(
      ([en]) => {
        visible = en.isIntersecting;
        videos.forEach((v) => (visible && !reduced ? v.play().catch(() => {}) : v.pause()));
      },
      { rootMargin: "100px" },
    );
    io.observe(stageEl);
    const ro = new ResizeObserver(() => {
      layout();
      paint();
    });
    ro.observe(stageEl);
    stageEl.addEventListener("pointerdown", down);
    stageEl.addEventListener("pointermove", move);
    stageEl.addEventListener("pointerup", up);
    stageEl.addEventListener("pointercancel", up);
    stageEl.addEventListener("click", click, true);
    restart();
    return () => {
      window.clearInterval(timer);
      tween?.kill();
      io.disconnect();
      ro.disconnect();
      stageEl.removeEventListener("pointerdown", down);
      stageEl.removeEventListener("pointermove", move);
      stageEl.removeEventListener("pointerup", up);
      stageEl.removeEventListener("pointercancel", up);
      stageEl.removeEventListener("click", click, true);
    };
  }, []);

  return (
    <div
      ref={stage}
      className="relative mx-auto mt-6 w-full cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing md:mt-8"
      style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
      aria-label="Aquila on Instagram"
    >
      {FEED.map((f) => (
        <a
          key={f.src}
          data-card
          href={f.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="View"
          draggable={false}
          aria-label="Aquila on Instagram"
          className="absolute left-1/2 top-1/2 block overflow-hidden rounded-[26px] bg-cocoa shadow-[0_24px_40px_-24px_rgba(0,0,0,0.4)]"
          style={{ width: "var(--w)", height: "var(--h)" }}
        >
          {f.video ? (
            <video
              src={f.video}
              poster={f.src}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: f.pos }}
            />
          ) : (
            <Image src={f.src} alt="" fill sizes="320px" draggable={false} className="pointer-events-none object-cover" style={{ objectPosition: f.pos }} />
          )}
        </a>
      ))}
    </div>
  );
}

export function InstagramStrip() {
  return (
    <section className="overflow-hidden bg-paper py-20 text-center md:py-32" aria-labelledby="ig-title">
      <div className="mx-auto flex max-w-[1480px] flex-col items-center px-6 md:px-12">
        <SplitHeading as="h2" className="font-serif text-[clamp(38px,7vw,88px)] font-medium uppercase leading-[0.95] tracking-[0.02em] text-ink">
          <span id="ig-title">Follow the journey</span>
        </SplitHeading>
      </div>
      <Reveal>
        <Carousel />
      </Reveal>
      <Reveal className="mt-4 flex justify-center md:mt-8">
        <Magnetic>
          <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-outline drift" data-cursor="Follow">
            <span>Follow us</span>
            <ArrowRight size={13} strokeWidth={1.2} />
          </a>
        </Magnetic>
      </Reveal>
    </section>
  );
}

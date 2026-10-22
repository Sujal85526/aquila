"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { CONTACT } from "@/lib/products";
import { InstagramIcon } from "../icons";
import { Reveal, SplitHeading } from "../motion";

const FEED = [
  { src: "/photos/DSC00436.jpg", pos: "62% 30%" },
  { src: "/photos/DSC00403.jpg", pos: "50% 30%" },
  { src: "/deck/story-1c.jpg", pos: "62% 50%" },
  { src: "/deck/story-2c.jpg", pos: "78% 50%" },
  { src: "/photos/DSC00712.jpg", pos: "66% 35%" },
  { src: "/photos/DSC00361.jpg", pos: "28% 40%" },
  { src: "/photos/DSC00450.jpg", pos: "50% 35%" },
  { src: "/photos/DSC00592.jpg", pos: "50% 35%" },
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
      stageEl.style.height = `${h + 110}px`;
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
      tween = gsap.to(state, { pos: target, duration: reduced ? 0.01 : 0.9, ease: "power3.out", onUpdate: paint });
    };
    const next = (dir = 1) => goTo(Math.round(state.pos) + dir);
    const restart = () => {
      window.clearInterval(timer);
      if (!reduced) timer = window.setInterval(() => visible && !dragging && next(1), 3600);
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
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { rootMargin: "100px" });
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
      className="relative mx-auto mt-10 w-full cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing md:mt-14"
      style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
      aria-label="Aquila on Instagram"
    >
      {FEED.map((f) => (
        <a
          key={f.src}
          data-card
          href={CONTACT.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="View"
          draggable={false}
          aria-label="Aquila on Instagram"
          className="absolute left-1/2 top-1/2 block overflow-hidden bg-cocoa shadow-[0_24px_40px_-24px_rgba(0,0,0,0.4)]"
          style={{ width: "var(--w)", height: "var(--h)" }}
        >
          <Image src={f.src} alt="" fill sizes="320px" draggable={false} className="pointer-events-none object-cover" style={{ objectPosition: f.pos }} />
        </a>
      ))}
    </div>
  );
}

export function InstagramStrip() {
  return (
    <section className="overflow-hidden bg-paper py-20 text-center md:py-32" aria-labelledby="ig-title">
      <div className="mx-auto flex max-w-[1480px] flex-col items-center px-6 md:px-12">
        <p className="eyebrow text-ink/45">Follow the journey</p>
        <SplitHeading as="h2" className="mt-4 font-serif text-[clamp(34px,5vw,64px)] uppercase leading-none tracking-[0.02em] text-ink">
          <span id="ig-title">{CONTACT.instagramHandle}</span>
        </SplitHeading>
        <a
          href={CONTACT.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Follow"
          className="eyebrow link-underline mt-6 flex items-center gap-2.5 pb-1 text-ink"
        >
          <InstagramIcon size={16} strokeWidth={1.2} /> Follow on Instagram
        </a>
      </div>
      <Reveal>
        <Carousel />
      </Reveal>
    </section>
  );
}

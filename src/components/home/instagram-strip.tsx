"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { CONTACT } from "@/lib/products";
import { InstagramIcon } from "../icons";
import { Reveal, SplitHeading } from "../motion";

const FEED = [
  { src: "/photos/DSC00403.jpg", pos: "50% 30%" },
  { src: "/deck/story-1c.jpg", pos: "62% 50%" },
  { src: "/photos/DSC00436.jpg", pos: "62% 30%" },
  { src: "/deck/story-2c.jpg", pos: "78% 50%" },
  { src: "/photos/DSC00712.jpg", pos: "66% 35%" },
  { src: "/photos/DSC00361.jpg", pos: "28% 40%" },
  { src: "/photos/DSC00450.jpg", pos: "50% 35%" },
  { src: "/photos/DSC00592.jpg", pos: "50% 35%" },
];

const STEP = 360 / FEED.length;
const IDLE = 9; // degrees per second when left alone

/** A slow 3D ring of photos: spins by itself, can be dragged, cards at the back fall away. */
function Carousel() {
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stageEl = stage.current!;
    const ringEl = ring.current!;
    const cards = Array.from(ringEl.children) as HTMLElement[];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rot = 0;
    let vel = 0;
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let visible = true;
    let raf = 0;
    let last = performance.now();

    const layout = () => {
      const w = stageEl.clientWidth < 640 ? 150 : stageEl.clientWidth < 1100 ? 220 : 290;
      const h = Math.round(w * 1.25);
      const radius = w / 2 / Math.tan(Math.PI / FEED.length) + (stageEl.clientWidth < 640 ? 26 : 90);
      stageEl.style.height = `${h + 70}px`;
      ringEl.style.width = `${w}px`;
      ringEl.style.height = `${h}px`;
      cards.forEach((c, i) => {
        c.style.transform = `rotateY(${i * STEP}deg) translateZ(${radius}px)`;
      });
      ringEl.style.setProperty("--r", `${radius}px`);
    };

    const paint = () => {
      const radius = parseFloat(ringEl.style.getPropertyValue("--r")) || 0;
      ringEl.style.transform = `translateZ(${-radius}px) rotateY(${rot}deg)`;
      cards.forEach((c, i) => {
        const a = ((i * STEP + rot) * Math.PI) / 180;
        const front = (Math.cos(a) + 1) / 2; // 1 = facing us, 0 = behind
        c.style.opacity = String(0.25 + 0.75 * front);
        c.style.filter = `brightness(${0.55 + 0.45 * front})`;
      });
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (visible) {
        if (!dragging) {
          vel *= Math.pow(0.04, dt); // coast down after a flick
          rot += (reduced ? 0 : IDLE + vel) * dt + (reduced ? vel * dt : 0);
        }
        paint();
      }
      raf = requestAnimationFrame(tick);
    };

    const down = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      vel = 0;
      stageEl.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      rot += dx * 0.35;
      vel = dx * 0.35 * 60 * 0.5;
    };
    const up = () => {
      dragging = false;
    };
    const click = (e: MouseEvent) => {
      if (moved > 6) e.preventDefault();
    };

    layout();
    paint();
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { rootMargin: "200px" });
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
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
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
      data-lenis-prevent-touch
      className="relative mx-auto mt-8 w-full cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing md:mt-12"
      style={{ perspective: "1500px", perspectiveOrigin: "50% 45%" }}
      aria-label="Aquila on Instagram"
    >
      <div ref={ring} className="absolute left-1/2 top-8 [transform-style:preserve-3d]" style={{ translate: "-50% 0" }}>
        {FEED.map((f) => (
          <a
            key={f.src}
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="View"
            draggable={false}
            aria-label="Aquila on Instagram"
            className="absolute inset-0 block overflow-hidden bg-cocoa"
          >
            <Image src={f.src} alt="" fill sizes="290px" draggable={false} className="pointer-events-none object-cover" style={{ objectPosition: f.pos }} />
          </a>
        ))}
      </div>
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

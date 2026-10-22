"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { whenReady } from "@/lib/ready";

/*
 * A real bald eagle (public-domain photograph, background removed) that flies across the screen
 * as the page is scrolled.
 *
 * - It travels left to right along a gently weaving path with scroll progress; scroll back up and
 *   it turns around and flies the other way.
 * - The wing is a separate layer that swings from the shoulder: scroll fast and it beats its wing
 *   hard, stop and it soars on a lightly raised wing. The body bobs with each stroke.
 * - It pitches with the path, drifts in a lazy loop when you stop, and swoops in from the top-left
 *   corner once after the intro.
 *
 * Photo: US Fish & Wildlife Service, public domain.
 */

// The two layers share one canvas; the shoulder (wing pivot) sits at these fractions of it.
const CANVAS_W = 1520;
const CANVAS_H = 1020;
const PIVOT_X = 0.671;
const PIVOT_Y = 0.78;
const WING_UP = 6; // degrees: wing raised
const WING_DOWN = -62; // degrees: wing swept down

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

export function Eagle() {
  const pathname = usePathname();
  const box = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLImageElement>(null);
  const wing = useRef<HTMLImageElement>(null);
  const hidden = pathname === "/checkout";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = box.current!;
    const bodyEl = body.current!;
    const wingEl = wing.current!;

    const widthFor = () => clamp(window.innerWidth * 0.34, 270, 540);
    let CW = widthFor();
    let W = window.innerWidth;
    let H = window.innerHeight;
    const size = () => {
      el.style.width = `${CW}px`;
      el.style.height = `${(CW * CANVAS_H) / CANVAS_W}px`;
    };
    size();

    const s = {
      target: 0, // scroll progress 0..1
      p: 0, // eased progress
      t: 0, // time
      intro: 0, // 0 = off in the corner, 1 = arrived
      x: -400,
      y: -300,
      mx: -400,
      my: -300,
      flip: 1, // 1 faces right, -1 faces left (eased through 0 = a turn)
      flipTarget: 1,
      pitch: 0,
      phase: 0,
      scrollVel: 0,
      lastY: window.scrollY,
      energy: 0.15,
      freq: 1,
    };

    const path = (p: number): [number, number] => {
      const x = W * (0.24 + 0.6 * p);
      const y = H * (0.5 + 0.07 * Math.sin(p * Math.PI * 2 * 1.6) + 0.03 * Math.sin(p * Math.PI * 2 * 3.7));
      return [x, y];
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      s.target = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    };
    const onResize = () => {
      CW = widthFor();
      W = window.innerWidth;
      H = window.innerHeight;
      size();
      onScroll();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const tick = (_: number, dtms: number) => {
      const dt = Math.min(dtms / 1000, 0.05);
      if (!dt) return;
      s.t += dt;

      // scroll speed (px/s), smoothed
      const dy = window.scrollY - s.lastY;
      s.lastY = window.scrollY;
      s.scrollVel += (Math.abs(dy) / dt - s.scrollVel) * (1 - Math.exp(-dt * 6));

      // eased progress along the path
      s.p += (s.target - s.p) * (1 - Math.exp(-dt * 2.4));
      const [bx, by] = path(s.p);

      // lazy soaring loop + the entrance swoop
      const ox = Math.cos(s.t * 0.7) * 16;
      const oy = Math.sin(s.t * 0.95) * 11;
      const e = 1 - Math.pow(1 - s.intro, 3);
      const ix = (1 - e) * (-W * 0.55 - bx);
      const iy = (1 - e) * (-H * 0.35);
      const x = bx + ox + ix;
      const y = by + oy + iy;

      // face the way it is travelling (path + swoop, not the idle drift) and pitch with the slope
      const mx = bx + ix;
      const my = by + iy;
      const vx = (mx - s.mx) / dt;
      const vy = (my - s.my) / dt;
      s.mx = mx;
      s.my = my;
      if (Math.abs(vx) > 50) s.flipTarget = vx > 0 ? 1 : -1;
      const slope = Math.abs(vx) > 30 ? (Math.atan2(vy, Math.abs(vx)) * 180) / Math.PI : 0;
      s.pitch += (clamp(slope * 0.45, -22, 22) - s.pitch) * (1 - Math.exp(-dt * 4));
      s.flip += (s.flipTarget - s.flip) * (1 - Math.exp(-dt * 5));

      // wing beat: hard when scrolling (and during the swoop), a lazy lift when soaring
      const energy = clamp(s.scrollVel / 1500, 0, 1) + (1 - e) * 0.9;
      s.energy += (clamp(energy, 0, 1) - s.energy) * (1 - Math.exp(-dt * 4));
      const freqT = 0.9 + 2.2 * clamp(energy, 0, 1);
      s.freq += (freqT - s.freq) * (1 - Math.exp(-dt * 4));
      s.phase += Math.PI * 2 * s.freq * dt;
      const amp = 0.22 + 0.78 * s.energy;
      const down = 0.5 - 0.5 * Math.sin(s.phase); // 0 = raised, 1 = swept down
      const angle = WING_UP + (WING_DOWN - WING_UP) * amp * down;
      wingEl.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      bodyEl.style.transform = `translateY(${((1.4 - 3.4 * down) * amp).toFixed(2)}%)`;

      const ch = (CW * CANVAS_H) / CANVAS_W;
      const px = x - PIVOT_X * CW;
      const py = y - PIVOT_Y * ch;
      const sign = s.flipTarget;
      el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) rotate(${(s.pitch * sign).toFixed(2)}deg) scaleX(${s.flip.toFixed(3)})`;
    };
    gsap.ticker.add(tick);

    const off = whenReady(() => {
      gsap.to(el, { opacity: 1, duration: 0.6, delay: 0.3 });
      gsap.to(s, { intro: 1, duration: 3.6, delay: 0.3, ease: "power1.inOut" });
    });

    return () => {
      off();
      gsap.ticker.remove(tick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={box}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[45] opacity-0 will-change-transform [filter:drop-shadow(0_16px_14px_rgba(20,14,8,0.32))]"
      style={{ width: 400, height: 268, display: hidden ? "none" : "block", transformOrigin: `${PIVOT_X * 100}% ${PIVOT_Y * 100}%` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={body} src="/eagle/body.webp" alt="" width={CANVAS_W} height={CANVAS_H} decoding="async" draggable={false} className="absolute inset-0 h-full w-full select-none will-change-transform" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={wing}
        src="/eagle/wing.webp"
        alt=""
        width={CANVAS_W}
        height={CANVAS_H}
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none will-change-transform"
        style={{ transformOrigin: `${PIVOT_X * 100}% ${PIVOT_Y * 100}%` }}
      />
    </div>
  );
}

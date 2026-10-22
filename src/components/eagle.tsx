"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { whenReady } from "@/lib/ready";

/*
 * A real bald eagle (public-domain photograph, background removed).
 *
 * - Laptops / mice: the eagle IS the mouse pointer. Its beak is the hotspot, it faces the way the
 *   pointer moves, flaps harder the faster you move, rises to meet links, and beats its wings
 *   when you click. The system cursor is hidden while it is active.
 * - Phones / touch: the eagle flies across the screen as the page scrolls, banks with its path and
 *   turns around when you scroll back up.
 *
 * The wing is a separate layer that swings from the shoulder (body and wing share one canvas).
 * Photo: US Fish & Wildlife Service, public domain.
 */

const CANVAS_W = 1520;
const CANVAS_H = 1020;
const PIVOT_X = 0.671; // shoulder (wing hinge)
const PIVOT_Y = 0.78;
const BEAK_X = 0.817; // cursor hotspot
const BEAK_Y = 0.841;
const WING_UP = 6; // degrees: wing raised
const WING_DOWN = -62; // degrees: wing swept down

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

export function Eagle() {
  const pathname = usePathname();
  const box = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLImageElement>(null);
  const wing = useRef<HTMLImageElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const mode = useRef<"cursor" | "scroll">("scroll");

  // the scroll eagle stays off the checkout form
  useEffect(() => {
    if (mode.current === "scroll" && box.current) box.current.style.display = pathname === "/checkout" ? "none" : "block";
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = box.current!;
    const bodyEl = body.current!;
    const wingEl = wing.current!;
    const labelEl = label.current!;
    // `?eagle=scroll` forces the phone behaviour (handy for checking it on a laptop)
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches && new URLSearchParams(window.location.search).get("eagle") !== "scroll";
    mode.current = fine ? "cursor" : "scroll";

    const s = {
      x: -400, y: -300, // drawn position of the anchor point (beak / shoulder)
      tx: -400, ty: -300, // where the cursor really is
      mx: -400, my: -300,
      t: 0,
      flip: 1,
      flipTarget: 1,
      pitch: 0,
      phase: 0,
      energy: 0.15,
      freq: 1,
      boost: 0, // click flurry
      grow: 1,
      growTarget: 1,
      speed: 0,
      // scroll mode
      target: 0,
      p: 0,
      intro: 0,
      scrollVel: 0,
      lastY: window.scrollY,
    };

    const dims = () => {
      const w = fine ? 150 : clamp(window.innerWidth * 0.45, 170, 240);
      return { CW: w, CH: (w * CANVAS_H) / CANVAS_W };
    };
    let { CW, CH } = dims();
    let W = window.innerWidth;
    let H = window.innerHeight;
    const size = () => {
      el.style.width = `${CW}px`;
      el.style.height = `${CH}px`;
    };
    size();
    el.style.transformOrigin = fine ? `${BEAK_X * 100}% ${BEAK_Y * 100}%` : `${PIVOT_X * 100}% ${PIVOT_Y * 100}%`;
    el.style.display = !fine && window.location.pathname === "/checkout" ? "none" : "block";

    /** wing beat + body bob. `drive` 0..1 is how hard it is beating. */
    const flap = (dt: number, drive: number) => {
      s.energy += (clamp(drive, 0, 1) - s.energy) * (1 - Math.exp(-dt * 5));
      const freqT = 0.9 + 2.4 * s.energy;
      s.freq += (freqT - s.freq) * (1 - Math.exp(-dt * 5));
      s.phase += Math.PI * 2 * s.freq * dt;
      const amp = 0.22 + 0.78 * s.energy;
      const down = 0.5 - 0.5 * Math.sin(s.phase);
      wingEl.style.transform = `rotate(${(WING_UP + (WING_DOWN - WING_UP) * amp * down).toFixed(2)}deg)`;
      bodyEl.style.transform = `translateY(${((1.4 - 3.4 * down) * amp).toFixed(2)}%)`;
    };

    let stop: () => void;

    if (fine) {
      /* ---------------- laptop: the eagle is the cursor ---------------- */
      const root = document.documentElement;
      let shown = false;
      let overField = false;

      const show = () => {
        if (shown) return;
        shown = true;
        root.classList.add("aq-eagle-cursor");
        gsap.to(el, { opacity: 1, duration: 0.3 });
      };
      const move = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        s.tx = e.clientX;
        s.ty = e.clientY;
        if (!shown) {
          s.x = e.clientX;
          s.y = e.clientY;
          s.mx = e.clientX;
          s.my = e.clientY;
          show();
        }
      };
      const over = (e: PointerEvent) => {
        const t = e.target as HTMLElement | null;
        overField = !!t?.closest("input,textarea,select,[contenteditable=true]");
        gsap.to(el, { opacity: overField ? 0 : 1, duration: 0.2 });
        const tagged = t?.closest<HTMLElement>("[data-cursor]");
        if (tagged?.dataset.cursor) {
          labelEl.textContent = tagged.dataset.cursor;
          gsap.to(labelEl, { autoAlpha: 1, scale: 1, duration: 0.25 });
        } else gsap.to(labelEl, { autoAlpha: 0, scale: 0.9, duration: 0.2 });
        s.growTarget = t?.closest("a,button,[role=button],label") ? 1.18 : 1;
      };
      const down = () => {
        s.boost = 1;
        s.growTarget = 0.9;
      };
      const up = () => (s.growTarget = 1.1);
      const leave = () => {
        shown = false;
        root.classList.remove("aq-eagle-cursor");
        gsap.to(el, { opacity: 0, duration: 0.25 });
      };
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerover", over, { passive: true });
      window.addEventListener("pointerdown", down);
      window.addEventListener("pointerup", up);
      document.documentElement.addEventListener("pointerleave", leave);

      const tick = (_: number, dtms: number) => {
        const dt = Math.min(dtms / 1000, 0.05);
        if (!dt) return;
        s.t += dt;
        // follow the pointer closely (it is a cursor: the beak must stay on the target)
        const k = 1 - Math.exp(-dt * 22);
        s.x += (s.tx - s.x) * k;
        s.y += (s.ty - s.y) * k;
        const vx = (s.x - s.mx) / dt;
        const vy = (s.y - s.my) / dt;
        s.mx = s.x;
        s.my = s.y;
        const speed = Math.hypot(vx, vy);
        s.speed += (speed - s.speed) * (1 - Math.exp(-dt * 8));
        if (Math.abs(vx) > 60) s.flipTarget = vx > 0 ? 1 : -1;
        s.flip += (s.flipTarget - s.flip) * (1 - Math.exp(-dt * 14));
        const slope = Math.abs(vx) > 40 ? (Math.atan2(vy, Math.abs(vx)) * 180) / Math.PI : 0;
        s.pitch += (clamp(slope * 0.6, -26, 26) - s.pitch) * (1 - Math.exp(-dt * 8));
        s.boost = Math.max(0, s.boost - dt * 2.4);
        s.grow += (s.growTarget - s.grow) * (1 - Math.exp(-dt * 12));
        flap(dt, clamp(s.speed / 1100, 0, 1) + s.boost);
        const bob = Math.sin(s.t * 2.1) * 1.6; // hovers gently when still
        el.style.transform = `translate3d(${(s.x - BEAK_X * CW).toFixed(1)}px, ${(s.y - BEAK_Y * CH + bob).toFixed(1)}px, 0) rotate(${(s.pitch * s.flipTarget).toFixed(2)}deg) scaleX(${s.flip.toFixed(3)}) scale(${s.grow.toFixed(3)})`;
        labelEl.style.transform = `translate(${(s.x + 26).toFixed(1)}px, ${(s.y + 24).toFixed(1)}px)`;
      };
      gsap.ticker.add(tick);
      stop = () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerover", over);
        window.removeEventListener("pointerdown", down);
        window.removeEventListener("pointerup", up);
        document.documentElement.removeEventListener("pointerleave", leave);
        root.classList.remove("aq-eagle-cursor");
      };
    } else {
      /* ---------------- phone: the eagle flies with the scroll ---------------- */
      const path = (p: number): [number, number] => [W * (0.26 + 0.5 * p), H * (0.5 + 0.07 * Math.sin(p * Math.PI * 2 * 1.6) + 0.03 * Math.sin(p * Math.PI * 2 * 3.7))];
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        s.target = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      };
      const onResize = () => {
        ({ CW, CH } = dims());
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
        const dy = window.scrollY - s.lastY;
        s.lastY = window.scrollY;
        s.scrollVel += (Math.abs(dy) / dt - s.scrollVel) * (1 - Math.exp(-dt * 6));
        s.p += (s.target - s.p) * (1 - Math.exp(-dt * 2.4));
        const [bx, by] = path(s.p);
        const ox = Math.cos(s.t * 0.7) * 12;
        const oy = Math.sin(s.t * 0.95) * 9;
        const e = 1 - Math.pow(1 - s.intro, 3);
        const ix = (1 - e) * (-W * 0.55 - bx);
        const iy = (1 - e) * (-H * 0.35);
        const x = bx + ox + ix;
        const y = by + oy + iy;
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
        flap(dt, clamp(s.scrollVel / 1500, 0, 1) + (1 - e) * 0.9);
        el.style.transform = `translate3d(${(x - PIVOT_X * CW).toFixed(1)}px, ${(y - PIVOT_Y * CH).toFixed(1)}px, 0) rotate(${(s.pitch * s.flipTarget).toFixed(2)}deg) scaleX(${s.flip.toFixed(3)})`;
      };
      gsap.ticker.add(tick);
      const off = whenReady(() => {
        gsap.to(el, { opacity: 1, duration: 0.6, delay: 0.3 });
        gsap.to(s, { intro: 1, duration: 3.6, delay: 0.3, ease: "power1.inOut" });
      });
      stop = () => {
        off();
        gsap.ticker.remove(tick);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      };
    }

    return () => stop();
  }, []);

  return (
    <>
      <div
        ref={box}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[130] opacity-0 will-change-transform [filter:drop-shadow(0_10px_9px_rgba(20,14,8,0.3))]"
        style={{ width: 150, height: 101 }}
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
      <span
        ref={label}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[131] rounded-full bg-ivory/95 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-espresso opacity-0 shadow-[0_0_0_1px_rgba(36,30,26,0.18)]"
      />
    </>
  );
}

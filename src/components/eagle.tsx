"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { whenReady } from "@/lib/ready";

/*
 * A soaring eagle that flies across the screen as the page is scrolled.
 *
 * - Position follows scroll progress along a gently weaving path, left to right; scroll back up
 *   and it turns around and flies the other way (it always faces the way it is moving).
 * - The wings really flap: their outline is rebuilt every frame from one resting pose. Scroll
 *   fast and it beats its wings hard; stop and it soars on barely-moving wings.
 * - It banks into turns, and drifts in a lazy circle when you stop scrolling.
 * - On first load it swoops in from the top-left corner once the intro has finished.
 */

type Cmd = [string, ...number[]];

const CX = 150; // body axis in the 300 x 200 drawing

// Left wing, fully spread (top view, head of the bird pointing up). The right wing is a mirror.
const WING: Cmd[] = [
  ["M", 140, 66],
  ["C", 112, 58, 78, 54, 44, 58],
  ["C", 24, 60, 10, 68, 3, 80],
  ["L", 15, 83],
  ["L", 6, 93],
  ["L", 19, 94],
  ["L", 14, 105],
  ["L", 28, 103],
  ["L", 24, 115],
  ["L", 38, 110],
  ["L", 36, 124],
  ["L", 50, 115],
  ["C", 76, 113, 108, 110, 138, 102],
  ["Z"],
];
// Lighter patch of covert feathers along the front of the wing.
const COVERTS: Cmd[] = [
  ["M", 140, 66],
  ["C", 112, 58, 78, 54, 44, 58],
  ["L", 50, 80],
  ["C", 82, 80, 112, 84, 138, 86],
  ["Z"],
];
// Feather shafts drawn inside the wing: [x1, y1, x2, y2]
const SHAFTS: number[][] = [
  [15, 83, 60, 70],
  [19, 94, 64, 81],
  [28, 103, 72, 92],
  [38, 110, 80, 101],
  [64, 113, 68, 82],
  [86, 112, 92, 84],
  [108, 109, 114, 84],
  [126, 105, 130, 86],
];

/** Wing pose t: 0 = spread, +1 = raised, -1 = lowered. Tips pull in and sweep forward / back. */
function pose(x: number, y: number, t: number): [number, number] {
  const r = Math.min(Math.max((CX - x) / 146, 0), 1);
  const squeeze = 1 - 0.3 * t * t;
  return [CX - (CX - x) * squeeze, y - t * 34 * Math.pow(r, 1.3) + (t < 0 ? -t * 7 * r * r : 0)];
}

function outline(cmds: Cmd[], t: number) {
  let d = "";
  for (const [c, ...n] of cmds) {
    d += c;
    for (let i = 0; i < n.length; i += 2) {
      const [x, y] = pose(n[i], n[i + 1], t);
      d += `${x.toFixed(1)},${y.toFixed(1)} `;
    }
  }
  return d;
}

function shaftPath(t: number) {
  return SHAFTS.map(([a, b, c, e]) => {
    const [x1, y1] = pose(a, b, t);
    const [x2, y2] = pose(c, e, t);
    return `M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`;
  }).join(" ");
}

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const shortest = (from: number, to: number) => ((((to - from) % 360) + 540) % 360) - 180;

export function Eagle() {
  const pathname = usePathname();
  const box = useRef<HTMLDivElement>(null);
  const wing = useRef<SVGPathElement>(null);
  const coverts = useRef<SVGPathElement>(null);
  const shafts = useRef<SVGPathElement>(null);
  const body = useRef<SVGGElement>(null);
  const hidden = pathname === "/checkout";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = box.current!;
    const wingEl = wing.current!;
    const covertEl = coverts.current!;
    const shaftEl = shafts.current!;
    const bodyEl = body.current!;

    const size = () => clamp(window.innerWidth * 0.24, 150, 290);
    let S = size();
    let W = window.innerWidth;
    let H = window.innerHeight;
    el.style.width = `${S}px`;
    el.style.height = `${(S * 2) / 3}px`;

    const s = {
      target: 0, // scroll progress 0..1
      p: 0, // eased progress
      t: 0, // time
      intro: 0, // 0 = off in the corner, 1 = arrived
      x: -400,
      y: -300,
      mx: -400,
      my: -300,
      angle: 90,
      phase: 0,
      scrollVel: 0,
      lastY: window.scrollY,
      bank: 0,
      amp: 0.25,
      freq: 1.2,
      shown: false,
    };

    const path = (p: number): [number, number] => {
      const x = W * (0.08 + 0.86 * p);
      const y = H * (0.3 + 0.1 * Math.sin(p * Math.PI * 2 * 1.6) + 0.035 * Math.sin(p * Math.PI * 2 * 3.7));
      return [x, y];
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      s.target = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    };
    const onResize = () => {
      S = size();
      W = window.innerWidth;
      H = window.innerHeight;
      el.style.width = `${S}px`;
      el.style.height = `${(S * 2) / 3}px`;
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

      // lazy soaring circle + the entrance swoop
      const ox = Math.cos(s.t * 0.7) * 16;
      const oy = Math.sin(s.t * 0.95) * 11;
      const e = 1 - Math.pow(1 - s.intro, 3);
      const ix = (1 - e) * (-W * 0.55 - bx);
      const iy = (1 - e) * (-H * 0.35);
      const x = bx + ox + ix;
      const y = by + oy + iy;

      // face the way it is travelling (path + entrance swoop, not the idle drift), so it turns
      // around when you scroll back up and otherwise holds its heading
      const mx = bx + ix;
      const my = by + iy;
      const vx = (mx - s.mx) / dt;
      const vy = (my - s.my) / dt;
      s.mx = mx;
      s.my = my;
      s.x = x;
      s.y = y;
      const speed = Math.hypot(vx, vy);
      if (speed > 40) {
        const want = (Math.atan2(vy, vx) * 180) / Math.PI + 90;
        const diff = shortest(s.angle, want);
        s.angle += diff * (1 - Math.exp(-dt * 4.5));
        s.bank += (clamp(diff * 0.6, -26, 26) - s.bank) * (1 - Math.exp(-dt * 4));
      } else {
        s.bank += (Math.sin(s.t * 0.8) * 6 - s.bank) * (1 - Math.exp(-dt * 2));
      }

      // wing beat: hard when scrolling, a slow shimmer when soaring
      const energy = clamp(s.scrollVel / 1500, 0, 1) + (1 - e) * 0.9;
      const ampT = 0.16 + 0.84 * clamp(energy, 0, 1);
      const freqT = 1.1 + 3.1 * clamp(energy, 0, 1);
      s.amp += (ampT - s.amp) * (1 - Math.exp(-dt * 4));
      s.freq += (freqT - s.freq) * (1 - Math.exp(-dt * 4));
      s.phase += Math.PI * 2 * s.freq * dt;
      const t = Math.sin(s.phase) * s.amp;
      wingEl.setAttribute("d", outline(WING, t));
      covertEl.setAttribute("d", outline(COVERTS, t));
      shaftEl.setAttribute("d", shaftPath(t));
      bodyEl.setAttribute("transform", `translate(0 ${(-t * 1.6).toFixed(2)})`);

      el.style.transform = `translate3d(${(x - S / 2).toFixed(1)}px, ${(y - S / 3).toFixed(1)}px, 0) rotate(${s.angle.toFixed(1)}deg)`;
      (el.firstElementChild as SVGElement).style.transform = `rotateY(${s.bank.toFixed(1)}deg)`;
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
      className="pointer-events-none fixed left-0 top-0 z-[45] opacity-0 will-change-transform [perspective:800px] [filter:drop-shadow(0_14px_14px_rgba(28,18,10,0.35))]"
      style={{ width: 200, height: 133, display: hidden ? "none" : "block" }}
    >
      <svg viewBox="0 0 300 200" className="h-full w-full overflow-visible [transform-style:preserve-3d]">
        <defs>
          <linearGradient id="aqe-wing-fill" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#2b2420" />
            <stop offset="0.5" stopColor="#3f342d" />
            <stop offset="1" stopColor="#5a4a3e" />
          </linearGradient>
          <g id="aqe-wing">
            <path ref={wing} d="M0 0" fill="url(#aqe-wing-fill)" stroke="#faf0d7" strokeWidth="1" strokeLinejoin="round" strokeOpacity="0.85" />
            <path ref={coverts} d="M0 0" fill="#8a7050" fillOpacity="0.38" />
            <path ref={shafts} d="M0 0" fill="none" stroke="#faf0d7" strokeWidth="0.7" strokeOpacity="0.32" strokeLinecap="round" />
          </g>
        </defs>

        <use href="#aqe-wing" />
        <use href="#aqe-wing" transform="matrix(-1 0 0 1 300 0)" />

        <g ref={body}>
          {/* tail: dark fan with pale feather tips */}
          <path d="M141 118 L132 172 L138 177 L143 171 L150 181 L157 171 L162 177 L168 172 L159 118 Z" fill="#453d38" stroke="#faf0d7" strokeWidth="0.7" strokeOpacity="0.55" strokeLinejoin="round" />
          <path d="M132 172 L138 177 L143 171 L150 181 L157 171 L162 177 L168 172" fill="none" stroke="#e9dcbc" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M145 124 L142 166 M150 124 L150 170 M155 124 L158 166" stroke="#faf0d7" strokeWidth="0.6" strokeOpacity="0.28" fill="none" />
          {/* body */}
          <path d="M143.5 54 C141.5 66 140.5 80 141.5 92 C142.5 106 146 114 150 124 C154 114 157.5 106 158.5 92 C159.5 80 158.5 66 156.5 54 Z" fill="#3b332e" stroke="#faf0d7" strokeWidth="0.7" strokeOpacity="0.55" />
          <path d="M150 58 L150 112" stroke="#faf0d7" strokeOpacity="0.16" strokeWidth="0.7" />
          {/* golden nape, head, hooked beak */}
          <path d="M144.5 55 C144 49 146 45 150 45 C154 45 156 49 155.5 55 C153 58 147 58 144.5 55 Z" fill="#b99552" />
          <path d="M145 48 C145 39 147 33 150 32 C153 33 155 39 155 48 C153 51 147 51 145 48 Z" fill="#2d2622" />
          <path d="M147.4 35 C147.6 29 149 24.5 150.4 23.5 C151.6 24 151.2 26.8 150.2 28 C153 27.5 152.8 31.5 152.6 35 Z" fill="#d6b25a" stroke="#241e1a" strokeWidth="0.4" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

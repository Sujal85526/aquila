"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { markReady } from "@/lib/ready";

const SEEN = "aquila-v2-intro";

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const polar = (px: number, py: number, deg: number, len: number): [number, number] => [px + Math.cos((deg * Math.PI) / 180) * len, py - Math.sin((deg * Math.PI) / 180) * len];
const leaf = (bx: number, by: number, tx: number, ty: number, w: number) => {
  const dx = tx - bx;
  const dy = ty - by;
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const mx = bx + dx * 0.5;
  const my = by + dy * 0.5;
  const f = (n: number) => n.toFixed(1);
  return `M${f(bx)},${f(by)} Q${f(mx + nx * w)},${f(my + ny * w)} ${f(tx)},${f(ty)} Q${f(mx - nx * w)},${f(my - ny * w)} ${f(bx)},${f(by)}Z`;
};

interface Feather {
  d: string;
  fill: string;
  /** degrees to rotate it to its folded position (left wing: clockwise-negative, right: the mirror) */
  fold: number;
}
interface Wing {
  pivot: [number, number];
  feathers: Feather[];
}

const TIERS = [
  { piv: [138, 112], n: 9, a0: 196, step: 9.5, lens: [110, 116, 120, 121, 119, 114, 107, 99, 90], w: 15, fill: "#ece0c0" },
  { piv: [142, 114], n: 8, a0: 192, step: 10, lens: [66, 70, 72, 72, 70, 66, 60, 54], w: 12, fill: "#f5ead0" },
  { piv: [145, 116], n: 7, a0: 186, step: 11, lens: [36, 38, 40, 40, 38, 34, 30], w: 9, fill: "#fbf3de" },
] as const;

function buildWing(side: "left" | "right"): Wing {
  const feathers: Feather[] = [];
  for (const t of TIERS) {
    for (let i = 0; i < t.n; i++) {
      const a = t.a0 - i * t.step;
      const px = side === "left" ? t.piv[0] : 300 - t.piv[0];
      const ang = side === "left" ? a : 180 - a;
      const [tx, ty] = polar(px, t.piv[1], ang, t.lens[i]);
      feathers.push({ d: leaf(px, t.piv[1], tx, ty, t.w), fill: t.fill, fold: side === "left" ? -(250 - a) : 250 - a });
    }
  }
  return { pivot: [side === "left" ? 138 : 162, 112], feathers };
}
const WING_L = buildWing("left");
const WING_R = buildWing("right");
const TAIL = [-20, -10, 0, 10, 20].map((d) => {
  const [tx, ty] = polar(150, 126, 270 + d, 64);
  return leaf(150, 126, tx, ty, 10);
});

const pageLoaded = () =>
  new Promise<void>((resolve) => {
    const done = () => resolve();
    if (document.readyState === "complete") return done();
    window.addEventListener("load", done, { once: true });
    setTimeout(done, 5000); // never trap the visitor behind the loader
  });

/**
 * Intro. An eagle monogram — ivory feathers on espresso — draws itself on: a halo ring, then the
 * wings unfurl feather by feather, a shimmer runs along them, and they settle into a slow beat.
 * The AQUILA wordmark rises beneath. When the page is ready the eagle lifts away and the curtain
 * rises with it.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const finish = () => {
      document.body.style.overflow = "";
      el.style.display = "none";
    };
    document.body.style.overflow = "hidden";
    if (prefersReducedMotion()) {
      gsap.to(el, { opacity: 0, duration: 0.4, onStart: markReady, onComplete: finish });
      return;
    }
    let quick = false;
    try {
      quick = !!sessionStorage.getItem(SEEN);
      sessionStorage.setItem(SEEN, "1");
    } catch {}

    const q = gsap.utils.selector(el);
    const wingL = q("[data-wing-l]")[0];
    const wingR = q("[data-wing-r]")[0];
    const feathersL = q("[data-wing-l] [data-f]");
    const feathersR = q("[data-wing-r] [data-f]");
    const allFeathers = feathersL.flatMap((f, i) => (feathersR[i] ? [f, feathersR[i]] : [f]));
    const body = q("[data-body]");
    const mark = q("[data-mark]");
    const tag = q("[data-tag]");

    // start: feathers folded, everything else hidden
    allFeathers.forEach((f) => {
      const d = (f as HTMLElement).dataset;
      gsap.set(f, { rotation: Number(d.fold), svgOrigin: d.piv });
    });
    gsap.set(q("[data-halo]"), { drawSVG: "0%" });
    gsap.set(body, { autoAlpha: 0, scale: 0.6, transformOrigin: "150px 110px" });
    gsap.set(mark, { y: 0, yPercent: 115 });
    gsap.set(tag, { autoAlpha: 0 });

    const sp = quick ? 0.55 : 1;
    const intro = gsap.timeline();
    intro
      .to(q("[data-halo]"), { drawSVG: "100%", duration: 1.4 * sp, ease: "power2.inOut" }, 0)
      .to(body, { autoAlpha: 1, scale: 1, duration: 0.9 * sp, ease: "back.out(1.5)" }, 0.25 * sp)
      .to(allFeathers, { rotation: 0, duration: 1.25 * sp, ease: "expo.out", stagger: { each: 0.02 * sp, from: "start" } }, 0.45 * sp)
      .to(mark, { yPercent: 0, duration: 1.2 * sp, ease: "expo.out" }, 0.9 * sp)
      .to(tag, { autoAlpha: 1, duration: 0.2 }, 1.4 * sp)
      .to(tag, { duration: 1.2 * sp, scrambleText: { text: "For those who see further", chars: "upperCase", speed: 0.6, revealDelay: 0.2 } }, 1.4 * sp)
      // a shimmer runs out along the feathers
      .to(allFeathers, { fill: "#ffffff", duration: 0.25, yoyo: true, repeat: 1, ease: "sine.inOut", stagger: { each: 0.01, from: "start" } }, 1.7 * sp);

    // settle into a slow wing beat and a gentle hover
    const beat = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut", duration: 0.95 }, delay: 1.6 * sp });
    beat
      .fromTo(wingL, { rotation: 5, svgOrigin: "138 112" }, { rotation: -9, svgOrigin: "138 112" }, 0)
      .fromTo(wingR, { rotation: -5, svgOrigin: "162 112" }, { rotation: 9, svgOrigin: "162 112" }, 0)
      .fromTo(body, { y: -2 }, { y: 2.5 }, 0);

    const t0 = performance.now();
    const minHold = quick ? 1400 : 3800;
    pageLoaded().then(() => {
      gsap.delayedCall(Math.max(0, minHold - (performance.now() - t0)) / 1000, () => {
        beat.timeScale(3.2);
        gsap
          .timeline({ onComplete: () => finish() })
          .to(tag, { autoAlpha: 0, duration: 0.3 }, 0)
          .to(mark, { yPercent: -115, duration: 0.55, ease: "power3.in" }, 0.05)
          .to(q("[data-halo]"), { autoAlpha: 0, scale: 1.2, svgOrigin: "150 110", duration: 0.5 }, 0.1)
          .to(q("[data-emblem]"), { y: -90, scale: 1.12, autoAlpha: 0, duration: 0.95, ease: "power2.in" }, 0.2)
          .call(markReady, undefined, 0.85)
          .to(el, { yPercent: -100, duration: 1.15, ease: "expo.inOut" }, 0.7);
      });
    });

    return () => {
      beat.kill();
      intro.kill();
    };
  }, []);

  const wing = (w: Wing, side: "l" | "r") => (
    <g data-wing-l={side === "l" ? "" : undefined} data-wing-r={side === "r" ? "" : undefined}>
      {w.feathers.map((f, i) => (
        <path key={i} data-f data-fold={f.fold} data-piv={`${w.pivot[0]} ${w.pivot[1]}`} d={f.d} fill={f.fill} stroke="#453d38" strokeWidth="1.1" strokeLinejoin="round" />
      ))}
    </g>
  );

  return (
    <div ref={root} className="aq-loader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-espresso" role="status" aria-label="Loading AQUILA">
      <div data-emblem className="relative w-[min(88vw,470px)]">
        <svg viewBox="-10 -4 320 214" aria-hidden className="h-auto w-full overflow-visible">
          <circle data-halo cx="150" cy="108" r="112" fill="none" stroke="#faf0d7" strokeWidth="0.8" strokeOpacity="0.5" />
          {wing(WING_L, "l")}
          {wing(WING_R, "r")}
          <g data-body>
            {TAIL.map((d, i) => (
              <path key={i} d={d} fill="#e6d8b4" stroke="#453d38" strokeWidth="1.1" strokeLinejoin="round" />
            ))}
            <path d="M131 96 Q150 84 169 96 L165 132 Q150 148 135 132 Z" fill="#f5ead0" stroke="#453d38" strokeWidth="1.2" />
            <path d="M140 104 q10 6 20 0 M139 114 q11 7 22 0 M140 124 q10 6 20 0" fill="none" stroke="#453d38" strokeWidth="1" opacity="0.55" />
            {/* head in profile, facing right, with a hooked beak and a stern brow */}
            <path d="M146 96 C145 85 147 75 154 71 C160 69 165 71 168 75 C172 76 177 79 178 83 C176 86 173 87 170 86 C168 84 166 85 165 88 C162 93 156 97 146 96 Z" fill="#fbf3de" stroke="#453d38" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M168 75 C172 76 177 79 178 83 C176 86 173 87 170 86 C169 82 168 78 168 75 Z" fill="#d6b25a" stroke="#453d38" strokeWidth="1" strokeLinejoin="round" />
            <path d="M154 75 L165 77.5" stroke="#453d38" strokeWidth="1.8" strokeLinecap="round" />
            <ellipse cx="160.5" cy="79.2" rx="1.8" ry="1.5" fill="#453d38" />
            <path d="M149 88 q4 4 9 3 M148 83 q5 4 11 3" fill="none" stroke="#453d38" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      <div className="mt-8 w-[min(58vw,260px)] overflow-hidden text-ivory">
        <span data-mark className="aq-logo block w-full" />
      </div>
      <p data-tag className="mt-6 text-center text-[10px] uppercase tracking-[0.5em] text-sand opacity-0 md:text-[11px]" />
    </div>
  );
}

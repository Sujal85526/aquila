"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { markReady } from "@/lib/ready";

const SEEN = "aquila-v2-intro";
const CANVAS_W = 1520;
const CANVAS_H = 1020;
const PIVOT_X = 0.671;
const PIVOT_Y = 0.78;
const WING_UP = 6;
const WING_DOWN = -62;
const TEXT = "AQUILA · FOR THOSE WHO SEE FURTHER · AQUILA · FOR THOSE WHO SEE FURTHER · ";

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

const pageLoaded = () =>
  new Promise<void>((resolve) => {
    const done = () => resolve();
    if (document.readyState === "complete") return done();
    window.addEventListener("load", done, { once: true });
    setTimeout(done, 5000); // never trap the visitor behind the loader
  });

/**
 * Intro. An eagle circles the AQUILA seal — a ring of turning lettering with the wordmark inside —
 * in a flattened orbit, passing behind it and in front of it. When the page is ready the eagle
 * breaks away toward the corner and the ring opens outward like an iris, revealing the site.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const bg = useRef<SVGSVGElement>(null);
  const seal = useRef<SVGSVGElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLParagraphElement>(null);
  const bird = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLImageElement>(null);
  const wing = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = root.current!;
    const bgEl = bg.current!;
    const sealEl = seal.current!;
    const markEl = mark.current!;
    const tagEl = tag.current!;
    const birdEl = bird.current!;
    const bodyEl = body.current!;
    const wingEl = wing.current!;

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

    /* ---------- layout in real pixels ---------- */
    const W = window.innerWidth;
    const H = window.innerHeight;
    const R = clamp(Math.min(W, H) * 0.2, 88, 150);
    const cx = W / 2;
    const cy = H / 2 - 10;
    const reach = Math.hypot(W, H);
    const CW = clamp(R * 1.75, 150, 250);
    const CH = (CW * CANVAS_H) / CANVAS_W;
    const rx = Math.min(R * 1.85, W * 0.42);
    const ry = R * 0.5;

    for (const svg of [bgEl, sealEl]) svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const q = (root: Element, sel: string) => root.querySelector(sel)!;
    q(bgEl, "[data-hole]").setAttribute("cx", String(cx));
    q(bgEl, "[data-hole]").setAttribute("cy", String(cy));
    const ringEl = q(sealEl, "[data-ring]");
    const ring2El = q(sealEl, "[data-ring2]");
    for (const c of [ringEl, ring2El]) {
      c.setAttribute("cx", String(cx));
      c.setAttribute("cy", String(cy));
    }
    ringEl.setAttribute("r", String(R));
    ring2El.setAttribute("r", String(R * 0.9));
    const textR = R * 1.13;
    q(sealEl, "[data-textpath]").setAttribute("d", `M ${cx - textR} ${cy} a ${textR} ${textR} 0 1 1 ${2 * textR} 0 a ${textR} ${textR} 0 1 1 ${-2 * textR} 0`);
    const tp = q(sealEl, "textPath");
    tp.setAttribute("textLength", String(2 * Math.PI * textR - 2));
    (q(sealEl, "[data-text]") as SVGTextElement).style.fontSize = `${Math.max(9, R * 0.1)}px`;

    const markW = R * 1.42;
    markEl.style.width = `${markW}px`;
    markEl.style.left = `${cx - markW / 2}px`;
    markEl.style.top = `${cy - (markW * 297) / 996 / 2}px`;
    tagEl.style.top = `${cy + R * 1.75}px`;
    birdEl.style.width = `${CW}px`;
    birdEl.style.height = `${CH}px`;

    /* ---------- initial states ---------- */
    gsap.set([ringEl, ring2El], { drawSVG: "0%" });
    gsap.set(q(sealEl, "[data-text]"), { autoAlpha: 0 });
    gsap.set(markEl.firstElementChild, { y: 0, yPercent: 115 });
    gsap.set(tagEl, { autoAlpha: 0 });
    gsap.set(birdEl, { autoAlpha: 0 });

    const s = { th: 215, intro: 0, breakout: 0, flip: 1, phase: 0, energy: 0.9, boost: 0 };

    /* ---------- the eagle ---------- */
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      s.th += (s.breakout > 0 ? 80 : 150 + (1 - s.intro) * 60) * dt;
      const th = (s.th * Math.PI) / 180;
      const sin = Math.sin(th);
      const ox = cx + rx * Math.cos(th);
      const oy = cy + ry * sin;
      const e = 1 - Math.pow(1 - s.intro, 3);
      let x = ox + (1 - e) * (-W * 0.65 - ox + cx);
      let y = oy + (1 - e) * (-H * 0.3);
      const b = s.breakout * s.breakout;
      x += (W * 1.15 - x) * b;
      y += (-H * 0.25 - y) * b;

      // near side of the orbit is in front of the seal and larger, far side behind and smaller
      const depth = 0.86 + 0.24 * sin;
      const turn = clamp(-sin * 3.2, -1, 1);
      s.flip += ((s.breakout > 0 ? 1 : turn) - s.flip) * (1 - Math.exp(-dt * 12));
      const dx = -rx * sin;
      const dy = ry * Math.cos(th);
      const slope = (Math.atan2(dy, Math.abs(dx) + 1) * 180) / Math.PI;
      const pitch = (s.breakout > 0 ? -26 * s.breakout : clamp(slope * 0.5, -22, 22)) * (s.flip >= 0 ? 1 : -1);
      birdEl.style.zIndex = sin > 0 ? "4" : "1";

      const down = 0.5 - 0.5 * Math.sin(s.phase);
      s.phase += Math.PI * 2 * (2.5 + s.breakout * 1.5) * dt;
      wingEl.style.transform = `rotate(${(WING_UP + (WING_DOWN - WING_UP) * (0.85 + 0.15 * s.breakout) * down).toFixed(2)}deg)`;
      bodyEl.style.transform = `translateY(${(1.4 - 3.4 * down).toFixed(2)}%)`;
      birdEl.style.transform = `translate3d(${(x - PIVOT_X * CW).toFixed(1)}px, ${(y - PIVOT_Y * CH).toFixed(1)}px, 0) rotate(${pitch.toFixed(2)}deg) scaleX(${s.flip.toFixed(3)}) scale(${(depth * (1 + 0.9 * s.breakout)).toFixed(3)})`;
    };
    gsap.ticker.add(tick);

    /* ---------- timeline ---------- */
    const t0 = performance.now();
    const minHold = quick ? 1400 : 3600;
    const intro = gsap.timeline();
    intro
      .to(ringEl, { drawSVG: "100%", duration: quick ? 0.6 : 1.3, ease: "power2.inOut" }, 0)
      .to(ring2El, { drawSVG: "100%", duration: quick ? 0.6 : 1.5, ease: "power2.inOut" }, 0.15)
      .to(q(sealEl, "[data-text]"), { autoAlpha: 1, duration: 0.8 }, quick ? 0.2 : 0.7)
      .to(markEl.firstElementChild, { yPercent: 0, duration: quick ? 0.7 : 1.3, ease: "expo.out" }, quick ? 0.2 : 0.8)
      .to(birdEl, { autoAlpha: 1, duration: 0.3 }, quick ? 0 : 0.3)
      .to(s, { intro: 1, duration: quick ? 0.9 : 1.8, ease: "power2.out" }, quick ? 0 : 0.3)
      .to(tagEl, { autoAlpha: 1, duration: 0.2 }, quick ? 0.4 : 1.4)
      .to(tagEl, { duration: 1.2, scrambleText: { text: "For those who see further", chars: "upperCase", speed: 0.6, revealDelay: 0.2 } }, quick ? 0.4 : 1.4);
    const spin = gsap.to(q(sealEl, "[data-spin]"), { rotation: 360, svgOrigin: `${cx} ${cy}`, duration: 26, ease: "none", repeat: -1 });

    pageLoaded().then(() => {
      const wait = Math.max(0, minHold - (performance.now() - t0));
      gsap.delayedCall(wait / 1000, () => {
        spin.timeScale(0.2);
        gsap
          .timeline({
            onComplete: () => {
              gsap.ticker.remove(tick);
              spin.kill();
              finish();
            },
          })
          .to(tagEl, { autoAlpha: 0, duration: 0.3 }, 0)
          .to(markEl.firstElementChild, { yPercent: -115, duration: 0.55, ease: "power3.in" }, 0)
          .to(q(sealEl, "[data-text]"), { autoAlpha: 0, duration: 0.5 }, 0.1)
          .to(ring2El, { autoAlpha: 0, duration: 0.3 }, 0.1)
          // the eagle breaks away…
          .to(s, { breakout: 1, duration: 1.7, ease: "power2.in" }, 0.15)
          // …and the ring opens like an iris
          .to(q(bgEl, "[data-hole]"), { attr: { r: R * 0.97 }, duration: 0.5, ease: "power2.inOut" }, 0.45)
          .call(markReady, undefined, 0.8)
          .to(q(bgEl, "[data-hole]"), { attr: { r: reach }, duration: 1.3, ease: "aq" }, 0.95)
          .to(ringEl, { attr: { r: reach }, duration: 1.3, ease: "aq" }, 0.95)
          .to(ringEl, { autoAlpha: 0, duration: 0.4 }, 1.7)
          .to(birdEl, { autoAlpha: 0, duration: 0.35 }, 1.75);
      });
    });

    return () => {
      gsap.ticker.remove(tick);
      spin.kill();
    };
  }, []);

  return (
    <div ref={root} className="aq-loader fixed inset-0 z-[100]" role="status" aria-label="Loading AQUILA">
      {/* espresso screen with a hole that the ring opens */}
      <svg ref={bg} aria-hidden className="absolute inset-0 z-0 h-full w-full" viewBox="0 0 1000 700" preserveAspectRatio="none">
        <defs>
          <mask id="aq-iris-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
            <circle data-hole cx="500" cy="350" r="0" fill="#000" />
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="#453d38" mask="url(#aq-iris-mask)" />
      </svg>

      {/* the seal: ring + turning lettering */}
      <svg ref={seal} aria-hidden className="absolute inset-0 z-[2] h-full w-full" viewBox="0 0 1000 700" preserveAspectRatio="none">
        <defs>
          <path data-textpath id="aq-seal-path" d="M0 0" />
        </defs>
        <g fill="none" stroke="#faf0d7" strokeLinecap="round">
          <circle data-ring cx="500" cy="350" r="100" strokeWidth="1.6" />
          <circle data-ring2 cx="500" cy="350" r="90" strokeWidth="0.8" strokeOpacity="0.45" />
        </g>
        <g data-spin>
          <text data-text fill="#d8c7b5" style={{ letterSpacing: "0.32em", fontFamily: "var(--font-jost), system-ui" }}>
            <textPath href="#aq-seal-path" startOffset="0" lengthAdjust="spacing">{TEXT}</textPath>
          </text>
        </g>
      </svg>

      <div ref={mark} className="absolute z-[3] overflow-hidden text-ivory" style={{ width: 160 }}>
        <span className="aq-logo block w-full" />
      </div>
      <p ref={tag} className="absolute inset-x-0 z-[3] text-center text-[10px] uppercase tracking-[0.5em] text-sand opacity-0 md:text-[11px]" />

      {/* the eagle */}
      <div ref={bird} aria-hidden className="pointer-events-none absolute left-0 top-0 opacity-0 will-change-transform" style={{ zIndex: 1, transformOrigin: `${PIVOT_X * 100}% ${PIVOT_Y * 100}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={body} src="/eagle/body.webp" alt="" width={CANVAS_W} height={CANVAS_H} decoding="async" draggable={false} className="absolute inset-0 h-full w-full select-none" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={wing} src="/eagle/wing.webp" alt="" width={CANVAS_W} height={CANVAS_H} decoding="async" draggable={false} className="absolute inset-0 h-full w-full select-none" style={{ transformOrigin: `${PIVOT_X * 100}% ${PIVOT_Y * 100}%` }} />
      </div>
    </div>
  );
}

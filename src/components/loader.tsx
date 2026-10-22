"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { markReady } from "@/lib/ready";

const SEEN = "aquila-v2-intro";

const pageLoaded = () =>
  new Promise<void>((resolve) => {
    const done = () => resolve();
    if (document.readyState === "complete") return done();
    window.addEventListener("load", done, { once: true });
    setTimeout(done, 5000); // never trap the visitor behind the loader
  });

/**
 * "Lens" intro. A pair of sunglasses is drawn stroke by stroke, light sweeps across the lenses, the
 * wordmark rises and the tagline scrambles in — then both lenses open outward until they swallow the
 * screen and the site appears through them. Repeat visits in a session get a quicker version.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  // Lay the lenses out in real pixels before paint so they are centred on any screen.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const r = Math.min(Math.max(W * 0.085, 54), Math.min(W * 0.2, H * 0.16, 150));
    const gap = r * 0.42;
    const cx1 = W / 2 - r - gap / 2;
    const cx2 = W / 2 + r + gap / 2;
    const cy = H / 2 - Math.min(40, H * 0.05);
    el.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const set = (sel: string, attrs: Record<string, number | string>) =>
      el.querySelectorAll(sel).forEach((n, i) => Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, String(typeof v === "function" ? (v as (i: number) => number)(i) : v))));
    set("[data-lens]", { r, cy });
    el.querySelectorAll("[data-lens]").forEach((n, i) => n.setAttribute("cx", String(i ? cx2 : cx1)));
    el.querySelectorAll("[data-hole]").forEach((n, i) => {
      n.setAttribute("cx", String(i ? cx2 : cx1));
      n.setAttribute("cy", String(cy));
    });
    const bridge = el.querySelector("[data-bridge]")!;
    bridge.setAttribute("d", `M ${cx1 + r} ${cy - r * 0.18} Q ${W / 2} ${cy - r * 0.46} ${cx2 - r} ${cy - r * 0.18}`);
    const t1 = el.querySelector("[data-temple-l]")!;
    t1.setAttribute("d", `M ${cx1 - r} ${cy - r * 0.2} L ${cx1 - r * 1.55} ${cy - r * 0.34}`);
    const t2 = el.querySelector("[data-temple-r]")!;
    t2.setAttribute("d", `M ${cx2 + r} ${cy - r * 0.2} L ${cx2 + r * 1.55} ${cy - r * 0.34}`);
    el.querySelectorAll("[data-shine]").forEach((n, i) => {
      n.setAttribute("x", String((i ? cx2 : cx1) - r * 1.6));
      n.setAttribute("y", String(cy - r * 1.4));
      n.setAttribute("width", String(r * 0.9));
      n.setAttribute("height", String(r * 2.8));
    });
    el.querySelectorAll("[data-clip]").forEach((n, i) => {
      n.setAttribute("cx", String(i ? cx2 : cx1));
      n.setAttribute("cy", String(cy));
      n.setAttribute("r", String(r));
    });
    el.dataset.r = String(r);
    el.dataset.cy = String(cy);
    el.dataset.cx1 = String(cx1);
    el.dataset.cx2 = String(cx2);
    // wordmark sits under the lenses
    const mark = root.current!.querySelector<HTMLElement>("[data-wordmark]")!;
    mark.style.top = `${cy + r + Math.max(26, r * 0.45)}px`;
    mark.style.width = `${Math.min(Math.max(r * 3.1, 150), 360)}px`;
  }, []);

  useGSAP(
    () => {
      const el = root.current!;
      const s = svg.current!;
      const q = gsap.utils.selector(el);
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

      const r = Number(s.dataset.r);
      const W = window.innerWidth;
      const H = window.innerHeight;
      const reach = Math.hypot(W, H); // enough for either hole to cover the screen
      const strokes = q("[data-stroke]");
      gsap.set(strokes, { drawSVG: "0%" });
      gsap.set(q("[data-wordmark] [data-mark]"), { y: 0, yPercent: 115 });
      gsap.set(q("[data-tag]"), { autoAlpha: 0 });
      gsap.set(q("[data-shine]"), { x: 0, autoAlpha: 0 });

      const intro = gsap.timeline();
      if (quick) {
        intro.to(strokes, { drawSVG: "100%", duration: 0.55, stagger: 0.04, ease: "power2.out" }, 0)
          .to(q("[data-wordmark] [data-mark]"), { yPercent: 0, duration: 0.7, ease: "expo.out" }, 0.1);
      } else {
        intro
          .to(q("[data-ring]"), { drawSVG: "100%", duration: 1.5, stagger: 0.12, ease: "power2.inOut" }, 0)
          .to(q("[data-bridge]"), { drawSVG: "100%", duration: 0.7, ease: "power2.out" }, 1.0)
          .to(q("[data-temple-l], [data-temple-r]"), { drawSVG: "100%", duration: 0.6, ease: "power2.out" }, 1.25)
          .to(q("[data-wordmark] [data-mark]"), { yPercent: 0, duration: 1.3, ease: "expo.out" }, 1.0)
          .to(q("[data-tag]"), { autoAlpha: 1, duration: 0.2 }, 1.3)
          .to(q("[data-tag]"), { duration: 1.3, scrambleText: { text: "For those who see further", chars: "upperCase", speed: 0.6, revealDelay: 0.25 } }, 1.3)
          .to(q("[data-shine]"), { autoAlpha: 1, duration: 0.01 }, 1.5)
          .fromTo(q("[data-shine]"), { x: 0 }, { x: r * 3.4, duration: 1.1, stagger: 0.08, ease: "power2.inOut" }, 1.5)
          .to(q("[data-shine]"), { autoAlpha: 0, duration: 0.2 }, 2.45);
      }
      intro.call(() => {
        intro.pause();
        pageLoaded().then(() => {
          const out = gsap.timeline({ onComplete: finish });
          out
            .to(q("[data-tag]"), { autoAlpha: 0, duration: 0.3 }, 0)
            .to(q("[data-wordmark] [data-mark]"), { yPercent: -115, duration: 0.6, ease: "power3.in" }, 0)
            .to(q("[data-bridge], [data-temple-l], [data-temple-r]"), { autoAlpha: 0, duration: 0.3 }, 0.05)
            // the lenses open: the mask holes and the lens rings grow together
            .to(q("[data-hole]"), { attr: { r: reach }, duration: 1.45, ease: "aq" }, 0.35)
            .to(q("[data-ring]"), { attr: { r: reach }, duration: 1.45, ease: "aq" }, 0.35)
            .to(q("[data-ring]"), { autoAlpha: 0, duration: 0.5 }, 0.9)
            .call(markReady, undefined, 0.75);
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="aq-loader fixed inset-0 z-[100]" role="status" aria-label="Loading AQUILA">
      <svg ref={svg} aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 1000 700" preserveAspectRatio="none">
        <defs>
          <mask id="aq-lens-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
            <circle data-hole cx="400" cy="300" r="0" fill="#000" />
            <circle data-hole cx="600" cy="300" r="0" fill="#000" />
          </mask>
          <clipPath id="aq-clip-l"><circle data-clip cx="400" cy="300" r="60" /></clipPath>
          <clipPath id="aq-clip-r"><circle data-clip cx="600" cy="300" r="60" /></clipPath>
          <linearGradient id="aq-shine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#faf0d7" stopOpacity="0" />
            <stop offset="0.5" stopColor="#faf0d7" stopOpacity="0.5" />
            <stop offset="1" stopColor="#faf0d7" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="#453d38" mask="url(#aq-lens-mask)" />
        <g fill="none" stroke="#faf0d7" strokeWidth="2" strokeLinecap="round">
          <circle data-stroke data-ring data-lens cx="400" cy="300" r="60" />
          <circle data-stroke data-ring data-lens cx="600" cy="300" r="60" />
          <path data-stroke data-bridge d="M0 0" />
          <path data-stroke data-temple-l d="M0 0" />
          <path data-stroke data-temple-r d="M0 0" />
        </g>
        <g clipPath="url(#aq-clip-l)"><rect data-shine x="0" y="0" width="10" height="10" fill="url(#aq-shine)" transform="skewX(-14)" /></g>
        <g clipPath="url(#aq-clip-r)"><rect data-shine x="0" y="0" width="10" height="10" fill="url(#aq-shine)" transform="skewX(-14)" /></g>
      </svg>

      <div data-wordmark className="absolute left-1/2 -translate-x-1/2 overflow-hidden text-ivory" style={{ top: "62%", width: 220 }}>
        <span data-mark className="aq-logo block w-full" />
      </div>
      <p data-tag className="absolute inset-x-0 bottom-[9%] text-center text-[10px] uppercase tracking-[0.5em] text-sand opacity-0 md:text-[11px]">
        For those who see further
      </p>
    </div>
  );
}

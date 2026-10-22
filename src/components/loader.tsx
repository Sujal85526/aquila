"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { markReady } from "@/lib/ready";
import { INTRO_KEY } from "@/lib/intro";

const pageLoaded = () =>
  new Promise<void>((resolve) => {
    const done = () => resolve();
    if (document.readyState === "complete") return done();
    window.addEventListener("load", done, { once: true });
    setTimeout(done, 5000); // never trap the visitor behind the loader
  });

/**
 * Plain, quiet intro: the AQUILA wordmark fades up out of a blur on a solid espresso screen, holds
 * for at least 2.2 seconds (and until the page has loaded), then the whole screen fades away while
 * the wordmark drifts up, softens and disappears. Shown once per session.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current!;
    const mark = logo.current!;
    const finish = () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      el.style.display = "none";
    };

    let seen = false;
    try {
      seen = !!sessionStorage.getItem(INTRO_KEY);
    } catch {}
    if (seen || prefersReducedMotion()) {
      el.style.display = "none";
      markReady();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    gsap.fromTo(mark, { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 2, ease: "expo.out" });

    let minTime = false;
    let loaded = false;
    const leave = () => {
      if (!(minTime && loaded)) return;
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {}
      markReady();
      gsap.to(mark, { y: -80, opacity: 0, filter: "blur(4px)", duration: 1.5, ease: "expo.out" });
      gsap.to(el, { opacity: 0, duration: 1.5, ease: "expo.out", onComplete: finish });
    };
    const t = setTimeout(() => {
      minTime = true;
      leave();
    }, 2200);
    pageLoaded().then(() => {
      loaded = true;
      leave();
    });

    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={root} className="aq-loader fixed inset-0 z-[100] flex items-center justify-center bg-espresso text-ivory" role="status" aria-label="Loading AQUILA">
      <span ref={logo} className="aq-logo w-[min(60vw,180px)] opacity-0 md:w-[min(40vw,420px)]" />
    </div>
  );
}
